package com.ohotech.backend.controller;

import com.ohotech.backend.dto.AnalyticsDto;
import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_DEVELOPER', 'ADMIN', 'DEVELOPER')")
    public ResponseEntity<ApiResponse<AnalyticsDto>> getDashboardAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        AnalyticsDto analytics = analyticsService.getDashboardAnalytics(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Analytics metrics fetched successfully", analytics));
    }
}
