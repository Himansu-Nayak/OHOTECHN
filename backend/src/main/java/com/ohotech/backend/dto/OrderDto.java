package com.ohotech.backend.dto;

import com.ohotech.backend.entity.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private String shippingAddress;
    private String contactPhone;
    private int itemsCount;
    private LocalDateTime createdAt;
}
