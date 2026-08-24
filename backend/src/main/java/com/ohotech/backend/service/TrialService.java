package com.ohotech.backend.service;

import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TrialService {

    private final ProductRepository productRepository;
    private final ProductPlanRepository productPlanRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final LicenseRepository licenseRepository;
    private final UserRepository userRepository;
    private final LicenseService licenseService;

    @Transactional
    public Map<String, Object> startFreeTrial(Long userId, Long productId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (!product.isActive()) {
            throw new BadRequestException("Product is inactive and not available for trial.");
        }

        // 1. Prevent duplicate free trials for same user and product
        List<Subscription> existingSubs = subscriptionRepository.findByUserIdAndProductId(userId, productId);
        boolean hasHadTrial = existingSubs.stream()
                .anyMatch(s -> s.getStatus() == SubscriptionStatus.TRIAL ||
                               (s.getProductPlan() != null && s.getProductPlan().getBillingType() == BillingType.FREE_TRIAL));

        if (hasHadTrial) {
            throw new BadRequestException("You have already claimed a free trial for this product.");
        }

        // 2. Locate trial plan or default to 14 days
        Optional<ProductPlan> trialPlanOpt = productPlanRepository.findFirstByProductIdAndBillingTypeAndActiveTrue(
                productId, BillingType.FREE_TRIAL);

        ProductPlan plan = trialPlanOpt.orElse(null);
        int trialDays = (plan != null && plan.getTrialDays() > 0) ? plan.getTrialDays() : 14;

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiryDate = now.plusDays(trialDays);

        // 3. Create Subscription
        Subscription subscription = Subscription.builder()
                .user(user)
                .product(product)
                .productPlan(plan)
                .status(SubscriptionStatus.TRIAL)
                .startDate(now)
                .expiryDate(expiryDate)
                .autoRenew(false)
                .build();

        Subscription savedSubscription = subscriptionRepository.save(subscription);

        // 4. Create License
        String licenseKey = licenseService.generateUniqueLicenseKey();
        License license = License.builder()
                .user(user)
                .product(product)
                .productPlan(plan)
                .subscription(savedSubscription)
                .licenseKey(licenseKey)
                .status(LicenseStatus.ACTIVE)
                .activationLimit(plan != null ? plan.getActivationLimit() : 1)
                .activationCount(0)
                .issuedAt(now)
                .expiresAt(expiryDate)
                .build();

        License savedLicense = licenseRepository.save(license);

        Map<String, Object> response = new HashMap<>();
        response.put("product", product);
        response.put("subscriptionStatus", savedSubscription.getStatus());
        response.put("startDate", savedSubscription.getStartDate());
        response.put("expiryDate", savedSubscription.getExpiryDate());
        response.put("license", savedLicense);

        return response;
    }
}
