package com.ohotech.backend.service.otp;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class DevTestOtpDeliveryService implements OtpDeliveryService {

    // In-memory test sink for automated integration tests
    private final Map<String, String> testSink = new ConcurrentHashMap<>();

    @Override
    public String getProviderName() {
        return "DEV_TEST_SINK";
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public boolean deliverOtp(String phoneNumber, String otpCode, String purpose) {
        String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
        testSink.put(cleanPhone, otpCode);
        log.info("[OTP TEST SINK] Dispatched OTP for purpose: {} to target [masked: ***{}]",
                purpose, cleanPhone.length() >= 4 ? cleanPhone.substring(cleanPhone.length() - 4) : "xxxx");
        return true;
    }

    public String getLastDeliveredOtpForTesting(String phoneNumber) {
        String cleanPhone = phoneNumber.replaceAll("[^0-9]", "");
        return testSink.get(cleanPhone);
    }

    public void clearTestSink() {
        testSink.clear();
    }
}
