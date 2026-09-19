package com.ohotech.backend.service.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.ContactRequest;
import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.dto.ai.AiChatRequest;
import com.ohotech.backend.dto.ai.AiChatResponse;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.AIConversationRepository;
import com.ohotech.backend.repository.AIMessageRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.service.ContactService;
import com.ohotech.backend.service.OrderService;
import com.ohotech.backend.service.ProductService;
import com.ohotech.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiSupportAgentService {

    private final GeminiService geminiService;
    private final ProductService productService;
    private final OrderService orderService;
    private final SubscriptionService subscriptionService;
    private final ContactService contactService;
    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    private static final String SYSTEM_PROMPT = """
        You are the official AI Technology Advisor and Customer Support Assistant for OHO TECH.
        OHO TECH is a full-stack enterprise software engineering platform with 28+ turnkey software solutions,
        custom cloud development, enterprise CRM/ERP, and digital growth services.

        Guidelines:
        1. Answer customer questions professionally, concisely, and accurately.
        2. Help users navigate OHO TECH products, explain technical features, and provide architecture guidance.
        3. Never invent prices, product availability, or order statuses.
        4. If the user asks about an order, advise them of their actual order details or guide them to check their Orders tab.
        5. For dynamic product lookups or support escalation, state clearly what actions were taken.
        """;

    @Transactional
    public AiChatResponse processMessage(AiChatRequest request, Long authenticatedUserId) {
        // 1. Resolve or create AIConversation
        AIConversation conversation = resolveConversation(request, authenticatedUserId);

        // 2. Save incoming User message
        AIMessage userMsg = AIMessage.builder()
                .conversation(conversation)
                .role("user")
                .content(request.getMessage())
                .build();
        messageRepository.save(userMsg);

        // 3. Check for tool triggers (e.g. order lookup, product search)
        List<String> executedTools = new ArrayList<>();
        List<ProductDto> matchedProducts = new ArrayList<>();
        String augmentedContext = "";

        String lowerInput = request.getMessage().toLowerCase();

        // Tool Trigger: Order Status check
        if (lowerInput.contains("order") && (lowerInput.contains("status") || lowerInput.contains("#") || lowerInput.contains("track") || lowerInput.contains("where"))) {
            executedTools.add("getOrderStatus");
            if (authenticatedUserId != null) {
                try {
                    List<Order> orders = orderService.getUserOrders(authenticatedUserId);
                    if (!orders.isEmpty()) {
                        Order latest = orders.get(0);
                        augmentedContext += String.format("\n[System Context: User has %d orders. Latest Order #%d is %s, Total: ₹%s, Placed: %s]",
                                orders.size(), latest.getId(), latest.getStatus(), latest.getTotalAmount(), latest.getCreatedAt());
                    } else {
                        augmentedContext += "\n[System Context: User has no previous orders in their account]";
                    }
                } catch (Exception e) {
                    log.warn("Order context lookup error: {}", e.getMessage());
                }
            } else {
                augmentedContext += "\n[System Context: Visitor is not logged in. Advise them to log in to view personal order status or provide their Order ID]";
            }
        }

        // Tool Trigger: Product search
        if (lowerInput.contains("software") || lowerInput.contains("erp") || lowerInput.contains("pos") || lowerInput.contains("crm") || lowerInput.contains("price") || lowerInput.contains("app") || lowerInput.contains("recommend")) {
            executedTools.add("searchProducts");
            try {
                Page<ProductDto> activeProds = productService.getActiveProducts(0, 5, extractKeywords(lowerInput), null);
                if (activeProds.hasContent()) {
                    matchedProducts.addAll(activeProds.getContent());
                    StringBuilder sb = new StringBuilder("\n[Relevant OHO TECH Products:");
                    for (ProductDto p : activeProds.getContent()) {
                        sb.append(String.format("\n- %s (₹%s): %s", p.getName(), p.getPrice(), p.getDescription()));
                    }
                    sb.append("]");
                    augmentedContext += sb.toString();
                }
            } catch (Exception e) {
                log.warn("Product search lookup error: {}", e.getMessage());
            }
        }

        // 4. Build prompt with context
        String fullPrompt = request.getMessage();
        if (!augmentedContext.isEmpty()) {
            fullPrompt += "\n\nContext:" + augmentedContext;
        }

        // 5. Generate AI Response
        String aiReplyText = geminiService.generateText(fullPrompt, SYSTEM_PROMPT);

        // 6. Save model reply
        AIMessage modelMsg = AIMessage.builder()
                .conversation(conversation)
                .role("model")
                .content(aiReplyText)
                .build();
        messageRepository.save(modelMsg);

        // 7. Update conversation title if new
        if ("New Conversation".equals(conversation.getTitle())) {
            conversation.setTitle(generateTitle(request.getMessage()));
            conversationRepository.save(conversation);
        }

        // 8. Prepare suggested questions
        List<String> suggestedQuestions = Arrays.asList(
                "Tell me about OHO TECH's Hospital Management Software",
                "What ERP solutions are available for schools?",
                "How do I request a custom software development quote?",
                "Can I integrate existing biometric hardware?"
        );

        return AiChatResponse.builder()
                .conversationId(conversation.getId())
                .message(aiReplyText)
                .role("model")
                .executedTools(executedTools)
                .products(matchedProducts)
                .suggestedQuestions(suggestedQuestions)
                .timestamp(LocalDateTime.now())
                .build();
    }

    private AIConversation resolveConversation(AiChatRequest request, Long userId) {
        if (request.getConversationId() != null) {
            Optional<AIConversation> opt = conversationRepository.findById(request.getConversationId());
            if (opt.isPresent()) {
                AIConversation conv = opt.get();
                if (userId == null || conv.getUser() == null || conv.getUser().getId().equals(userId)) {
                    return conv;
                }
            }
        }

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        AIConversation newConv = AIConversation.builder()
                .user(user)
                .sessionId(request.getSessionId() != null ? request.getSessionId() : UUID.randomUUID().toString())
                .title("New Conversation")
                .feature(request.getFeature() != null ? request.getFeature() : "CHATBOT")
                .build();

        return conversationRepository.save(newConv);
    }

    private String extractKeywords(String input) {
        String clean = input.replaceAll("(?i)\\b(i|need|want|show|me|the|software|system|for|a|an|in|with)\\b", "").trim();
        return clean.length() > 2 ? clean : "";
    }

    private String generateTitle(String message) {
        if (message == null || message.isBlank()) return "AI Conversation";
        String trimmed = message.trim();
        return trimmed.length() > 40 ? trimmed.substring(0, 37) + "..." : trimmed;
    }
}
