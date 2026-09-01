package com.ohotech.backend.service;

import com.ohotech.backend.dto.CrmMarketingAnalyticsDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.LeadRepository;
import com.ohotech.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class CrmMarketingAnalyticsService {

    private final LeadRepository leadRepository;
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public CrmMarketingAnalyticsDto getMarketingAnalytics() {
        List<Lead> leads = leadRepository.findAll();
        long totalLeads = leads.size();

        Map<String, Long> leadsBySource = new LinkedHashMap<>();
        Map<String, Long> leadsByStatus = new LinkedHashMap<>();
        Map<String, Long> leadsByCampaign = new LinkedHashMap<>();
        Map<String, Long> convertedLeadsBySource = new HashMap<>();
        Map<String, BigDecimal> revenueBySource = new LinkedHashMap<>();

        // Initialize enum sources
        for (LeadSource src : LeadSource.values()) {
            leadsBySource.put(src.name(), 0L);
            convertedLeadsBySource.put(src.name(), 0L);
            revenueBySource.put(src.name(), BigDecimal.ZERO);
        }

        // Initialize status
        for (LeadStatus st : LeadStatus.values()) {
            leadsByStatus.put(st.name(), 0L);
        }

        Set<Long> processedUserIds = new HashSet<>();

        for (Lead lead : leads) {
            String srcName = lead.getSource() != null ? lead.getSource().name() : "OTHER";
            leadsBySource.put(srcName, leadsBySource.getOrDefault(srcName, 0L) + 1);

            String statusName = lead.getStatus() != null ? lead.getStatus().name() : "NEW";
            leadsByStatus.put(statusName, leadsByStatus.getOrDefault(statusName, 0L) + 1);

            if (lead.getCampaign() != null && !lead.getCampaign().isBlank()) {
                String cmp = lead.getCampaign().trim();
                leadsByCampaign.put(cmp, leadsByCampaign.getOrDefault(cmp, 0L) + 1);
            }

            boolean isWonOrConverted = lead.getStatus() == LeadStatus.WON || lead.getConvertedUser() != null;
            if (isWonOrConverted) {
                convertedLeadsBySource.put(srcName, convertedLeadsBySource.getOrDefault(srcName, 0L) + 1);
            }

            // Calculate revenue for converted customer orders (deduplicated by customerId)
            if (lead.getConvertedUser() != null) {
                Long customerId = lead.getConvertedUser().getId();
                if (!processedUserIds.contains(customerId)) {
                    processedUserIds.add(customerId);
                    List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(customerId);
                    BigDecimal totalSpent = orders.stream()
                            .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                            .map(Order::getTotalAmount)
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    revenueBySource.put(srcName, revenueBySource.getOrDefault(srcName, BigDecimal.ZERO).add(totalSpent));
                }
            }
        }

        Map<String, Double> conversionRateBySource = new LinkedHashMap<>();
        for (Map.Entry<String, Long> entry : leadsBySource.entrySet()) {
            String src = entry.getKey();
            long count = entry.getValue();
            long converted = convertedLeadsBySource.getOrDefault(src, 0L);
            double rate = count > 0 ? (double) converted / count * 100.0 : 0.0;
            conversionRateBySource.put(src, Math.round(rate * 10.0) / 10.0);
        }

        return CrmMarketingAnalyticsDto.builder()
                .totalLeads(totalLeads)
                .leadsBySource(leadsBySource)
                .leadsByStatus(leadsByStatus)
                .leadsByCampaign(leadsByCampaign)
                .conversionRateBySource(conversionRateBySource)
                .revenueBySource(revenueBySource)
                .build();
    }
}
