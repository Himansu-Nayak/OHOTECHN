package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.ChangePasswordRequest;
import com.ohotech.backend.dto.UpdateProfileRequest;
import com.ohotech.backend.dto.UserDto;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    // 1. GET /api/users/profile — Fetch Logged-in User Profile
    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> getOwnProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<UserDto>error("Unauthorized user access"));
        }

        UserDto userDto = userService.getProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("User profile fetched successfully", userDto));
    }

    // 2. PUT /api/users/profile — Update Logged-in User Profile Details
    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDto>> updateOwnProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody UpdateProfileRequest request) {
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<UserDto>error("Unauthorized user access"));
        }

        UserDto updatedUser = userService.updateProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updatedUser));
    }

    // 3. PUT /api/users/change-password — Change Password with Verification
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody ChangePasswordRequest request) {

        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<String>error("Unauthorized user access"));
        }

        userService.changePassword(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
