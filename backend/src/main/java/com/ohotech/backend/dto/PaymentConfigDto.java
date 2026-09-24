package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentConfigDto {
    private String upiId;
    private String merchantName;
    private String bankName;
    private boolean bankTransferEnabled;
    private boolean codEnabled;
    private boolean razorpayEnabled;
    private String razorpayKeyId;
}
