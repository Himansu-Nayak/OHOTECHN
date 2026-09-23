package com.ohotech.backend.service.ai;

import com.ohotech.backend.dto.ai.ImageAnalysisResponse;
import com.ohotech.backend.exception.AiServiceException;
import com.ohotech.backend.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiImageService {

    private final GeminiService geminiService;
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/jpg");

    public ImageAnalysisResponse analyzeImage(MultipartFile file, String context) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded image cannot be empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Image size exceeds maximum limit of 10MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid image format. Supported formats: JPEG, PNG, WebP.");
        }

        if (!geminiService.isConfigured()) {
            throw new AiServiceException("Google Gemini AI platform is not configured. Please set GEMINI_API_KEY to enable image analysis.");
        }

        try {
            byte[] bytes = file.getBytes();
            String base64Data = Base64.getEncoder().encodeToString(bytes);

            String prompt = String.format("""
                Analyze this product or UI screenshot image:
                Context: %s

                Extract:
                1. Visual description
                2. Likely software or product category
                3. Detected UI attributes (buttons, dashboards, modules, colors)
                4. High-accessibility SEO Alt-Text
                5. Visual quality rating (EXCELLENT, GOOD, POOR)

                Return valid JSON matching:
                {
                  "description": "...",
                  "detectedCategory": "...",
                  "attributes": {"resolution": "...", "style": "..."},
                  "altText": "...",
                  "visualQualityRating": "EXCELLENT"
                }
                """, context != null ? context : "Software UI / Product Asset");

            String systemInstruction = "You are an enterprise computer vision and product catalog AI analyst. Always return pure, valid JSON.";
            return geminiService.generateMultimodalStructured(prompt, contentType, base64Data, systemInstruction, ImageAnalysisResponse.class);
        } catch (BadRequestException | AiServiceException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to analyze image {}: {}", file.getOriginalFilename(), e.getMessage());
            throw new AiServiceException("Failed to analyze image: " + e.getMessage());
        }
    }
}
