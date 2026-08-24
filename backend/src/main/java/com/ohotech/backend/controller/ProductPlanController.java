package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.ProductPlanDto;
import com.ohotech.backend.service.ProductPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ProductPlanController {

    private final ProductPlanService productPlanService;

    // Public / Customer endpoint
    @GetMapping("/products/{productId}/plans")
    public ResponseEntity<ApiResponse<List<ProductPlanDto>>> getActivePlans(@PathVariable Long productId) {
        List<ProductPlanDto> plans = productPlanService.getActivePlansByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success("Active product plans retrieved", plans));
    }

    // Admin / Developer endpoints
    @GetMapping("/admin/products/{productId}/plans")
    public ResponseEntity<ApiResponse<List<ProductPlanDto>>> getAdminPlans(@PathVariable Long productId) {
        List<ProductPlanDto> plans = productPlanService.getAdminPlansByProductId(productId);
        return ResponseEntity.ok(ApiResponse.success("Admin product plans retrieved", plans));
    }

    @PostMapping("/admin/products/{productId}/plans")
    public ResponseEntity<ApiResponse<ProductPlanDto>> createPlan(
            @PathVariable Long productId,
            @Valid @RequestBody ProductPlanDto dto) {
        ProductPlanDto created = productPlanService.createPlan(productId, dto);
        return ResponseEntity.ok(ApiResponse.success("Product plan created successfully", created));
    }

    @PutMapping("/admin/plans/{planId}")
    public ResponseEntity<ApiResponse<ProductPlanDto>> updatePlan(
            @PathVariable Long planId,
            @RequestBody ProductPlanDto dto) {
        ProductPlanDto updated = productPlanService.updatePlan(planId, dto);
        return ResponseEntity.ok(ApiResponse.success("Product plan updated successfully", updated));
    }

    @PatchMapping("/admin/plans/{planId}/status")
    public ResponseEntity<ApiResponse<ProductPlanDto>> togglePlanStatus(
            @PathVariable Long planId,
            @RequestBody Map<String, Boolean> payload) {
        Boolean active = payload.get("active");
        if (active == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'active' is required"));
        }
        ProductPlanDto updated = productPlanService.togglePlanStatus(planId, active);
        return ResponseEntity.ok(ApiResponse.success("Product plan status updated successfully", updated));
    }

    @DeleteMapping("/admin/plans/{planId}")
    public ResponseEntity<ApiResponse<String>> deletePlan(@PathVariable Long planId) {
        productPlanService.deletePlan(planId);
        return ResponseEntity.ok(ApiResponse.success("Product plan deleted successfully", null));
    }
}
