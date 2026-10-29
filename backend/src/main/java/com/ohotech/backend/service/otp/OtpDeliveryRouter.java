package com.ohotech.backend.service.otp;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpDeliveryRouter {

    private final WhatsAppBusinessOtpService whatsAppBusinessOtpService;
    private final DevTestOtpDeliveryService devTestOtpDeliveryService;

    public boolean dispatchPhoneOtp(String phoneNumber, String otpCode, String purpose) {
        if (whatsAppBusinessOtpService.isEnabled()) {
            boolean sent = whatsAppBusinessOtpService.deliverOtp(phoneNumber, otpCode, purpose);
            if (sent) return true;
        }

        // Fallback to test/dev sink
        return devTestOtpDeliveryService.deliverOtp(phoneNumber, otpCode, purpose);
    }
}
