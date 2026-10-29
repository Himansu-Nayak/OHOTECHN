package com.ohotech.backend.service.otp;

public interface OtpDeliveryService {

    String getProviderName();

    boolean isEnabled();

    boolean deliverOtp(String phoneNumber, String otpCode, String purpose);
}
