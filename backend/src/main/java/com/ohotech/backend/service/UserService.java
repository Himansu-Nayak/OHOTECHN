package com.ohotech.backend.service;

import com.ohotech.backend.dto.ChangePasswordRequest;
import com.ohotech.backend.dto.UpdateProfileRequest;
import com.ohotech.backend.dto.UserDto;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return mapToDto(user);
    }

    @Transactional
    public UserDto updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName().trim());
        }
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            if (!request.getPhone().trim().equals(user.getPhone()) && userRepository.existsByPhone(request.getPhone().trim())) {
                throw new BadRequestException("Phone number is already in use by another account!");
            }
            user.setPhone(request.getPhone().trim());
        }

        User updatedUser = userRepository.save(user);
        log.info("User #{} updated their profile details.", updatedUser.getId());
        return mapToDto(updatedUser);
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect!");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("User #{} successfully changed their password.", user.getId());
    }

    public Page<UserDto> getUsersAdmin(int page, int size, String search, String roleStr) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Role filterRole = null;
        if (roleStr != null && !roleStr.trim().isEmpty()) {
            try {
                filterRole = Role.valueOf(roleStr.trim().toUpperCase());
            } catch (IllegalArgumentException e) {
                log.warn("Invalid role search parameter: {}", roleStr);
            }
        }

        Page<User> usersPage;
        boolean hasSearch = search != null && !search.trim().isEmpty();
        String q = hasSearch ? search.trim() : "";

        if (filterRole != null && hasSearch) {
            usersPage = userRepository.findByRoleAndNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                    filterRole, q, q, q, pageable);
        } else if (filterRole != null) {
            usersPage = userRepository.findByRole(filterRole, pageable);
        } else if (hasSearch) {
            usersPage = userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
                    q, q, q, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }

        return usersPage.map(this::mapToDto);
    }

    public UserDto getUserByIdAdmin(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return mapToDto(user);
    }

    @Transactional
    public UserDto updateUserStatusAdmin(Long id, boolean enabled) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        user.setEnabled(enabled);
        User saved = userRepository.save(user);
        log.info("Admin updated status for user #{} to enabled={}", id, enabled);
        return mapToDto(saved);
    }

    @Transactional
    public UserDto updateUserRoleAdmin(Long id, Role role) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        user.setRole(role);
        User saved = userRepository.save(user);
        log.info("Admin updated role for user #{} to {}", id, role);
        return mapToDto(saved);
    }

    public UserDto mapToDto(User user) {
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
