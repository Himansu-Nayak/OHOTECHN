package com.ohotech.backend.dto.ai;

import com.ohotech.backend.dto.ProductDto;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AiChatResponse {
    private Long conversationId;
    private String message;
    private String role;
    private List<String> suggestedQuestions;
    private List<String> executedTools;
    private List<ProductDto> products;
    private LocalDateTime timestamp;
}
