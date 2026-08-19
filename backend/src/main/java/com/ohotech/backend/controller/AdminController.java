package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.entity.ContactEnquiry;
import com.ohotech.backend.entity.Order;
import com.ohotech.backend.entity.OrderStatus;
import com.ohotech.backend.service.ContactService;
import com.ohotech.backend.service.OrderService;
import com.ohotech.backend.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final OrderService orderService;
    private final ContactService contactService;

    // Product Management
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductDto dto) {
        ProductDto product = productService.createProduct(dto);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", product));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductDto dto) {
        ProductDto product = productService.updateProduct(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", product));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deactivated successfully", null));
    }

    // Order Management
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders(@RequestParam(required = false) OrderStatus status) {
        List<Order> orders = orderService.getAllOrdersForAdmin(status);
        return ResponseEntity.ok(ApiResponse.success("All orders fetched successfully", orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        Order order = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", order));
    }

    // Enquiry Management
    @GetMapping("/enquiries")
    public ResponseEntity<ApiResponse<List<ContactEnquiry>>> getEnquiries() {
        List<ContactEnquiry> enquiries = contactService.getAllEnquiriesForAdmin();
        return ResponseEntity.ok(ApiResponse.success("Enquiries fetched successfully", enquiries));
    }

    @PutMapping("/enquiries/{id}/status")
    public ResponseEntity<ApiResponse<ContactEnquiry>> updateEnquiryStatus(@PathVariable Long id, @RequestParam String status) {
        ContactEnquiry enquiry = contactService.updateEnquiryStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Enquiry status updated successfully", enquiry));
    }
}
