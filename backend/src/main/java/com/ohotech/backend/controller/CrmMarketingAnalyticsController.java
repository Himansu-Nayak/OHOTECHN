package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.CrmMarketingAnalyticsDto;
import com.ohotech.backend.service.CrmMarketingAnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/crm/analytics")
@RequiredArgsConstructor
@Slf4j
public class CrmMarketingAnalyticsController {

    private final CrmMarketingAnalyticsService analyticsService;

    @GetMapping("/marketing")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CrmMarketingAnalyticsDto>> getMarketingAnalytics() {
        log.info("Admin fetching CRM marketing analytics");
        CrmMarketingAnalyticsDto analytics = analyticsService.getMarketingAnalytics();
        return ResponseEntity.ok(ApiResponse.success("CRM marketing analytics fetched successfully", analytics));
    }
}
