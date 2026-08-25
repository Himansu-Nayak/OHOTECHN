package com.ohotech.backend.dto;

import com.ohotech.backend.entity.LeadPriority;
import com.ohotech.backend.entity.LeadSource;
import com.ohotech.backend.entity.LeadStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateLeadRequest {
    private String firstName;
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String companyName;
    private String designation;
    private String industry;
    private String city;
    private String state;
    private String country;
    private String interestedProduct;
    private Long interestedProductId;
    private LeadSource source;
    private String sourceDetails;
    private String campaign;
    private String medium;
    private String landingPage;
    private String utmSource;
    private String utmMedium;
    private String utmCampaign;
    private String utmTerm;
    private String utmContent;
    private LeadStatus status;
    private LeadPriority priority;
    private Long assignedToId;
    private Long contactEnquiryId;
    private BigDecimal estimatedValue;
    private String notes;
    private LocalDateTime lastContactedAt;
    private LocalDateTime nextFollowUpAt;
}
