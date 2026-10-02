package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Deployment;
import com.ohotech.backend.entity.DeploymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeploymentRepository extends JpaRepository<Deployment, Long> {
    List<Deployment> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Deployment> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    List<Deployment> findByStatusOrderByCreatedAtDesc(DeploymentStatus status);
    Page<Deployment> findByStatusOrderByCreatedAtDesc(DeploymentStatus status, Pageable pageable);
    List<Deployment> findByProductId(Long productId);
    List<Deployment> findByOrderId(Long orderId);
}
