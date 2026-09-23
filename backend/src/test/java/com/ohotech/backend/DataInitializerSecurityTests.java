package com.ohotech.backend;

import com.ohotech.backend.config.DataInitializer;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DataInitializerSecurityTests {

    @Autowired
    private DataInitializer dataInitializer;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        // Reset reflection fields to default safe values before each test
        ReflectionTestUtils.setField(dataInitializer, "initialAdminEmail", null);
        ReflectionTestUtils.setField(dataInitializer, "initialAdminPassword", null);
    }

    @Test
    @DisplayName("Test A: Existing admin password hash must remain completely unchanged across initialization")
    void testExistingAdminPasswordPreservation() throws Exception {
        String testEmail = "existing_admin@ohotech.com";
        String originalPassword = "OriginalCustomPassword#2026";
        String originalHash = passwordEncoder.encode(originalPassword);

        User admin = User.builder()
                .name("Corporate Administrator")
                .email(testEmail)
                .passwordHash(originalHash)
                .role(Role.ROLE_ADMIN)
                .emailVerified(true)
                .enabled(true)
                .failedLoginAttempts(0)
                .build();
        userRepository.save(admin);

        // Execute initializer
        dataInitializer.run();

        // Reload user from database
        User reloaded = userRepository.findByEmail(testEmail).orElseThrow();
        assertEquals(originalHash, reloaded.getPasswordHash(),
                "CRITICAL: Existing administrator password hash must NEVER be overwritten during initialization!");
    }

    @Test
    @DisplayName("Test B: Existing admin remains fully authenticable with original credentials after initialization")
    void testExistingAdminRemainsUsable() throws Exception {
        String testEmail = "executive_admin@ohotech.com";
        String customPassword = "SecureExecutivePassword$789";

        User admin = User.builder()
                .name("Executive Admin")
                .email(testEmail)
                .passwordHash(passwordEncoder.encode(customPassword))
                .role(Role.ROLE_ADMIN)
                .emailVerified(true)
                .enabled(true)
                .build();
        userRepository.save(admin);

        // Execute initializer
        dataInitializer.run();

        User reloaded = userRepository.findByEmail(testEmail).orElseThrow();
        assertTrue(passwordEncoder.matches(customPassword, reloaded.getPasswordHash()),
                "Original administrator password must continue to authenticate successfully!");
    }

    @Test
    @DisplayName("Test C: Old hardcoded password Admin@12345 must NOT work or be silently installed")
    void testOldHardcodedPasswordDoesNotWork() throws Exception {
        String testEmail = "admin@ohotech.com";
        String customPassword = "UniqueProductionKey*456";

        User admin = User.builder()
                .name("Main Admin")
                .email(testEmail)
                .passwordHash(passwordEncoder.encode(customPassword))
                .role(Role.ROLE_ADMIN)
                .emailVerified(true)
                .enabled(true)
                .build();
        userRepository.save(admin);

        // Execute initializer
        dataInitializer.run();

        User reloaded = userRepository.findByEmail(testEmail).orElseThrow();
        assertFalse(passwordEncoder.matches("Admin@12345", reloaded.getPasswordHash()),
                "VULNERABILITY CHECK: Legacy hardcoded password 'Admin@12345' must NEVER match the administrator account!");
    }

    @Test
    @DisplayName("Test D: Environment-driven administrator bootstrap on empty database with BCrypt encoding")
    void testNewAdministratorBootstrapFromEnvironment() throws Exception {
        String bootstrapEmail = "bootstrapped_admin@ohotech.com";
        String bootstrapPassword = "EnvProvidedPassword#2026!";

        // Ensure user does not exist
        userRepository.findByEmail(bootstrapEmail).ifPresent(userRepository::delete);

        // Configure environment bootstrap values via reflection
        ReflectionTestUtils.setField(dataInitializer, "initialAdminEmail", bootstrapEmail);
        ReflectionTestUtils.setField(dataInitializer, "initialAdminPassword", bootstrapPassword);

        // Execute initialization
        dataInitializer.run();

        Optional<User> createdOpt = userRepository.findByEmail(bootstrapEmail);
        assertTrue(createdOpt.isPresent(), "Initial administrator should be created when bootstrap credentials are provided");

        User created = createdOpt.get();
        assertEquals(Role.ROLE_ADMIN, created.getRole());
        assertTrue(created.isEmailVerified());
        assertTrue(created.isEnabled());

        // Verify password is BCrypt encoded and matches
        assertTrue(passwordEncoder.matches(bootstrapPassword, created.getPasswordHash()));
        assertNotEquals(bootstrapPassword, created.getPasswordHash(), "Plaintext password must NEVER be persisted!");
        assertTrue(created.getPasswordHash().startsWith("$2a$") || created.getPasswordHash().startsWith("$2b$"),
                "Password hash must be a valid BCrypt string");
    }

    @Test
    @DisplayName("Test E: Restart behavior - Second initialization run preserves newly bootstrapped credentials")
    void testRestartBehaviorDoesNotOverwrite() throws Exception {
        String bootstrapEmail = "restart_admin@ohotech.com";
        String bootstrapPassword = "FirstRunSecretPassword#1";

        userRepository.findByEmail(bootstrapEmail).ifPresent(userRepository::delete);

        ReflectionTestUtils.setField(dataInitializer, "initialAdminEmail", bootstrapEmail);
        ReflectionTestUtils.setField(dataInitializer, "initialAdminPassword", bootstrapPassword);

        // Run 1: First initialization
        dataInitializer.run();
        User firstRunUser = userRepository.findByEmail(bootstrapEmail).orElseThrow();
        String firstRunHash = firstRunUser.getPasswordHash();

        // Simulate subsequent application restart with DIFFERENT environment config or duplicate run
        ReflectionTestUtils.setField(dataInitializer, "initialAdminPassword", "DifferentPasswordAttempt#2");

        // Run 2: Second initialization
        dataInitializer.run();
        User secondRunUser = userRepository.findByEmail(bootstrapEmail).orElseThrow();

        assertEquals(firstRunHash, secondRunUser.getPasswordHash(),
                "Subsequent initialization runs must NEVER overwrite or alter the existing administrator credentials!");
        assertTrue(passwordEncoder.matches(bootstrapPassword, secondRunUser.getPasswordHash()));
        assertFalse(passwordEncoder.matches("DifferentPasswordAttempt#2", secondRunUser.getPasswordHash()));
    }
}
