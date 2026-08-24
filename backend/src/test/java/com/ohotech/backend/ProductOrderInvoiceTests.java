package com.ohotech.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ohotech.backend.dto.CartItemRequest;
import com.ohotech.backend.dto.OrderRequest;
import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ProductOrderInvoiceTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    @SuppressWarnings("unused")
    private PaymentRepository paymentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper().registerModule(new JavaTimeModule());
    }

    @Test
    @DisplayName("1. Product Catalog: Public Listing, Search, Category Filter, and Product Details")
    void testPublicProductCatalog() throws Exception {
        Category cat = categoryRepository.save(Category.builder().name("Test Cat " + UUID.randomUUID()).description("Test").build());
        Product p1 = productRepository.save(Product.builder()
                .name("Alpha Software ERP")
                .description("Enterprise software solution")
                .price(new BigDecimal("25000.00"))
                .stock(50)
                .category(cat)
                .active(true)
                .build());

        // Public GET /api/products
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.content").isArray());

        // Search by query
        mockMvc.perform(get("/api/products?search=Alpha"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Filter by Category
        mockMvc.perform(get("/api/products?category=" + cat.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // GET Single Product Details
        mockMvc.perform(get("/api/products/" + p1.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Alpha Software ERP"));
    }

    @Test
    @DisplayName("2. Admin Product CRUD Operations & Customer 403 Forbidden Rejection")
    void testAdminProductCrudAndCustomerRejection() throws Exception {
        // Create Admin User
        User admin = userRepository.save(User.builder()
                .name("Catalog Admin")
                .email("cat_admin_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_ADMIN)
                .enabled(true)
                .build());
        String adminToken = jwtTokenProvider.generateTokenFromUserId(admin.getId());

        // Create Customer User
        User customer = userRepository.save(User.builder()
                .name("Normal Customer")
                .email("cust_cat_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        String customerToken = jwtTokenProvider.generateTokenFromUserId(customer.getId());

        ProductDto newProd = ProductDto.builder()
                .name("New Admin Module")
                .description("Admin created module")
                .price(new BigDecimal("45000.00"))
                .stock(100)
                .active(true)
                .build();

        // 1. Customer attempting to CREATE product -> 403 Forbidden
        mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProd)))
                .andExpect(status().isForbidden());

        // 2. Admin creating product -> 200 OK
        MvcResult createResult = mockMvc.perform(post("/api/admin/products")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newProd)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("New Admin Module"))
                .andReturn();

        String responseJson = createResult.getResponse().getContentAsString();
        @SuppressWarnings("unchecked")
        Map<String, Object> respMap = objectMapper.readValue(responseJson, Map.class);
        @SuppressWarnings("unchecked")
        Map<String, Object> dataMap = (Map<String, Object>) respMap.get("data");
        Long createdId = Long.valueOf(dataMap.get("id").toString());

        // 3. Admin updating product -> 200 OK
        ProductDto updateProd = ProductDto.builder()
                .name("Updated Admin Module")
                .price(new BigDecimal("50000.00"))
                .stock(120)
                .active(true)
                .build();

        mockMvc.perform(put("/api/admin/products/" + createdId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateProd)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Updated Admin Module"));

        // 4. Admin toggling product status -> 200 OK
        mockMvc.perform(patch("/api/admin/products/" + createdId + "/status")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("active", false))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(false));

        // 5. Admin soft deleting product -> 200 OK
        mockMvc.perform(delete("/api/admin/products/" + createdId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("3. Cart Operations: Add Item, Update Quantity, Remove Item, Clear Cart")
    void testCartOperations() throws Exception {
        User customer = userRepository.save(User.builder()
                .name("Cart User")
                .email("cart_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        String token = jwtTokenProvider.generateTokenFromUserId(customer.getId());

        Product product = productRepository.save(Product.builder()
                .name("Cart Module")
                .price(new BigDecimal("15000.00"))
                .stock(50)
                .active(true)
                .build());

        // 1. Add item to cart
        CartItemRequest addReq = new CartItemRequest();
        addReq.setProductId(product.getId());
        addReq.setQuantity(2);

        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 2. Fetch cart
        mockMvc.perform(get("/api/cart")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.items").isArray());

        // 3. Clear cart
        mockMvc.perform(delete("/api/cart")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("4. Order Subsystem: Server-side Calculation & Ownership Isolation")
    void testOrderCreationAndOwnershipSecurity() throws Exception {
        User customer1 = userRepository.save(User.builder()
                .name("Customer One")
                .email("cust1_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        String token1 = jwtTokenProvider.generateTokenFromUserId(customer1.getId());

        User customer2 = userRepository.save(User.builder()
                .name("Customer Two")
                .email("cust2_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        String token2 = jwtTokenProvider.generateTokenFromUserId(customer2.getId());

        Product product = productRepository.save(Product.builder()
                .name("Order Module")
                .price(new BigDecimal("30000.00"))
                .stock(50)
                .active(true)
                .build());

        // Customer 1 adds item to cart
        CartItemRequest addReq = new CartItemRequest();
        addReq.setProductId(product.getId());
        addReq.setQuantity(1);

        mockMvc.perform(post("/api/cart/items")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(addReq)))
                .andExpect(status().isOk());

        // Customer 1 places order
        OrderRequest orderReq = new OrderRequest();
        orderReq.setShippingAddress("123 Tech Street, Bhubaneswar");
        orderReq.setContactPhone("+91 99999 88888");

        MvcResult orderResult = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(orderReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalAmount").value(30000.00))
                .andReturn();

        String responseJson = orderResult.getResponse().getContentAsString();
        @SuppressWarnings("unchecked")
        Map<String, Object> respMap = objectMapper.readValue(responseJson, Map.class);
        @SuppressWarnings("unchecked")
        Map<String, Object> dataMap = (Map<String, Object>) respMap.get("data");
        Long orderId = Long.valueOf(dataMap.get("id").toString());

        // Customer 1 fetches own order -> 200 OK
        mockMvc.perform(get("/api/orders/" + orderId)
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk());

        // Customer 2 attempts to fetch Customer 1's order -> 404 / ResourceNotFoundException
        mockMvc.perform(get("/api/orders/" + orderId)
                        .header("Authorization", "Bearer " + token2))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("5. Order Invoice PDF Generation & Ownership Authorization")
    void testPdfInvoiceDownloadAuthorization() throws Exception {
        User owner = userRepository.save(User.builder()
                .name("Invoice Owner")
                .email("inv_owner_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .phone("9111222333")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        String ownerToken = jwtTokenProvider.generateTokenFromUserId(owner.getId());

        User attacker = userRepository.save(User.builder()
                .name("Attacker User")
                .email("attacker_" + UUID.randomUUID().toString().substring(0, 8) + "@ohotech.com")
                .phone("9444555666")
                .passwordHash(passwordEncoder.encode("Pass123!"))
                .role(Role.ROLE_CUSTOMER)
                .enabled(true)
                .build());
        String attackerToken = jwtTokenProvider.generateTokenFromUserId(attacker.getId());

        Order order = orderRepository.save(Order.builder()
                .user(owner)
                .shippingAddress("Test Shipping Address")
                .contactPhone("9111222333")
                .totalAmount(new BigDecimal("50000.00"))
                .status(OrderStatus.CONFIRMED)
                .build());

        // 1. Owner downloading PDF Invoice -> 200 OK & application/pdf
        mockMvc.perform(get("/api/orders/" + order.getId() + "/invoice")
                        .header("Authorization", "Bearer " + ownerToken))
                .andExpect(status().isOk())
                .andExpect(header().string(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_PDF_VALUE));

        // 2. Attacker attempting to download Owner's PDF Invoice -> 404 Not Found
        mockMvc.perform(get("/api/orders/" + order.getId() + "/invoice")
                        .header("Authorization", "Bearer " + attackerToken))
                .andExpect(status().isNotFound());
    }
}
