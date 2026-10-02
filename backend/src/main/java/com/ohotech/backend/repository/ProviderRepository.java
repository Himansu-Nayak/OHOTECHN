package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Provider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByNameIgnoreCase(String name);
    Page<Provider> findByActiveTrue(Pageable pageable);
    Page<Provider> findByNameContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(String name, String companyName, Pageable pageable);
}
