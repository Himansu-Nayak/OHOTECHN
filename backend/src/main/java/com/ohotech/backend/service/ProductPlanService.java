package com.ohotech.backend.service;

import com.ohotech.backend.dto.ProductPlanDto;
import com.ohotech.backend.entity.Product;
import com.ohotech.backend.entity.ProductPlan;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.ProductPlanRepository;
import com.ohotech.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductPlanService {

    private final ProductPlanRepository productPlanRepository;
    private final ProductRepository productRepository;

    @Transactional
    public List<ProductPlanDto> getActivePlansByProductId(Long productId) {
        List<ProductPlan> plans = productPlanRepository.findByProductIdAndActiveTrue(productId);
        if (plans.isEmpty()) {
            Product product = productRepository.findById(productId).orElse(null);
            if (product != null) {
                createDefaultPlansForProduct(product);
                plans = productPlanRepository.findByProductIdAndActiveTrue(productId);
            }
        }
        return plans.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional
    public void createDefaultPlansForProduct(Product product) {
        if (!productPlanRepository.findByProductId(product.getId()).isEmpty()) return;

        java.math.BigDecimal basePrice = product.getPrice() != null ? product.getPrice() : new java.math.BigDecimal("25000");

        ProductPlan trialPlan = ProductPlan.builder()
                .product(product)
                .name("14-Day Free Trial")
                .description("Full-featured trial period with single device evaluation access.")
                .price(java.math.BigDecimal.ZERO)
                .currency("INR")
                .billingType(com.ohotech.backend.entity.BillingType.FREE_TRIAL)
                .durationDays(14)
                .activationLimit(1)
                .trialDays(14)
                .active(true)
                .build();

        ProductPlan monthlyPlan = ProductPlan.builder()
                .product(product)
                .name("Monthly Subscription")
                .description("Flexible monthly billing with ongoing cloud updates & standard support.")
                .price(basePrice.divide(new java.math.BigDecimal("10"), 2, java.math.RoundingMode.HALF_UP))
                .currency("INR")
                .billingType(com.ohotech.backend.entity.BillingType.MONTHLY)
                .durationDays(30)
                .activationLimit(3)
                .trialDays(0)
                .active(true)
                .build();

        ProductPlan yearlyPlan = ProductPlan.builder()
                .product(product)
                .name("Yearly Commercial License")
                .description("Annual license with 20% discount, priority phone support & multi-device license key.")
                .price(basePrice)
                .currency("INR")
                .billingType(com.ohotech.backend.entity.BillingType.YEARLY)
                .durationDays(365)
                .activationLimit(5)
                .trialDays(0)
                .active(true)
                .build();

        ProductPlan lifetimePlan = ProductPlan.builder()
                .product(product)
                .name("Lifetime Perpetual License")
                .description("One-time payment for permanent unlimited software usage & source updates.")
                .price(basePrice.multiply(new java.math.BigDecimal("2.5")))
                .currency("INR")
                .billingType(com.ohotech.backend.entity.BillingType.LIFETIME)
                .durationDays(36500)
                .activationLimit(10)
                .trialDays(0)
                .active(true)
                .build();

        productPlanRepository.saveAll(List.of(trialPlan, monthlyPlan, yearlyPlan, lifetimePlan));
    }

    public List<ProductPlanDto> getAdminPlansByProductId(Long productId) {
        return productPlanRepository.findByProductId(productId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductPlanDto createPlan(Long productId, ProductPlanDto dto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        ProductPlan plan = ProductPlan.builder()
                .product(product)
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .currency(dto.getCurrency() != null ? dto.getCurrency() : "INR")
                .billingType(dto.getBillingType())
                .durationDays(dto.getDurationDays() != null ? dto.getDurationDays() : 30)
                .activationLimit(dto.getActivationLimit() != null ? dto.getActivationLimit() : 1)
                .trialDays(dto.getTrialDays() != null ? dto.getTrialDays() : 0)
                .active(dto.getActive() != null ? dto.getActive() : true)
                .build();

        ProductPlan saved = productPlanRepository.save(plan);
        return mapToDto(saved);
    }

    @Transactional
    public ProductPlanDto updatePlan(Long planId, ProductPlanDto dto) {
        ProductPlan plan = productPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductPlan", "id", planId));

        if (dto.getName() != null) plan.setName(dto.getName());
        if (dto.getDescription() != null) plan.setDescription(dto.getDescription());
        if (dto.getPrice() != null) plan.setPrice(dto.getPrice());
        if (dto.getCurrency() != null) plan.setCurrency(dto.getCurrency());
        if (dto.getBillingType() != null) plan.setBillingType(dto.getBillingType());
        if (dto.getDurationDays() != null) plan.setDurationDays(dto.getDurationDays());
        if (dto.getActivationLimit() != null) plan.setActivationLimit(dto.getActivationLimit());
        if (dto.getTrialDays() != null) plan.setTrialDays(dto.getTrialDays());
        if (dto.getActive() != null) plan.setActive(dto.getActive());

        ProductPlan saved = productPlanRepository.save(plan);
        return mapToDto(saved);
    }

    @Transactional
    public ProductPlanDto togglePlanStatus(Long planId, boolean active) {
        ProductPlan plan = productPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductPlan", "id", planId));

        plan.setActive(active);
        ProductPlan saved = productPlanRepository.save(plan);
        return mapToDto(saved);
    }

    @Transactional
    public void deletePlan(Long planId) {
        ProductPlan plan = productPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("ProductPlan", "id", planId));
        plan.setActive(false);
        productPlanRepository.save(plan);
    }

    public ProductPlanDto mapToDto(ProductPlan plan) {
        return ProductPlanDto.builder()
                .id(plan.getId())
                .productId(plan.getProduct() != null ? plan.getProduct().getId() : null)
                .productName(plan.getProduct() != null ? plan.getProduct().getName() : null)
                .name(plan.getName())
                .description(plan.getDescription())
                .price(plan.getPrice())
                .currency(plan.getCurrency())
                .billingType(plan.getBillingType())
                .durationDays(plan.getDurationDays())
                .activationLimit(plan.getActivationLimit())
                .trialDays(plan.getTrialDays())
                .active(plan.isActive())
                .createdAt(plan.getCreatedAt())
                .updatedAt(plan.getUpdatedAt())
                .build();
    }
}
