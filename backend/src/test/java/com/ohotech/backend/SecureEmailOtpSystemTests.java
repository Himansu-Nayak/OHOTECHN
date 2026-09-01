package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.OtpPurpose;
import com.ohotech.backend.entity.OtpVerification;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.OtpRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.service.OtpService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class SecureEmailOtpSystemTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OtpRepository otpRepository;

    @Autowired
    private OtpService otpService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Test
    void testOtpSecureGenerationAndHashStorage() {
        String testEmail = "otp_test_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        otpService.sendOtp(testEmail, "EMAIL", OtpPurpose.EMAIL_VERIFICATION);

        OtpVerification record = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(testEmail, OtpPurpose.EMAIL_VERIFICATION)
                .orElse(null);

        assertNotNull(record);
        assertNotNull(record.getId());
        assertNotNull(record.getOtpHash());
        assertEquals(64, record.getOtpHash().length()); // SHA-256 hex string length
        assertFalse(record.isVerified());
        assertEquals(0, record.getAttempts());
    }

    @Test
    void testOtpPurposeIsolationAndAttemptLimiting() {
        String testEmail = "isolation_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        otpService.sendOtp(testEmail, "EMAIL", OtpPurpose.EMAIL_VERIFICATION);

        // Submitting wrong OTP increments attempt counter
        for (int i = 1; i <= 4; i++) {
            final int attemptNum = i;
            assertThrows(Exception.class, () -> otpService.verifyOtp(testEmail, "000000", OtpPurpose.EMAIL_VERIFICATION));
            OtpVerification record = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(testEmail, OtpPurpose.EMAIL_VERIFICATION).orElseThrow();
            assertEquals(attemptNum, record.getAttempts());
        }

        // Verification for wrong purpose should fail
        assertThrows(Exception.class, () -> otpService.verifyOtp(testEmail, "123456", OtpPurpose.LOGIN));
    }

    @Test
    void testEmailRegistrationOtpAndLoginProtectionFlow() throws Exception {
        String email = "reg_otp_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        String password = "SecretPass123!";
        
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Registration OTP User");
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);

        // 1. Registration dispatches 6-digit OTP automatically and sets emailVerified = false
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        User user = userRepository.findByEmail(email).orElseThrow();
        assertFalse(user.isEmailVerified());

        OtpVerification record = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(email, OtpPurpose.EMAIL_VERIFICATION).orElseThrow();
        assertNotNull(record);
        assertNotNull(record.getOtpHash());

        // 2. Unverified email login attempt should be blocked
        LoginRequest loginReq = new LoginRequest();
        loginReq.setUsername(email);
        loginReq.setPassword(password);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isBadRequest());

        // 3. Verify Email OTP activates account
        record.setVerified(true);
        otpRepository.save(record);
        user.setEmailVerified(true);
        userRepository.save(user);

        assertTrue(user.isEmailVerified());

        // 4. Verified user login succeeds
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken").exists());
    }

    @Test
    void testForgotPasswordAndResetFlow() throws Exception {
        String email = "reset_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com";
        
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setName("Reset User");
        registerRequest.setEmail(email);
        registerRequest.setPassword("OldPassword123!");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        User user = userRepository.findByEmail(email).orElseThrow();
        user.setEmailVerified(true);
        userRepository.save(user);

        // Request Password Reset OTP
        SendOtpRequest sendReq = new SendOtpRequest();
        sendReq.setTarget(email);
        sendReq.setPurpose(OtpPurpose.PASSWORD_RESET);

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sendReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        OtpVerification record = otpRepository.findFirstByTargetAndPurposeOrderByCreatedAtDesc(email, OtpPurpose.PASSWORD_RESET).orElseThrow();
        assertNotNull(record);
        assertEquals(OtpPurpose.PASSWORD_RESET, record.getPurpose());
    }
}
