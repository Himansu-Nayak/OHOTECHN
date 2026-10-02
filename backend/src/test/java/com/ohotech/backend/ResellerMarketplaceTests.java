package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ohotech.backend.dto.DeploymentDto;
import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.dto.ProviderDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public class ResellerMarketplaceTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProviderRepository providerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DeploymentRepository deploymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private User adminUser;
    private User customerUser;
    private User anotherCustomer;
    private String adminToken;
    private String customerToken;
    private String anotherCustomerToken;
    private Category softwareCategory;

    @BeforeEach
    void setUp() {
        String uid = UUID.randomUUID().toString().substring(0, 8);

        adminUser = userRepository.save(User.builder()
                .name("Admin Reseller Mgr")
                .email("admin_reseller_" + uid + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build());
        adminToken = jwtTokenProvider.generateTokenFromUserId(adminUser.getId());

        customerUser = userRepository.save(User.builder()
                .name("Customer Reseller Buyer")
                .email("buyer_" + uid + "@client.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        customerToken = jwtTokenProvider.generateTokenFromUserId(customerUser.getId());

        anotherCustomer = userRepository.save(User.builder()
                .name("Another Buyer")
                .email("another_" + uid + "@client.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        anotherCustomerToken = jwtTokenProvider.generateTokenFromUserId(anotherCustomer.getId());

        softwareCategory = categoryRepository.save(Category.builder()
                .name("Enterprise FinTech " + uid)
                .description("FinTech, Cooperative, and Banking Systems")
                .build());
    }

    @Test
    @DisplayName("Reseller 1: Admin can register software provider agency")
    void testAdminCanRegisterProvider() throws Exception {
        ProviderDto providerDto = ProviderDto.builder()
                .name("Nexus Core Technologies " + UUID.randomUUID().toString().substring(0, 5))
                .companyName("Nexus Core Labs Pvt Ltd")
                .contactPerson("Rajesh Sharma")
                .contactEmail("rajesh@nexuscore.example")
                .contactPhone("9876543210")
                .commercialTerms("60% wholesale cost, 40% OHO TECH margin")
                .commissionRate(new BigDecimal("40.00"))
                .technicalIntegrationType("API")
                .integrationStatus("Integration pending provider/API information")
                .supportResponsibility("SHARED")
                .deploymentResponsibility("OHO_TECH")
                .contractStatus("ACTIVE")
                .active(true)
                .build();

        mockMvc.perform(post("/api/admin/providers")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(providerDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value(providerDto.getName()))
                .andExpect(jsonPath("$.data.commercialTerms").value(providerDto.getCommercialTerms()))
                .andExpect(jsonPath("$.data.integrationStatus").value("Integration pending provider/API information"));
    }

    @Test
    @DisplayName("Reseller 2: Customer is forbidden from accessing Admin Provider APIs")
    void testCustomerCannotAccessProviderAdminApis() throws Exception {
        mockMvc.perform(get("/api/admin/providers")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Reseller 3: Strict Isolation - Wholesale Provider Cost Never Leaked to Public or Customers")
    void testStrictWholesalePriceIsolation() throws Exception {
        Provider provider = providerRepository.save(Provider.builder()
                .name("FinTech Solutions Agency")
                .companyName("FinTech Solutions LLP")
                .contactPerson("Amit Verma")
                .contactEmail("amit@fintechsolutions.example")
                .active(true)
                .build());

        // Create product with provider cost = 25000, margin = 10000, selling price = 35000
        Product product = productRepository.save(Product.builder()
                .name("Credit Cooperative Society Banking Suite")
                .description("Multi-branch banking, savings, loan disbursements, and accounting.")
                .price(new BigDecimal("35000.00"))
                .providerCost(new BigDecimal("25000.00"))
                .resellerMargin(new BigDecimal("10000.00"))
                .provider(provider)
                .category(softwareCategory)
                .integrationStatus("Integration pending provider/API information")
                .deploymentType("MANAGED_CLOUD")
                .active(true)
                .stock(50)
                .build());

        // 1. Check Public API (Unauthenticated) -> providerCost and resellerMargin MUST BE NULL
        mockMvc.perform(get("/api/products/" + product.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Credit Cooperative Society Banking Suite"))
                .andExpect(jsonPath("$.data.price").value(35000.00))
                .andExpect(jsonPath("$.data.providerCost").doesNotExist())
                .andExpect(jsonPath("$.data.resellerMargin").doesNotExist())
                .andExpect(jsonPath("$.data.providerId").doesNotExist())
                .andExpect(jsonPath("$.data.providerName").doesNotExist())
                .andExpect(jsonPath("$.data.integrationStatus").value("Integration pending provider/API information"));

        // 2. Check Admin API -> Admin can view wholesale cost and margins
        mockMvc.perform(get("/api/admin/products/" + product.getId())
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.price").value(35000.00))
                .andExpect(jsonPath("$.data.providerCost").value(25000.00))
                .andExpect(jsonPath("$.data.resellerMargin").value(10000.00))
                .andExpect(jsonPath("$.data.providerName").value("FinTech Solutions Agency"));
    }

    @Test
    @DisplayName("Reseller 4: Deployment Lifecycle Tracking and Customer Security")
    void testDeploymentLifecycleAndSecurity() throws Exception {
        Product product = productRepository.save(Product.builder()
                .name("MLM Binary Plan Portal")
                .description("Automated binary tree structure, commission engine, and payout gateway.")
                .price(new BigDecimal("49000.00"))
                .category(softwareCategory)
                .active(true)
                .build());

        // Admin schedules a deployment for customerUser
        DeploymentDto deploymentDto = DeploymentDto.builder()
                .productId(product.getId())
                .userId(customerUser.getId())
                .targetEnvironment("CLOUD_MANAGED")
                .adminNotes("Confidential server IP: 10.0.0.45. Root access reserved.")
                .customerNotes("Your cloud environment is currently being provisioned on OHO Managed Cloud.")
                .build();

        String res = mockMvc.perform(post("/api/admin/deployments")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(deploymentDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("PENDING"))
                .andReturn().getResponse().getContentAsString();

        Long deploymentId = objectMapper.readTree(res).path("data").path("id").asLong();

        // 1. Customer User can track their own deployment
        mockMvc.perform(get("/api/deployments/my")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].customerNotes").value("Your cloud environment is currently being provisioned on OHO Managed Cloud."))
                .andExpect(jsonPath("$.data[0].adminNotes").doesNotExist()); // Admin notes never leaked!

        // 2. Another customer CANNOT access this customer's deployment (Forbidden)
        mockMvc.perform(get("/api/deployments/" + deploymentId)
                        .header("Authorization", "Bearer " + anotherCustomerToken))
                .andExpect(status().isForbidden());

        // 3. Admin updates deployment to LIVE with access URL
        mockMvc.perform(put("/api/admin/deployments/" + deploymentId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"LIVE\",\"accessUrl\":\"https://client-portal.ohotechn.com\",\"assignedEngineer\":\"Himansu Nayak\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("LIVE"))
                .andExpect(jsonPath("$.data.accessUrl").value("https://client-portal.ohotechn.com"));

        // 4. Customer can now view live access URL
        mockMvc.perform(get("/api/deployments/" + deploymentId)
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("LIVE"))
                .andExpect(jsonPath("$.data.accessUrl").value("https://client-portal.ohotechn.com"));
    }
}
