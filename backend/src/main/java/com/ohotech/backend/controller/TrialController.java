package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.TrialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TrialController {

    private final TrialService trialService;

    @PostMapping("/products/{productId}/trial")
    public ResponseEntity<ApiResponse<Map<String, Object>>> startFreeTrial(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId) {
        Map<String, Object> trialDetails = trialService.startFreeTrial(currentUser.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Free trial activated successfully", trialDetails));
    }
}
