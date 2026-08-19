package com.ohotech.backend.controller;

import com.ohotech.backend.dto.ApiResponse;
import com.ohotech.backend.dto.CartItemRequest;
import com.ohotech.backend.entity.Cart;
import com.ohotech.backend.security.UserPrincipal;
import com.ohotech.backend.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<ApiResponse<Cart>> getCart(@AuthenticationPrincipal UserPrincipal currentUser) {
        Cart cart = cartService.getOrCreateCart(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Cart fetched successfully", cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<Cart>> addItemToCart(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CartItemRequest request) {
        Cart cart = cartService.addItemToCart(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Item added to cart successfully", cart));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> updateItemQuantity(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        Cart cart = cartService.updateCartItemQuantity(currentUser.getId(), itemId, quantity);
        return ResponseEntity.ok(ApiResponse.success("Cart item updated successfully", cart));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<Cart>> removeItem(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long itemId) {
        Cart cart = cartService.removeItemFromCart(currentUser.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.success("Cart item removed successfully", cart));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<String>> clearCart(@AuthenticationPrincipal UserPrincipal currentUser) {
        cartService.clearCart(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Cart cleared successfully", null));
    }
}
