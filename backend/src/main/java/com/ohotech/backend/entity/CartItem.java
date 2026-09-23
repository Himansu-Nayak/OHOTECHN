package com.ohotech.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    @JsonIgnore
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_plan_id")
    private ProductPlan productPlan;

    @Column(nullable = false)
    private Integer quantity;

    @com.fasterxml.jackson.annotation.JsonProperty("price")
    public java.math.BigDecimal getPrice() {
        if (productPlan != null && productPlan.getPrice() != null) {
            return productPlan.getPrice();
        }
        if (product != null && product.getPrice() != null) {
            return product.getPrice();
        }
        return java.math.BigDecimal.ZERO;
    }

    @com.fasterxml.jackson.annotation.JsonProperty("itemTotal")
    public java.math.BigDecimal getItemTotal() {
        int qty = quantity != null ? quantity : 0;
        return getPrice().multiply(java.math.BigDecimal.valueOf(qty));
    }
}
