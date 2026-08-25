package com.ohotech.backend.service;

import com.ohotech.backend.dto.*;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.LeadActivityRepository;
import com.ohotech.backend.repository.LeadFollowUpRepository;
import com.ohotech.backend.repository.LeadRepository;
import com.ohotech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CrmPipelineService {

    private final LeadRepository leadRepository;
    private final LeadActivityRepository activityRepository;
    private final LeadFollowUpRepository followUpRepository;
    private final UserRepository userRepository;
    private final LeadService leadService;
    private final AuditService auditService;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<PipelineStageDto> getPipelineBoard() {
        List<Lead> allLeads = leadRepository.findAll();
        Map<LeadStatus, List<Lead>> grouped = allLeads.stream()
                .collect(Collectors.groupingBy(Lead::getStatus));

        LeadStatus[] stages = new LeadStatus[]{
                LeadStatus.NEW,
                LeadStatus.CONTACTED,
                LeadStatus.QUALIFIED,
                LeadStatus.DEMO_SCHEDULED,
                LeadStatus.DEMO_COMPLETED,
                LeadStatus.QUOTE_SENT,
                LeadStatus.NEGOTIATION,
                LeadStatus.WON,
                LeadStatus.LOST
        };

        List<PipelineStageDto> pipeline = new ArrayList<>();
        for (LeadStatus st : stages) {
            List<Lead> stageLeads = grouped.getOrDefault(st, new ArrayList<>());
            BigDecimal totalVal = stageLeads.stream()
                    .map(l -> l.getEstimatedValue() != null ? l.getEstimatedValue() : BigDecimal.ZERO)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<LeadDto> dtoList = stageLeads.stream()
                    .map(leadService::mapToDto)
                    .collect(Collectors.toList());

            pipeline.add(PipelineStageDto.builder()
                    .status(st)
                    .stageName(st.name().replace('_', ' '))
                    .count(stageLeads.size())
                    .totalValue(totalVal)
                    .leads(dtoList)
                    .build());
        }

        return pipeline;
    }

    @Transactional(readOnly = true)
    public List<LeadActivityDto> getLeadActivities(Long leadId) {
        return activityRepository.findByLeadIdOrderByCreatedAtDesc(leadId).stream()
                .map(this::mapActivityToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeadActivityDto createLeadActivity(Long leadId, CreateActivityRequest request, Long actorUserId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        User actor = actorUserId != null ? userRepository.findById(actorUserId).orElse(null) : null;

        LeadActivity activity = LeadActivity.builder()
                .lead(lead)
                .type(request.getType())
                .description(request.getDescription())
                .performedBy(actor)
                .scheduledAt(request.getScheduledAt())
                .build();

        LeadActivity saved = activityRepository.save(activity);

        auditService.logEvent("ACTIVITY_CREATED", "CRM_LEAD", leadId.toString(),
                "Logged activity " + request.getType() + " for Lead #" + leadId);

        return mapActivityToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<LeadFollowUpDto> getLeadFollowUps(Long leadId) {
        return followUpRepository.findByLeadIdOrderByScheduledAtAsc(leadId).stream()
                .map(this::mapFollowUpToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LeadFollowUpDto createLeadFollowUp(Long leadId, CreateFollowUpRequest request, Long actorUserId) {
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", "id", leadId));

        User assigned = null;
        if (request.getAssignedUserId() != null) {
            assigned = userRepository.findById(request.getAssignedUserId()).orElse(null);
        } else if (lead.getAssignedTo() != null) {
            assigned = lead.getAssignedTo();
        }

        LeadFollowUp followUp = LeadFollowUp.builder()
                .lead(lead)
                .assignedUser(assigned)
                .scheduledAt(request.getScheduledAt())
                .title(request.getTitle())
                .notes(request.getNotes())
                .status(FollowUpStatus.PENDING)
                .build();

        LeadFollowUp saved = followUpRepository.save(followUp);

        lead.setNextFollowUpAt(request.getScheduledAt());
        leadRepository.save(lead);

        auditService.logEvent("FOLLOW_UP_CREATED", "CRM_LEAD", leadId.toString(),
                "Scheduled follow-up: '" + request.getTitle() + "' for Lead #" + leadId);

        if (assigned != null) {
            try {
                notificationService.createNotification(
                        assigned.getId(),
                        "Follow-Up Scheduled",
                        "Follow-up '" + request.getTitle() + "' scheduled for lead " + lead.getEmail(),
                        NotificationType.INFO,
                        NotificationCategory.SYSTEM,
                        "/admin/crm"
                );
            } catch (Exception e) {
                // Ignore notification failure
            }
        }

        return mapFollowUpToDto(saved);
    }

    @Transactional
    public LeadFollowUpDto updateFollowUp(Long followUpId, UpdateFollowUpRequest request, Long actorUserId) {
        LeadFollowUp followUp = followUpRepository.findById(followUpId)
                .orElseThrow(() -> new ResourceNotFoundException("LeadFollowUp", "id", followUpId));

        if (request.getStatus() != null) {
            followUp.setStatus(request.getStatus());
            if (request.getStatus() == FollowUpStatus.COMPLETED) {
                followUp.setCompletedAt(LocalDateTime.now());
                auditService.logEvent("FOLLOW_UP_COMPLETED", "CRM_LEAD", followUp.getLead().getId().toString(),
                        "Completed follow-up #" + followUpId + " for Lead #" + followUp.getLead().getId());
            } else if (request.getStatus() == FollowUpStatus.CANCELLED) {
                auditService.logEvent("FOLLOW_UP_CANCELLED", "CRM_LEAD", followUp.getLead().getId().toString(),
                        "Cancelled follow-up #" + followUpId + " for Lead #" + followUp.getLead().getId());
            }
        }

        if (request.getNotes() != null) followUp.setNotes(request.getNotes());
        if (request.getScheduledAt() != null) followUp.setScheduledAt(request.getScheduledAt());
        if (request.getAssignedUserId() != null) {
            User assigned = userRepository.findById(request.getAssignedUserId()).orElse(null);
            followUp.setAssignedUser(assigned);
        }

        LeadFollowUp updated = followUpRepository.save(followUp);
        return mapFollowUpToDto(updated);
    }

    @Transactional
    public FollowUpDashboardDto getFollowUpDashboard() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(LocalTime.MAX);

        // Auto-detect and update overdue follow-ups
        List<LeadFollowUp> pendingPast = followUpRepository.findByScheduledAtBeforeAndStatusIn(
                now, List.of(FollowUpStatus.PENDING));

        for (LeadFollowUp f : pendingPast) {
            f.setStatus(FollowUpStatus.OVERDUE);
            followUpRepository.save(f);
        }

        List<LeadFollowUp> todayList = followUpRepository.findByScheduledAtBetween(todayStart, todayEnd);
        List<LeadFollowUp> overdueList = followUpRepository.findByScheduledAtBeforeAndStatusIn(now, List.of(FollowUpStatus.OVERDUE));
        List<LeadFollowUp> upcomingList = followUpRepository.findByScheduledAtAfterAndStatusIn(todayEnd, List.of(FollowUpStatus.PENDING));

        List<LeadFollowUpDto> todayDtos = todayList.stream().map(this::mapFollowUpToDto).collect(Collectors.toList());
        List<LeadFollowUpDto> overdueDtos = overdueList.stream().map(this::mapFollowUpToDto).collect(Collectors.toList());
        List<LeadFollowUpDto> upcomingDtos = upcomingList.stream().map(this::mapFollowUpToDto).collect(Collectors.toList());

        return FollowUpDashboardDto.builder()
                .todayFollowUps(todayDtos)
                .overdueFollowUps(overdueDtos)
                .upcomingFollowUps(upcomingDtos)
                .todayCount(todayDtos.size())
                .overdueCount(overdueDtos.size())
                .upcomingCount(upcomingDtos.size())
                .build();
    }

    public LeadActivityDto mapActivityToDto(LeadActivity activity) {
        return LeadActivityDto.builder()
                .id(activity.getId())
                .leadId(activity.getLead() != null ? activity.getLead().getId() : null)
                .type(activity.getType())
                .description(activity.getDescription())
                .performedById(activity.getPerformedBy() != null ? activity.getPerformedBy().getId() : null)
                .performedByName(activity.getPerformedBy() != null ? activity.getPerformedBy().getName() : "System")
                .performedByEmail(activity.getPerformedBy() != null ? activity.getPerformedBy().getEmail() : null)
                .scheduledAt(activity.getScheduledAt())
                .createdAt(activity.getCreatedAt())
                .build();
    }

    public LeadFollowUpDto mapFollowUpToDto(LeadFollowUp followUp) {
        Lead lead = followUp.getLead();
        String leadName = lead != null ? (lead.getFirstName() != null ? lead.getFirstName() + " " + (lead.getLastName() != null ? lead.getLastName() : "") : lead.getEmail()) : "Unknown Lead";
        return LeadFollowUpDto.builder()
                .id(followUp.getId())
                .leadId(lead != null ? lead.getId() : null)
                .leadName(leadName.trim())
                .leadEmail(lead != null ? lead.getEmail() : null)
                .companyName(lead != null ? lead.getCompanyName() : null)
                .assignedUserId(followUp.getAssignedUser() != null ? followUp.getAssignedUser().getId() : null)
                .assignedUserName(followUp.getAssignedUser() != null ? followUp.getAssignedUser().getName() : "Unassigned")
                .assignedUserEmail(followUp.getAssignedUser() != null ? followUp.getAssignedUser().getEmail() : null)
                .scheduledAt(followUp.getScheduledAt())
                .title(followUp.getTitle())
                .notes(followUp.getNotes())
                .status(followUp.getStatus())
                .createdAt(followUp.getCreatedAt())
                .completedAt(followUp.getCompletedAt())
                .build();
    }
}
