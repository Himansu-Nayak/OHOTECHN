package com.ohotech.backend.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatRequest {
    private Long conversationId;
    private String sessionId;
    @NotBlank(message = "Message cannot be blank")
    private String message;
    private String feature; // CHATBOT, SUPPORT, RECOMMENDER
}
