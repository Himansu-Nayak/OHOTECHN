package com.ohotech.backend.repository;

import com.ohotech.backend.entity.BillingType;
import com.ohotech.backend.entity.ProductPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductPlanRepository extends JpaRepository<ProductPlan, Long> {
    List<ProductPlan> findByProductId(Long productId);
    List<ProductPlan> findByProductIdAndActiveTrue(Long productId);
    Optional<ProductPlan> findFirstByProductIdAndBillingTypeAndActiveTrue(Long productId, BillingType billingType);
}
