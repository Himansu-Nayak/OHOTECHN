package com.ohotech.backend.repository;

import com.ohotech.backend.entity.CrmWhatsAppConsent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CrmWhatsAppConsentRepository extends JpaRepository<CrmWhatsAppConsent, Long> {

    Optional<CrmWhatsAppConsent> findByPhone(String phone);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM CrmWhatsAppConsent c WHERE c.phone = :phone AND c.optIn = false")
    boolean existsByPhoneAndOptInFalse(@Param("phone") String phone);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM CrmWhatsAppConsent c WHERE c.phone = :phone AND c.optIn = true")
    boolean existsByPhoneAndOptInTrue(@Param("phone") String phone);

    @Query("SELECT c FROM CrmWhatsAppConsent c WHERE c.optIn = :optIn")
    Page<CrmWhatsAppConsent> findByOptIn(@Param("optIn") boolean optIn, Pageable pageable);

    @Query("SELECT COUNT(c) FROM CrmWhatsAppConsent c WHERE c.optIn = false")
    long countByOptInFalse();

    @Query("SELECT COUNT(c) FROM CrmWhatsAppConsent c WHERE c.optIn = true")
    long countByOptInTrue();
}
