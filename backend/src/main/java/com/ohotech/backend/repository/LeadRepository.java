package com.ohotech.backend.repository;

import com.ohotech.backend.entity.Lead;
import com.ohotech.backend.entity.LeadPriority;
import com.ohotech.backend.entity.LeadSource;
import com.ohotech.backend.entity.LeadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long>, JpaSpecificationExecutor<Lead> {

    Optional<Lead> findByEmail(String email);

    Optional<Lead> findByExternalLeadId(String externalLeadId);

    Optional<Lead> findByPhone(String phone);

    Optional<Lead> findByContactEnquiryId(Long contactEnquiryId);

    long countByStatus(LeadStatus status);

    long countBySource(LeadSource source);
}
