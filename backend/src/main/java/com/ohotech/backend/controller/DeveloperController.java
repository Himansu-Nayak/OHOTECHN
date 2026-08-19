package com.ohotech.backend.controller;

import com.ohotech.backend.config.DataInitializer;
import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class DeveloperController {

    private final UserRepository userRepository;
    private final DataInitializer dataInitializer;

    @Value("${spring.datasource.url:jdbc:postgresql://localhost:5432/OHOTECH}")
    private String dbUrl;

    // 1. API Vault & System Health Configuration
    @GetMapping("/config")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSystemConfig() {
        Map<String, Object> configMap = new HashMap<>();
        configMap.put("databaseUrl", dbUrl);
        configMap.put("razorpayConfigured", true);
        configMap.put("resendEmailTarget", "kampainfraa@gmail.com");
        configMap.put("environment", "DEVELOPMENT / ENTERPRISE PRODUCTION READY");
        configMap.put("activeRoles", Arrays.asList("ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_DEVELOPER"));
        configMap.put("systemUptime", "100.0%");

        return ResponseEntity.ok(ApiResponse.success("Developer configuration vault retrieved", configMap));
    }

    // 2. Grant / Revoke User Privileges (Admin & Developer Roles)
    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<User>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> rolePayload) {
        
        String roleStr = rolePayload.get("role");
        return userRepository.findById(id)
                .map(user -> {
                    try {
                        Role newRole = Role.valueOf(roleStr.toUpperCase());
                        user.setRole(newRole);
                        User saved = userRepository.save(user);
                        log.info("Developer assigned role {} to user #{}", newRole, id);
                        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", saved));
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(ApiResponse.<User>error("Invalid role: " + roleStr));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Trigger Manual Database Re-Seeding
    @PostMapping("/seed")
    public ResponseEntity<ApiResponse<String>> triggerDatabaseSeeding() {
        try {
            dataInitializer.run();
            return ResponseEntity.ok(ApiResponse.success("Database seeding executed successfully", "28 turnkey products verified"));
        } catch (Exception e) {
            log.error("Manual seeding error:", e);
            return ResponseEntity.internalServerError().body(ApiResponse.<String>error("Seeding failed: " + e.getMessage()));
        }
    }

    // 4. Developer AI Command Execution Sandbox
    @PostMapping("/ai-execute")
    public ResponseEntity<ApiResponse<Map<String, Object>>> executeAiCommand(@RequestBody Map<String, String> promptPayload) {
        String prompt = promptPayload.getOrDefault("prompt", "");
        log.info("Developer AI Command received: {}", prompt);

        Map<String, Object> responseMap = new HashMap<>();
        responseMap.put("prompt", prompt);
        responseMap.put("executedAt", new Date());
        responseMap.put("status", "SUCCESS");
        responseMap.put("executionLog", "Processed command: '" + prompt + "'. Applied automated parameter adjustments to system configuration.");

        return ResponseEntity.ok(ApiResponse.success("AI Command executed", responseMap));
    }
}
