package com.ohotech.backend.repository;

import com.ohotech.backend.entity.FollowUpStatus;
import com.ohotech.backend.entity.LeadFollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeadFollowUpRepository extends JpaRepository<LeadFollowUp, Long> {

    List<LeadFollowUp> findByLeadIdOrderByScheduledAtAsc(Long leadId);

    List<LeadFollowUp> findByScheduledAtBetween(LocalDateTime start, LocalDateTime end);

    List<LeadFollowUp> findByScheduledAtBeforeAndStatusIn(LocalDateTime cutoff, List<FollowUpStatus> statuses);

    List<LeadFollowUp> findByScheduledAtAfterAndStatusIn(LocalDateTime start, List<FollowUpStatus> statuses);

    List<LeadFollowUp> findAllByOrderByScheduledAtAsc();
}
