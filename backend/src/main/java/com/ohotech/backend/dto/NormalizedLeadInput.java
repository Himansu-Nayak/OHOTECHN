package com.ohotech.backend.dto;

import com.ohotech.backend.entity.LeadPriority;
import com.ohotech.backend.entity.LeadSource;
import com.ohotech.backend.entity.LeadStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NormalizedLeadInput {

    private LeadSource source;
    private String sourceName;
    private String externalLeadId;
    private String externalEventId;

    private String firstName;
    private String lastName;
    private String name;
    private String email;
    private String phone;
    private String company;
    private String designation;
    private String industry;
    private String city;
    private String state;
    private String country;

    private String productInterest;
    private String message;

    private String campaign;
    private String campaignId;
    private String adSet;
    private String adSetId;
    private String ad;
    private String adId;
    private String medium;
    private String landingPage;

    private String utmSource;
    private String utmMedium;
    private String utmCampaign;
    private String utmTerm;
    private String utmContent;

    private LeadPriority priority;
    private LeadStatus status;

    private LocalDateTime capturedAt;
    private String rawProviderReference;
}
