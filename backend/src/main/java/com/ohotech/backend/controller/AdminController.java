package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.AssignOfficialEmailRequest;
import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.dto.UserDto;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import com.ohotech.backend.service.ProductService;
import com.ohotech.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ProductService productService;
    private final com.ohotech.backend.service.ContactService contactService;
    private final com.ohotech.backend.service.PaymentService paymentService;

    // 1. Dashboard Overview Metrics
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalQuotes = contactRepository.count();

        List<Order> orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .map(o -> o.getTotalAmount())
                .filter(amt -> amt != null)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalQuotes", totalQuotes);
        stats.put("totalRevenue", totalRevenue);
        stats.put("systemStatus", "OPERATIONAL_100");

        return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved successfully", stats));
    }

    // 2. Admin Product Catalog Management APIs
    @GetMapping("/products")
    public ResponseEntity<ApiResponse<Page<ProductDto>>> getAdminProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Boolean active) {

        Page<ProductDto> products = productService.getAdminProducts(page, size, search, category, active);
        return ResponseEntity.ok(ApiResponse.success("Admin products list retrieved", products));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getAdminProductById(@PathVariable Long id) {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product fetched successfully", product));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductDto dto) {
        ProductDto created = productService.createProduct(dto);
        log.info("Admin created new product: {}", created.getName());
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", created));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductDto dto) {
        
        ProductDto updated = productService.updateProduct(id, dto);
        log.info("Admin updated product #{}: {}", id, updated.getName());
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @PatchMapping("/products/{id}/status")
    public ResponseEntity<ApiResponse<ProductDto>> updateProductStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        
        Boolean active = payload.get("active");
        if (active == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'active' is required"));
        }

        ProductDto updated = productService.toggleProductStatus(id, active);
        log.info("Admin updated product #{} active status to {}", id, active);
        return ResponseEntity.ok(ApiResponse.success("Product status updated successfully", updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        log.info("Admin soft-deleted product #{}", id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully", null));
    }

    // 3. View & Update Orders
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
    }

    // 3.5 View Real Payment Transactions
    @GetMapping("/payments")
    public ResponseEntity<ApiResponse<List<com.ohotech.backend.dto.PaymentResponseDto>>> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt"));
        List<com.ohotech.backend.dto.PaymentResponseDto> dtos = payments.stream()
                .map(paymentService::mapPaymentToDto)
                .toList();
        return ResponseEntity.ok(ApiResponse.success("Payments retrieved successfully", dtos));
    }

    // 3.6 Admin Manual Payment Approval (UTR Verification)
    @PutMapping("/payments/{id}/verify")
    public ResponseEntity<ApiResponse<com.ohotech.backend.dto.PaymentResponseDto>> verifyPayment(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ohotech.backend.security.UserPrincipal adminUser,
            @PathVariable Long id,
            @RequestBody(required = false) com.ohotech.backend.dto.AdminPaymentActionRequest actionRequest) {
        
        com.ohotech.backend.dto.PaymentResponseDto response = paymentService.adminVerifyPayment(adminUser.getId(), id, actionRequest);
        log.info("Admin #{} verified payment #{}", adminUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Payment verified and approved successfully", response));
    }

    // 3.7 Admin Payment Rejection
    @PutMapping("/payments/{id}/reject")
    public ResponseEntity<ApiResponse<com.ohotech.backend.dto.PaymentResponseDto>> rejectPayment(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.ohotech.backend.security.UserPrincipal adminUser,
            @PathVariable Long id,
            @RequestBody(required = false) com.ohotech.backend.dto.AdminPaymentActionRequest actionRequest) {
        
        com.ohotech.backend.dto.PaymentResponseDto response = paymentService.adminRejectPayment(adminUser.getId(), id, actionRequest);
        log.info("Admin #{} rejected payment #{}", adminUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Payment rejected", response));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusPayload) {
        
        String newStatusStr = statusPayload.get("status");
        return orderRepository.findById(id)
                .map(order -> {
                    try {
                        OrderStatus status = OrderStatus.valueOf(newStatusStr.toUpperCase());
                        order.setStatus(status);
                        Order saved = orderRepository.save(order);
                        log.info("Admin updated order #{} status to {}", id, status);
                        return ResponseEntity.ok(ApiResponse.success("Order status updated", saved));
                    } catch (IllegalArgumentException e) {
                        return ResponseEntity.badRequest().body(ApiResponse.<Order>error("Invalid status value"));
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 4. View Commercial Quote Enquiries
    @GetMapping("/quotes")
    public ResponseEntity<ApiResponse<List<ContactEnquiry>>> getCommercialQuotes() {
        List<ContactEnquiry> quotes = contactRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Quote enquiries retrieved", quotes));
    }

    // 5. User Account List (Paginated & Searchable)
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role) {

        Page<UserDto> usersPage = userService.getUsersAdmin(page, size, search, role);
        return ResponseEntity.ok(ApiResponse.success("Users list retrieved successfully", usersPage));
    }

    // 6. Single User Details
    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        UserDto userDto = userService.getUserByIdAdmin(id);
        return ResponseEntity.ok(ApiResponse.success("User details fetched successfully", userDto));
    }

    // 7. Update User Enabled Status
    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody Map<String, Boolean> payload) {
        
        Boolean enabled = payload.get("enabled");
        if (enabled == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'enabled' is required in body"));
        }

        UserDto updatedUser = userService.updateUserStatusAdmin(id, enabled);
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updatedUser));
    }

    // 8. Update User Role
    @PatchMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserDto>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        String roleStr = payload.get("role");
        if (roleStr == null || roleStr.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'role' is required in body"));
        }

        try {
            Role role = Role.valueOf(roleStr.trim().toUpperCase());
            UserDto updatedUser = userService.updateUserRoleAdmin(id, role);
            return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updatedUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid role value: " + roleStr));
        }
    }

    // 8.5 Assign Official Company Email to User (Admin Only)
    @PutMapping("/users/{id}/official-email")
    public ResponseEntity<ApiResponse<UserDto>> assignOfficialEmail(
            @PathVariable Long id,
            @Valid @RequestBody AssignOfficialEmailRequest request) {

        UserDto updatedUser = userService.assignOfficialEmailAdmin(id, request.getOfficialEmail());
        log.info("Admin assigned official email {} to user #{}", request.getOfficialEmail(), id);
        return ResponseEntity.ok(ApiResponse.success("Official email assigned successfully", updatedUser));
    }

    // 9. Get All Customer Quotes & Demo Enquiries
    @GetMapping("/enquiries")
    public ResponseEntity<ApiResponse<List<ContactEnquiry>>> getAllEnquiries() {
        List<ContactEnquiry> enquiries = contactService.getAllEnquiriesForAdmin();
        return ResponseEntity.ok(ApiResponse.success("Fetched all customer quote and demo enquiries successfully", enquiries));
    }

    // 10. Update Enquiry Status (PENDING, CONTACTED, RESOLVED, CLOSED)
    @PutMapping("/enquiries/{id}/status")
    public ResponseEntity<ApiResponse<ContactEnquiry>> updateEnquiryStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Field 'status' is required in request body"));
        }
        ContactEnquiry updated = contactService.updateEnquiryStatus(id, status.trim().toUpperCase());
        return ResponseEntity.ok(ApiResponse.success("Enquiry status updated successfully", updated));
    }
}
