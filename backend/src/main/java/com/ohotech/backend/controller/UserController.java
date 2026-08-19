package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.UserDto;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 1. Update Own Profile (Available to all logged-in users)
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateOwnProfile(
            @RequestHeader(value = "X-User-Id", required = false) Long userIdHeader,
            @RequestBody Map<String, String> payload) {
        
        String email = payload.get("email");
        String currentEmail = payload.get("currentEmail");

        User userToUpdate = null;
        if (userIdHeader != null) {
            userToUpdate = userRepository.findById(userIdHeader).orElse(null);
        }
        if (userToUpdate == null && currentEmail != null) {
            userToUpdate = userRepository.findByEmail(currentEmail).orElse(null);
        }
        if (userToUpdate == null && email != null) {
            userToUpdate = userRepository.findByEmail(email).orElse(null);
        }

        if (userToUpdate == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<UserDto>error("User account not found"));
        }

        if (payload.containsKey("name")) {
            userToUpdate.setName(payload.get("name"));
        }
        if (payload.containsKey("phone")) {
            userToUpdate.setPhone(payload.get("phone"));
        }
        if (payload.containsKey("password") && !payload.get("password").trim().isEmpty()) {
            userToUpdate.setPasswordHash(passwordEncoder.encode(payload.get("password")));
        }

        User saved = userRepository.save(userToUpdate);
        log.info("User #{} updated their own profile details.", saved.getId());

        UserDto dto = mapToDto(saved);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", dto));
    }

    // 2. Admin / Developer Update Any User Profile
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> updateTargetUserProfile(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false, defaultValue = "ROLE_CUSTOMER") String requesterRole,
            @RequestBody Map<String, Object> payload) {

        User targetUser = userRepository.findById(id).orElse(null);
        if (targetUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.<UserDto>error("Target user not found"));
        }

        boolean isDev = requesterRole.equalsIgnoreCase("ROLE_DEVELOPER") || requesterRole.equalsIgnoreCase("DEVELOPER");
        boolean isAdmin = requesterRole.equalsIgnoreCase("ROLE_ADMIN") || requesterRole.equalsIgnoreCase("ADMIN");

        if (!isDev && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.<UserDto>error("Access Denied: Customers cannot edit other users' profiles."));
        }

        // Admin cannot edit Developer accounts
        if (isAdmin && !isDev && targetUser.getRole() == Role.ROLE_DEVELOPER) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.<UserDto>error("Access Denied: Admin cannot edit Developer profiles."));
        }

        if (payload.containsKey("name")) {
            targetUser.setName((String) payload.get("name"));
        }
        if (payload.containsKey("phone")) {
            targetUser.setPhone((String) payload.get("phone"));
        }
        if (payload.containsKey("email")) {
            targetUser.setEmail((String) payload.get("email"));
        }
        if (payload.containsKey("password") && payload.get("password") != null && !payload.get("password").toString().trim().isEmpty()) {
            targetUser.setPasswordHash(passwordEncoder.encode(payload.get("password").toString()));
        }
        if (isDev && payload.containsKey("role")) {
            try {
                targetUser.setRole(Role.valueOf(payload.get("role").toString().toUpperCase()));
            } catch (IllegalArgumentException ignored) {}
        }

        User saved = userRepository.save(targetUser);
        log.info("Requester ({}) updated profile for user #{}.", requesterRole, saved.getId());

        UserDto dto = mapToDto(saved);
        return ResponseEntity.ok(ApiResponse.success("User profile updated successfully", dto));
    }

    private UserDto mapToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole() : Role.ROLE_CUSTOMER)
                .enabled(user.isEnabled())
                .emailVerified(user.isEmailVerified())
                .phoneVerified(user.isPhoneVerified())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
