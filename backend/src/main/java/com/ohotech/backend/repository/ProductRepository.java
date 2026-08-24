package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByActiveTrue(Pageable pageable);
    List<Product> findByCategoryId(Long categoryId);
    Page<Product> findByCategoryIdAndActiveTrue(Long categoryId, Pageable pageable);
    Page<Product> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);
    
    Page<Product> findByActiveTrueAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description, Pageable pageable);

    Page<Product> findByCategoryIdAndActiveTrueAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            Long categoryId, String name, String description, Pageable pageable);

    Page<Product> findByCategoryIdAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            Long categoryId, String name, String description, Pageable pageable);
}
