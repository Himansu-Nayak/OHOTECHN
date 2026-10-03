package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.dto.ProviderDto;
import com.ohotech.backend.service.ProductService;
import com.ohotech.backend.service.ProviderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/providers")
@RequiredArgsConstructor
@Slf4j
public class AdminProviderController {

    private final ProviderService providerService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProviderDto>>> getProviders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        Page<ProviderDto> providers = providerService.getProviders(page, size, search);
        return ResponseEntity.ok(ApiResponse.success("Providers retrieved successfully", providers));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ProviderDto>>> getAllActiveProviders() {
        List<ProviderDto> providers = providerService.getActiveProviders();
        return ResponseEntity.ok(ApiResponse.success("Active providers retrieved successfully", providers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderDto>> getProviderById(@PathVariable Long id) {
        ProviderDto provider = providerService.getProviderById(id);
        return ResponseEntity.ok(ApiResponse.success("Provider retrieved successfully", provider));
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getProviderProducts(@PathVariable Long id) {
        List<ProductDto> products = productService.getProductsByProviderId(id);
        return ResponseEntity.ok(ApiResponse.success("Provider products retrieved successfully", products));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ProviderDto>> createProvider(@Valid @RequestBody ProviderDto dto) {
        ProviderDto created = providerService.createProvider(dto);
        log.info("Admin registered new software provider agency: {}", created.getName());
        return ResponseEntity.ok(ApiResponse.success("Provider agency registered successfully", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProviderDto>> updateProvider(
            @PathVariable Long id,
            @Valid @RequestBody ProviderDto dto) {
        ProviderDto updated = providerService.updateProvider(id, dto);
        log.info("Admin updated software provider agency #{}: {}", id, updated.getName());
        return ResponseEntity.ok(ApiResponse.success("Provider agency updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ProviderDto>> toggleProviderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        Boolean active = payload.get("active");
        if (active == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'active' is required"));
        }
        ProviderDto updated = providerService.toggleProviderStatus(id, active);
        log.info("Admin toggled provider #{} active status to {}", id, active);
        return ResponseEntity.ok(ApiResponse.success("Provider status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        log.info("Admin disabled provider #{}", id);
        return ResponseEntity.ok(ApiResponse.success("Provider deactivated successfully", null));
    }
}
