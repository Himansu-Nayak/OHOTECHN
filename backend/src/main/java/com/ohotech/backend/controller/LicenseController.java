package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.DeviceActivationRequest;
import com.ohotech.backend.entity.DeviceActivation;
import com.ohotech.backend.entity.License;
import com.ohotech.backend.entity.LicenseStatus;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.LicenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LicenseController {

    private final LicenseService licenseService;

    // Customer Endpoints
    @GetMapping("/licenses/my")
    public ResponseEntity<ApiResponse<List<License>>> getMyLicenses(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<License> licenses = licenseService.getUserLicenses(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Licenses retrieved successfully", licenses));
    }

    @GetMapping("/licenses/{id}")
    public ResponseEntity<ApiResponse<License>> getLicenseById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        License license = licenseService.getLicenseById(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("License details fetched", license));
    }

    @GetMapping("/licenses/key/{licenseKey}")
    public ResponseEntity<ApiResponse<License>> getLicenseByKey(@PathVariable String licenseKey) {
        License license = licenseService.getLicenseByKey(licenseKey);
        return ResponseEntity.ok(ApiResponse.success("License details retrieved", license));
    }

    // Device Activation / Deactivation
    @PostMapping("/licenses/{licenseKey}/activate")
    public ResponseEntity<ApiResponse<DeviceActivation>> activateDevice(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String licenseKey,
            @Valid @RequestBody DeviceActivationRequest request) {
        try {
            Long userId = currentUser != null ? currentUser.getId() : null;
            DeviceActivation activation = licenseService.activateDevice(userId, licenseKey, request);
            return ResponseEntity.ok(ApiResponse.success("Device activated successfully", activation));
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(LicenseController.class).error("Error activating device: " + e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/licenses/{licenseKey}/deactivate")
    public ResponseEntity<ApiResponse<DeviceActivation>> deactivateDevice(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable String licenseKey,
            @RequestBody Map<String, String> payload) {
        String deviceIdentifier = payload.get("deviceIdentifier");
        if (deviceIdentifier == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'deviceIdentifier' is required"));
        }
        Long userId = currentUser != null ? currentUser.getId() : null;
        DeviceActivation activation = licenseService.deactivateDevice(userId, licenseKey, deviceIdentifier);
        return ResponseEntity.ok(ApiResponse.success("Device deactivated successfully", activation));
    }

    @GetMapping("/licenses/{licenseKey}/devices")
    public ResponseEntity<ApiResponse<List<DeviceActivation>>> getLicenseDevices(@PathVariable String licenseKey) {
        List<DeviceActivation> devices = licenseService.getLicenseDevices(licenseKey);
        return ResponseEntity.ok(ApiResponse.success("License device activations retrieved", devices));
    }

    // Admin / Developer Endpoints
    @GetMapping("/admin/licenses")
    public ResponseEntity<ApiResponse<List<License>>> getAllLicensesAdmin() {
        List<License> licenses = licenseService.getAllLicensesAdmin();
        return ResponseEntity.ok(ApiResponse.success("All licenses retrieved", licenses));
    }

    @GetMapping("/admin/licenses/{id}")
    public ResponseEntity<ApiResponse<License>> getLicenseByIdAdmin(@PathVariable Long id) {
        License license = licenseService.getLicenseByIdAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("License details retrieved", license));
    }

    @PatchMapping("/admin/licenses/{id}/status")
    public ResponseEntity<ApiResponse<License>> updateLicenseStatusAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        if (statusStr == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'status' is required"));
        }
        LicenseStatus status = LicenseStatus.valueOf(statusStr.toUpperCase());
        License updated = licenseService.updateLicenseStatusAdmin(id, status);
        return ResponseEntity.ok(ApiResponse.success("License status updated successfully", updated));
    }

    @PostMapping("/admin/licenses/{id}/revoke")
    public ResponseEntity<ApiResponse<License>> revokeLicenseAdmin(@PathVariable Long id) {
        License revoked = licenseService.revokeLicenseAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("License revoked successfully", revoked));
    }
}
