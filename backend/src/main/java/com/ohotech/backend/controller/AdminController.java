package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Slf4j
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    // 1. Dashboard Overview Metrics
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long totalUsers = userRepository.count();
        long totalQuotes = contactRepository.count();

        List<Order> orders = orderRepository.findAll();
        BigDecimal totalRevenue = orders.stream()
                .map(Order::getTotalAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProducts", totalProducts);
        stats.put("totalOrders", totalOrders);
        stats.put("totalUsers", totalUsers);
        stats.put("totalQuotes", totalQuotes);
        stats.put("totalRevenue", totalRevenue);
        stats.put("systemStatus", "OPERATIONAL_100");

        return ResponseEntity.ok(ApiResponse.success("Admin stats retrieved successfully", stats));
    }

    // 2. Manage Product Prices & Stock
    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {
        
        return productRepository.findById(id)
                .map(product -> {
                    if (payload.containsKey("name")) {
                        product.setName((String) payload.get("name"));
                    }
                    if (payload.containsKey("price")) {
                        product.setPrice(new BigDecimal(payload.get("price").toString()));
                    }
                    if (payload.containsKey("stock")) {
                        product.setStock(Integer.parseInt(payload.get("stock").toString()));
                    }
                    if (payload.containsKey("description")) {
                        product.setDescription((String) payload.get("description"));
                    }
                    if (payload.containsKey("active")) {
                        product.setActive(Boolean.parseBoolean(payload.get("active").toString()));
                    }
                    Product saved = productRepository.save(product);
                    log.info("Admin updated product #{}: {}", id, saved.getName());
                    return ResponseEntity.ok(ApiResponse.success("Product updated successfully", saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. View & Update Orders
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved successfully", orders));
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

    // 5. User Account List
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users list retrieved", users));
    }
}
