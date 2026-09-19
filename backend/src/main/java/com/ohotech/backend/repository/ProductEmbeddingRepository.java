package com.ohotech.backend.repository;

import com.ohotech.backend.entity.ProductEmbedding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductEmbeddingRepository extends JpaRepository<ProductEmbedding, Long> {
    Optional<ProductEmbedding> findByProductId(Long productId);
}
