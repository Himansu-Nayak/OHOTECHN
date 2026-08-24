package com.ohotech.backend.service;

import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.entity.Category;
import com.ohotech.backend.entity.Product;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.CategoryRepository;
import com.ohotech.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Page<ProductDto> getActiveProducts(int page, int size, String searchQuery, Long categoryId) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> products;

        boolean hasSearch = searchQuery != null && !searchQuery.trim().isEmpty();
        String q = hasSearch ? searchQuery.trim() : "";

        if (categoryId != null && hasSearch) {
            products = productRepository.findByCategoryIdAndActiveTrueAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(categoryId, q, q, pageable);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
        } else if (hasSearch) {
            products = productRepository.findByActiveTrueAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pageable);
        } else {
            products = productRepository.findByActiveTrue(pageable);
        }

        return products.map(this::mapToDto);
    }

    public Page<ProductDto> getAdminProducts(int page, int size, String searchQuery, Long categoryId, Boolean active) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> products;

        boolean hasSearch = searchQuery != null && !searchQuery.trim().isEmpty();
        String q = hasSearch ? searchQuery.trim() : "";

        if (categoryId != null && hasSearch) {
            products = productRepository.findByCategoryIdAndNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(categoryId, q, q, pageable);
        } else if (categoryId != null) {
            products = productRepository.findByCategoryId(categoryId, pageable);
        } else if (hasSearch) {
            products = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q, pageable);
        } else if (Boolean.TRUE.equals(active)) {
            products = productRepository.findByActiveTrue(pageable);
        } else {
            products = productRepository.findAll(pageable);
        }

        return products.map(this::mapToDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToDto(product);
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));
        }

        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stock(dto.getStock() != null ? dto.getStock() : 100)
                .imageUrl(dto.getImageUrl())
                .serviceType(dto.getServiceType())
                .category(category)
                .active(dto.isActive())
                .build();

        return mapToDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));
            product.setCategory(category);
        }

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        if (dto.getPrice() != null) product.setPrice(dto.getPrice());
        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getServiceType() != null) product.setServiceType(dto.getServiceType());
        product.setActive(dto.isActive());

        return mapToDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto toggleProductStatus(Long id, boolean active) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(active);
        return mapToDto(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }

    public ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .serviceType(product.getServiceType())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .active(product.isActive())
                .build();
    }
}
