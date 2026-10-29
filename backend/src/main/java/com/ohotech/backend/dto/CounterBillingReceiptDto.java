package com.ohotech.backend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CounterBillingReceiptDto {
    private Long paymentId;
    private Long orderId;
    private String receiptNumber;
    private String customerName;
    private String customerEmail;
    private BigDecimal orderTotal;
    private String paymentMethod;
    private BigDecimal cashTendered;
    private BigDecimal changeReturned;
    private String cardTerminalRef;
    private String cardTerminalId;
    private Long cashierId;
    private String cashierName;
    private LocalDateTime transactedAt;
    private String status;
}
