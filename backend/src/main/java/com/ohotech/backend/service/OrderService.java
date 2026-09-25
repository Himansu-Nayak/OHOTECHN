package com.ohotech.backend.service;

import com.ohotech.backend.dto.OrderRequest;
import com.ohotech.backend.entity.*;
import com.ohotech.backend.exception.BadRequestException;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.CartRepository;
import com.ohotech.backend.repository.OrderRepository;
import com.ohotech.backend.repository.ProductPlanRepository;
import com.ohotech.backend.repository.ProductRepository;
import com.ohotech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductPlanRepository productPlanRepository;
    private final EmailService emailService;

    @Transactional
    public Order createOrderFromCart(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Cart is empty!"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create an order with an empty cart!");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .contactPhone(request.getContactPhone())
                .totalAmount(BigDecimal.ZERO)
                .build();

        for (CartItem cartItem : cart.getItems()) {
            Product product = productRepository.findById(cartItem.getProduct().getId())
                    .orElseThrow(() -> new BadRequestException("Product not found with id: " + cartItem.getProduct().getId()));

            if (!product.isActive()) {
                throw new BadRequestException("Product is no longer available: " + product.getName());
            }

            ProductPlan plan = null;
            BigDecimal unitPrice;

            if (cartItem.getProductPlan() != null && cartItem.getProductPlan().getId() != null) {
                plan = productPlanRepository.findById(cartItem.getProductPlan().getId())
                        .orElseThrow(() -> new BadRequestException("Product plan not found with id: " + cartItem.getProductPlan().getId()));

                if (!plan.getProduct().getId().equals(product.getId())) {
                    throw new BadRequestException("Plan does not belong to product!");
                }
                if (!plan.isActive()) {
                    throw new BadRequestException("Selected plan is no longer available: " + plan.getName());
                }
                unitPrice = plan.getPrice();
            } else {
                unitPrice = product.getPrice();
            }

            if (unitPrice == null || unitPrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new BadRequestException("Product price must be greater than zero!");
            }

            int quantity = cartItem.getQuantity() != null && cartItem.getQuantity() > 0 ? cartItem.getQuantity() : 1;
            BigDecimal itemTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
            totalAmount = totalAmount.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productPlan(plan)
                    .quantity(quantity)
                    .price(unitPrice)
                    .build();

            orderItems.add(orderItem);
        }

        if (totalAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Total order amount must be greater than zero!");
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        Order savedOrder = orderRepository.save(order);

        // DO NOT clear cart here! The cart is preserved until payment is verified successfully.

        if (user.getEmail() != null) {
            try {
                emailService.sendEmail(user.getEmail(), "OHO TECHN - Order Confirmation #" + savedOrder.getId(),
                        "Thank you for your order #" + savedOrder.getId() + "!\nTotal Amount: ₹" + totalAmount + "\nStatus: PENDING PAYMENT");
            } catch (Exception e) {
                // Email sending shouldn't abort order creation
            }
        }

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(Long userId, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Order", "id", orderId);
        }

        return order;
    }

    public List<Order> getAllOrdersForAdmin(OrderStatus status) {
        if (status != null) {
            return orderRepository.findByStatusOrderByCreatedAtDesc(status);
        }
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(status);
        return orderRepository.save(order);
    }
}
