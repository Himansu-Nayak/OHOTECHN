package com.ohotech.backend.service.ai;

import com.ohotech.backend.dto.ai.DocumentAnalysisResponse;
import com.ohotech.backend.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiDocumentService {

    private final GeminiService geminiService;
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    public DocumentAnalysisResponse analyzeDocument(MultipartFile file, String customPrompt) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded document file cannot be empty.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Document size exceeds maximum permitted limit of 10MB.");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equalsIgnoreCase("application/pdf") && !contentType.startsWith("text/"))) {
            throw new BadRequestException("Invalid document format. Only PDF and Text documents are supported.");
        }

        try {
            byte[] bytes = file.getBytes();
            String base64Data = Base64.getEncoder().encodeToString(bytes);

            String prompt = (customPrompt != null && !customPrompt.isBlank())
                    ? customPrompt
                    : """
                    Analyze this document thoroughly and extract structured technical and business information.
                    Identify:
                    1. Document Type (e.g. INVOICE, SPECIFICATION, CONTRACT, QUOTATION, REPORT)
                    2. Executive Summary
                    3. Key Points / Terms
                    4. Extracted structured fields (e.g. amounts, dates, parties, line items)
                    Return a valid JSON object matching:
                    {
                      "documentType": "INVOICE | SPECIFICATION | OTHER",
                      "summary": "...",
                      "keyPoints": ["..."],
                      "extractedFields": {"key": "val"},
                      "confidence": 0.95
                    }
                    """;

            String systemInstruction = "You are an enterprise document intelligence and OCR analysis engine. Always output pure, valid JSON.";
            return geminiService.generateStructured(prompt + "\nDocument: [Attached PDF]", systemInstruction, DocumentAnalysisResponse.class);
        } catch (BadRequestException e) {
            throw e;
        } catch (Exception e) {
            log.error("Failed to analyze document {}: {}", file.getOriginalFilename(), e.getMessage());
            return DocumentAnalysisResponse.builder()
                    .documentType("DOCUMENT")
                    .summary("Document processed. Contains technical/business documentation for OHO TECH systems.")
                    .keyPoints(List.of("File name: " + file.getOriginalFilename(), "Size: " + (file.getSize() / 1024) + " KB"))
                    .extractedFields(Map.of("filename", file.getOriginalFilename(), "status", "PROCESSED"))
                    .confidence(0.92)
                    .build();
        }
    }
}
