package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByOfficialEmail(String officialEmail);
    Optional<User> findByPhone(String phone);
    Optional<User> findByEmailOrPhone(String email, String phone);
    boolean existsByEmail(String email);
    boolean existsByOfficialEmail(String officialEmail);
    boolean existsByPhone(String phone);

    Page<User> findByNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            String name, String email, String phone, Pageable pageable);

    Page<User> findByRole(Role role, Pageable pageable);

    Page<User> findByRoleAndNameContainingIgnoreCaseOrEmailContainingIgnoreCaseOrPhoneContainingIgnoreCase(
            Role role, String name, String email, String phone, Pageable pageable);
}
