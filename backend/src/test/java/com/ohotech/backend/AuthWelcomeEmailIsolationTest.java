package com.ohotech.backend;

import com.ohotech.backend.dto.AuthResponse;
import com.ohotech.backend.dto.RegisterRequest;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.OtpRepository;
import com.ohotech.backend.repository.RefreshTokenRepository;
import com.ohotech.backend.repository.UserRepository;
import com.ohotech.backend.security.JwtTokenProvider;
import com.ohotech.backend.service.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthWelcomeEmailIsolationTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private EmailService emailService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private EmailTemplateService emailTemplateService;

    @Mock
    private AuditService auditService;

    @Mock
    private OtpService otpService;

    @Mock
    private OtpRepository otpRepository;

    @Mock
    private FirebaseService firebaseService;

    @InjectMocks
    private AuthService authService;

    @Test
    void registerDispatchesWelcomeEmailEvenWhenNotificationFails() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("testuser@example.com");
        request.setPassword("SecureP@ss123");

        when(userRepository.existsByEmail("testuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");

        User savedUser = User.builder()
                .id(999L)
                .name("Test User")
                .email("testuser@example.com")
                .passwordHash("hashedPassword")
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build();

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Simulate notification service throwing an exception (e.g. database sequence failure)
        doThrow(new RuntimeException("Notification DB down"))
                .when(notificationService)
                .createNotification(anyLong(), anyString(), anyString(), any(), any(), anyString());

        when(emailTemplateService.buildWelcomeEmail("Test User")).thenReturn("<html>Welcome!</html>");

        Authentication mockAuth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(mockAuth);
        when(tokenProvider.generateToken(mockAuth)).thenReturn("mock-jwt-token");
        when(refreshTokenRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        // Execute registration
        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getAccessToken());

        // Verify notification service was attempted
        verify(notificationService, times(1))
                .createNotification(eq(999L), anyString(), anyString(), any(), any(), eq("/products"));

        // CRITICAL ASSERTION: Welcome email MUST STILL be dispatched despite notification failure!
        verify(emailService, times(1))
                .sendHtmlEmail(eq("testuser@example.com"), eq("Welcome to OHO TECH"), eq("<html>Welcome!</html>"));
    }
}
