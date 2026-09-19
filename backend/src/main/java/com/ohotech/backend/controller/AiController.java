package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.ai.*;
import com.ohotech.backend.entity.AIConversation;
import com.ohotech.backend.entity.AIMessage;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.AIConversationRepository;
import com.ohotech.backend.repository.AIMessageRepository;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.ai.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiSupportAgentService supportAgentService;
    private final AiProductService productService;
    private final AiDocumentService documentService;
    private final AiImageService imageService;
    private final AiClassifierService classifierService;
    private final AiSemanticSearchService semanticSearchService;
    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(
            @Valid @RequestBody AiChatRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long userId = currentUser != null ? currentUser.getId() : null;
        AiChatResponse response = supportAgentService.processMessage(request, userId);
        return ResponseEntity.ok(ApiResponse.success("AI Response generated successfully", response));
    }

    @PostMapping("/support")
    public ResponseEntity<ApiResponse<AiChatResponse>> support(
            @Valid @RequestBody AiChatRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        Long userId = currentUser != null ? currentUser.getId() : null;
        if (request.getFeature() == null) {
            request.setFeature("SUPPORT");
        }
        AiChatResponse response = supportAgentService.processMessage(request, userId);
        return ResponseEntity.ok(ApiResponse.success("AI Support response generated", response));
    }

    @PostMapping("/product/recommend")
    public ResponseEntity<ApiResponse<AiRecommendationResponse>> recommend(
            @RequestBody AiRecommendationRequest request) {

        AiRecommendationResponse response = productService.recommendProducts(request);
        return ResponseEntity.ok(ApiResponse.success("AI Recommendations generated", response));
    }

    @PostMapping("/classify")
    public ResponseEntity<ApiResponse<AiClassificationResponse>> classify(
            @RequestBody Map<String, String> payload) {

        String query = payload.getOrDefault("query", "");
        AiClassificationResponse response = classifierService.classifyQuery(query);
        return ResponseEntity.ok(ApiResponse.success("Query classified successfully", response));
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<SemanticSearchResponse>> search(
            @RequestBody Map<String, Object> payload) {

        String query = payload.getOrDefault("query", "").toString();
        int limit = payload.containsKey("limit") ? Integer.parseInt(payload.get("limit").toString()) : 5;
        SemanticSearchResponse response = semanticSearchService.search(query, limit);
        return ResponseEntity.ok(ApiResponse.success("Semantic search completed", response));
    }

    @PostMapping("/document/analyze")
    public ResponseEntity<ApiResponse<DocumentAnalysisResponse>> analyzeDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "prompt", required = false) String prompt) {

        DocumentAnalysisResponse response = documentService.analyzeDocument(file, prompt);
        return ResponseEntity.ok(ApiResponse.success("Document analysis complete", response));
    }

    @PostMapping("/image/analyze")
    public ResponseEntity<ApiResponse<ImageAnalysisResponse>> analyzeImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "context", required = false) String context) {

        ImageAnalysisResponse response = imageService.analyzeImage(file, context);
        return ResponseEntity.ok(ApiResponse.success("Image analysis complete", response));
    }

    @GetMapping("/conversations")
    public ResponseEntity<ApiResponse<List<AIConversation>>> getUserConversations(
            @AuthenticationPrincipal UserPrincipal currentUser) {

        if (currentUser == null) {
            return ResponseEntity.ok(ApiResponse.success("No authenticated user", List.of()));
        }

        List<AIConversation> convs = conversationRepository.findByUserIdOrderByUpdatedAtDesc(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User conversations retrieved", convs));
    }

    @GetMapping("/conversations/{id}")
    public ResponseEntity<ApiResponse<List<AIMessage>>> getConversationMessages(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AIConversation conv = conversationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AIConversation", "id", id));

        if (conv.getUser() != null && (currentUser == null || !conv.getUser().getId().equals(currentUser.getId()))) {
            throw new ResourceNotFoundException("AIConversation", "id", id);
        }

        List<AIMessage> messages = messageRepository.findByConversationIdOrderByCreatedAtAsc(id);
        return ResponseEntity.ok(ApiResponse.success("Messages retrieved", messages));
    }

    @DeleteMapping("/conversations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        AIConversation conv = conversationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AIConversation", "id", id));

        if (conv.getUser() != null && (currentUser == null || !conv.getUser().getId().equals(currentUser.getId()))) {
            throw new ResourceNotFoundException("AIConversation", "id", id);
        }

        conversationRepository.delete(conv);
        return ResponseEntity.ok(ApiResponse.success("Conversation deleted successfully"));
    }
}
