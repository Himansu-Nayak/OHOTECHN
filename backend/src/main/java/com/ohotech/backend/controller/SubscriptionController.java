package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.Subscription;
import com.ohotech.backend.entity.SubscriptionStatus;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // Customer Endpoints
    @GetMapping("/subscriptions/my")
    public ResponseEntity<ApiResponse<List<Subscription>>> getMySubscriptions(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<Subscription> subscriptions = subscriptionService.getUserSubscriptions(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Subscriptions retrieved successfully", subscriptions));
    }

    @GetMapping("/subscriptions/{id}")
    public ResponseEntity<ApiResponse<Subscription>> getSubscriptionById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        Subscription subscription = subscriptionService.getSubscriptionById(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Subscription details fetched", subscription));
    }

    @PostMapping("/subscriptions/{id}/cancel")
    public ResponseEntity<ApiResponse<Subscription>> cancelSubscription(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        Subscription cancelled = subscriptionService.cancelSubscription(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Subscription cancelled successfully", cancelled));
    }

    // Admin / Developer Endpoints
    @GetMapping("/admin/subscriptions")
    public ResponseEntity<ApiResponse<List<Subscription>>> getAllSubscriptionsAdmin() {
        List<Subscription> subscriptions = subscriptionService.getAllSubscriptionsAdmin();
        return ResponseEntity.ok(ApiResponse.success("All subscriptions retrieved", subscriptions));
    }

    @GetMapping("/admin/subscriptions/{id}")
    public ResponseEntity<ApiResponse<Subscription>> getSubscriptionByIdAdmin(@PathVariable Long id) {
        Subscription subscription = subscriptionService.getSubscriptionByIdAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("Subscription details retrieved", subscription));
    }

    @PatchMapping("/admin/subscriptions/{id}/status")
    public ResponseEntity<ApiResponse<Subscription>> updateSubscriptionStatusAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'status' is required"));
        }
        SubscriptionStatus status = SubscriptionStatus.valueOf(statusStr.toUpperCase());
        Subscription updated = subscriptionService.updateSubscriptionStatusAdmin(id, status);
        return ResponseEntity.ok(ApiResponse.success("Subscription status updated successfully", updated));
    }
}
