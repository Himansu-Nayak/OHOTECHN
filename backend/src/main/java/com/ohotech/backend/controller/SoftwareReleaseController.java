package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.SoftwareReleaseDto;
import com.ohotech.backend.entity.Product;
import com.ohotech.backend.entity.SoftwareRelease;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.SoftwareReleaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

import com.ohotech.backend.service.AuditService;
import com.ohotech.backend.service.SoftwareReleaseService;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SoftwareReleaseController {

    private final SoftwareReleaseService softwareReleaseService;
    private final AuditService auditService;

    // Customer Entitlement Endpoints
    @GetMapping("/products/my")
    public ResponseEntity<ApiResponse<List<Product>>> getMyEntitledProducts(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Authentication required"));
        }
        List<Product> products = softwareReleaseService.getEntitledProducts(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Entitled products retrieved", products));
    }

    @GetMapping("/products/my/{productId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyEntitledProductDetails(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Authentication required"));
        }
        boolean entitled = softwareReleaseService.isUserEntitledToProduct(currentUser.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Entitlement status fetched", Map.of("productId", productId, "entitled", entitled)));
    }

    @GetMapping("/products/my/{productId}/releases")
    public ResponseEntity<ApiResponse<List<SoftwareReleaseDto>>> getEntitledReleases(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Authentication required"));
        }
        List<SoftwareReleaseDto> releases = softwareReleaseService.getEntitledProductReleases(currentUser.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Product releases retrieved", releases));
    }

    @GetMapping("/products/my/{productId}/download/{releaseId}")
    public ResponseEntity<byte[]> downloadRelease(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long productId,
            @PathVariable Long releaseId) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        SoftwareRelease release = softwareReleaseService.getSoftwareReleaseForDownload(currentUser.getId(), productId, releaseId);

        // Audit download activity
        auditService.logEvent("SOFTWARE_DOWNLOADED", "SoftwareRelease", String.valueOf(release.getId()),
                "Downloaded release v" + release.getVersion() + " (" + release.getPlatform() + ") for product " + release.getProduct().getName());

        // Generate digital package binary payload for release download
        String content = "OHO TECHN SOFTWARE RELEASE\n" +
                         "Product: " + release.getProduct().getName() + "\n" +
                         "Version: " + release.getVersion() + "\n" +
                         "Platform: " + release.getPlatform() + "\n" +
                         "Release Notes:\n" + (release.getReleaseNotes() != null ? release.getReleaseNotes() : "Standard Release") + "\n" +
                         "License Notice: This binary is licensed to " + currentUser.getEmail() + ".\n";

        byte[] binaryData = content.getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", release.getFileName() != null ? release.getFileName() : "release-v" + release.getVersion() + ".zip");
        headers.setContentLength(binaryData.length);

        return new ResponseEntity<>(binaryData, headers, HttpStatus.OK);
    }

    // Admin / Developer Endpoints
    @GetMapping("/admin/products/{productId}/releases")
    public ResponseEntity<ApiResponse<List<SoftwareReleaseDto>>> getAdminReleases(@PathVariable Long productId) {
        List<SoftwareReleaseDto> releases = softwareReleaseService.getAdminReleases(productId);
        return ResponseEntity.ok(ApiResponse.success("Admin product releases retrieved", releases));
    }

    @PostMapping("/admin/products/{productId}/releases")
    public ResponseEntity<ApiResponse<SoftwareReleaseDto>> createRelease(
            @PathVariable Long productId,
            @Valid @RequestBody SoftwareReleaseDto dto) {
        SoftwareReleaseDto created = softwareReleaseService.createRelease(productId, dto);
        return ResponseEntity.ok(ApiResponse.success("Software release created successfully", created));
    }

    @PutMapping("/admin/releases/{releaseId}")
    public ResponseEntity<ApiResponse<SoftwareReleaseDto>> updateRelease(
            @PathVariable Long releaseId,
            @RequestBody SoftwareReleaseDto dto) {
        SoftwareReleaseDto updated = softwareReleaseService.updateRelease(releaseId, dto);
        return ResponseEntity.ok(ApiResponse.success("Software release updated successfully", updated));
    }

    @PatchMapping("/admin/releases/{releaseId}/status")
    public ResponseEntity<ApiResponse<SoftwareReleaseDto>> toggleReleaseStatus(
            @PathVariable Long releaseId,
            @RequestBody Map<String, Boolean> payload) {
        Boolean active = payload.get("active");
        if (active == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'active' is required"));
        }
        SoftwareReleaseDto updated = softwareReleaseService.toggleReleaseStatus(releaseId, active);
        return ResponseEntity.ok(ApiResponse.success("Software release status updated successfully", updated));
    }

    @DeleteMapping("/admin/releases/{releaseId}")
    public ResponseEntity<ApiResponse<String>> deleteRelease(@PathVariable Long releaseId) {
        softwareReleaseService.deleteRelease(releaseId);
        return ResponseEntity.ok(ApiResponse.success("Software release deleted successfully", null));
    }
}
