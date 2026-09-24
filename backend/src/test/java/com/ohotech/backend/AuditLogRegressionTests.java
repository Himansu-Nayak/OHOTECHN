package com.ohotech.backend;

import com.ohotech.backend.dto.AuditLogDto;
import com.ohotech.backend.entity.AuditLog;
import com.ohotech.backend.repository.AuditLogRepository;
import com.ohotech.backend.service.AuditService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuditLogRegressionTests {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditService auditService;

    @Autowired
    private MockMvc mockMvc;

    private AuditLog log1;
    private AuditLog log2;
    private AuditLog logWithNulls;

    @BeforeEach
    void setupTestData() {
        auditLogRepository.deleteAll();

        log1 = AuditLog.builder()
                .actorUserId(1L)
                .actorName("Admin User")
                .actorEmail("admin@ohotech.com")
                .actorRole("ROLE_ADMIN")
                .action("USER_LOGIN_SUCCESS")
                .entityType("AUTH")
                .entityId("1")
                .description("Successful administrator login from enterprise dashboard")
                .ipAddress("192.168.1.100")
                .userAgent("Mozilla/5.0 Chrome/120.0")
                .createdAt(LocalDateTime.now().minusHours(2))
                .build();

        log2 = AuditLog.builder()
                .actorUserId(2L)
                .actorName("Developer User")
                .actorEmail("developer@ohotech.com")
                .actorRole("ROLE_DEVELOPER")
                .action("CONFIG_UPDATE")
                .entityType("SYSTEM")
                .entityId("SYS_99")
                .description("Updated API gateway routing rules")
                .ipAddress("10.0.0.1")
                .userAgent("Mozilla/5.0 Firefox/122.0")
                .createdAt(LocalDateTime.now().minusHours(1))
                .build();

        logWithNulls = AuditLog.builder()
                .action("SYSTEM_HEARTBEAT")
                .actorEmail(null)
                .actorName(null)
                .description(null)
                .createdAt(LocalDateTime.now())
                .build();

        auditLogRepository.save(log1);
        auditLogRepository.save(log2);
        auditLogRepository.save(logWithNulls);
    }

    @Test
    @DisplayName("1. Audit logs can be loaded without filter")
    void testAuditLogsCanBeLoaded() {
        Page<AuditLogDto> result = auditService.getAuditLogs(null, null, null, null, null, PageRequest.of(0, 10));
        assertThat(result).isNotNull();
        assertThat(result.getContent()).hasSize(3);
    }

    @Test
    @DisplayName("2. Search by actor email works exactly")
    void testSearchByActorEmail() {
        Page<AuditLogDto> result = auditService.getAuditLogs(null, null, "admin@ohotech.com", null, null, PageRequest.of(0, 10));
        assertThat(result).isNotEmpty();
        assertThat(result.getContent()).anyMatch(log -> "admin@ohotech.com".equals(log.getActorEmail()));
    }

    @Test
    @DisplayName("3. Search is case-insensitive for email and description")
    void testSearchCaseInsensitive() {
        Page<AuditLogDto> upperEmailSearch = auditService.getAuditLogs(null, null, "ADMIN@OHOTECH.COM", null, null, PageRequest.of(0, 10));
        assertThat(upperEmailSearch).isNotEmpty();
        assertThat(upperEmailSearch.getContent().get(0).getActorEmail()).isEqualTo("admin@ohotech.com");

        Page<AuditLogDto> upperDescSearch = auditService.getAuditLogs(null, null, "ROUTING RULES", null, null, PageRequest.of(0, 10));
        assertThat(upperDescSearch).isNotEmpty();
        assertThat(upperDescSearch.getContent().get(0).getActorEmail()).isEqualTo("developer@ohotech.com");
    }

    @Test
    @DisplayName("4. Search by description works")
    void testSearchByDescription() {
        Page<AuditLogDto> result = auditService.getAuditLogs(null, null, "enterprise dashboard", null, null, PageRequest.of(0, 10));
        assertThat(result).hasSize(1);
        assertThat(result.getContent().get(0).getDescription()).contains("enterprise dashboard");
    }

    @Test
    @DisplayName("5. NULL description and NULL actorEmail do not cause failures")
    void testNullFieldsDoNotFail() {
        Page<AuditLogDto> result = auditService.getAuditLogs(null, null, "nonexistent_term", null, null, PageRequest.of(0, 10));
        assertThat(result).isEmpty();

        Page<AuditLogDto> allLogs = auditService.getAuditLogs("SYSTEM_HEARTBEAT", null, null, null, null, PageRequest.of(0, 10));
        assertThat(allLogs).hasSize(1);
        assertThat(allLogs.getContent().get(0).getDescription()).isNull();
        assertThat(allLogs.getContent().get(0).getActorEmail()).isNull();
    }

    @Test
    @DisplayName("6. Pagination works as expected")
    void testPaginationWorks() {
        Page<AuditLogDto> page0 = auditService.getAuditLogs(null, null, null, null, null, PageRequest.of(0, 2));
        assertThat(page0.getContent()).hasSize(2);
        assertThat(page0.getTotalElements()).isEqualTo(3);
        assertThat(page0.getTotalPages()).isEqualTo(2);

        Page<AuditLogDto> page1 = auditService.getAuditLogs(null, null, null, null, null, PageRequest.of(1, 2));
        assertThat(page1.getContent()).hasSize(1);
    }

    @Test
    @DisplayName("7. Date filtering works correctly")
    void testDateFilteringWorks() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        LocalDate future = today.plusDays(2);

        Page<AuditLogDto> inRange = auditService.getAuditLogs(null, null, null, yesterday, future, PageRequest.of(0, 10));
        assertThat(inRange).hasSize(3);

        Page<AuditLogDto> outOfRange = auditService.getAuditLogs(null, null, null, yesterday, yesterday, PageRequest.of(0, 10));
        assertThat(outOfRange).isEmpty();
    }

    @Test
    @DisplayName("8. Sorting by createdAt desc works")
    void testSortingByCreatedAtDesc() {
        Page<AuditLogDto> result = auditService.getAuditLogs(null, null, null, null, null, PageRequest.of(0, 10));
        assertThat(result.getContent()).hasSize(3);
        assertThat(result.getContent().get(0).getCreatedAt())
                .isAfterOrEqualTo(result.getContent().get(1).getCreatedAt());
        assertThat(result.getContent().get(1).getCreatedAt())
                .isAfterOrEqualTo(result.getContent().get(2).getCreatedAt());
    }

    @Test
    @DisplayName("9. Controller endpoint /api/admin/audit-logs returns 200 for normal and filtered requests")
    @WithMockUser(authorities = {"ROLE_ADMIN"})
    void testAdminAuditLogsEndpoint() throws Exception {
        // Normal audit log request
        mockMvc.perform(get("/api/admin/audit-logs")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray())
                .andExpect(jsonPath("$.data.totalElements").value(3));

        // Search request
        mockMvc.perform(get("/api/admin/audit-logs")
                        .param("search", "ADMIN@OHOTECH.COM")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].actorEmail").value("admin@ohotech.com"));

        // Search by description
        mockMvc.perform(get("/api/admin/audit-logs")
                        .param("search", "gateway")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content[0].description").value("Updated API gateway routing rules"));

        // Pagination request
        mockMvc.perform(get("/api/admin/audit-logs")
                        .param("page", "0")
                        .param("size", "2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.size").value(2))
                .andExpect(jsonPath("$.data.totalPages").value(2));

        // Date filter request
        mockMvc.perform(get("/api/admin/audit-logs")
                        .param("startDate", LocalDate.now().toString())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
