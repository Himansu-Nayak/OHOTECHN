package com.ohotech.backend.service;

import com.ohotech.backend.dto.ProductDto;
import com.ohotech.backend.entity.Category;
import com.ohotech.backend.entity.Product;
import com.ohotech.backend.entity.Provider;
import com.ohotech.backend.exception.ResourceNotFoundException;
import com.ohotech.backend.repository.CategoryRepository;
import com.ohotech.backend.repository.ProductRepository;
import com.ohotech.backend.repository.ProviderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProviderRepository providerRepository;

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

        return products.map(this::mapToPublicDto);
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

        return products.map(this::mapToAdminDto);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToPublicDto(product);
    }

    public ProductDto getAdminProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return mapToAdminDto(product);
    }

    @Transactional
    public ProductDto createProduct(ProductDto dto) {
        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", dto.getCategoryId()));
        }

        Provider provider = null;
        if (dto.getProviderId() != null) {
            provider = providerRepository.findById(dto.getProviderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", dto.getProviderId()));
        }

        BigDecimal sellingPrice = dto.getPrice();
        if (sellingPrice == null && dto.getProviderCost() != null && dto.getResellerMargin() != null) {
            sellingPrice = dto.getProviderCost().add(dto.getResellerMargin());
        }

        Product product = Product.builder()
                .name(dto.getName())
                .slug(dto.getSlug())
                .description(dto.getDescription())
                .price(sellingPrice)
                .providerCost(dto.getProviderCost())
                .resellerMargin(dto.getResellerMargin())
                .provider(provider)
                .integrationStatus(dto.getIntegrationStatus() != null ? dto.getIntegrationStatus() : "Integration pending provider/API information")
                .deploymentType(dto.getDeploymentType() != null ? dto.getDeploymentType() : "MANAGED_CLOUD")
                .demoUrl(dto.getDemoUrl())
                .documentationUrl(dto.getDocumentationUrl())
                .featured(dto.isFeatured())
                .stock(dto.getStock() != null ? dto.getStock() : 100)
                .imageUrl(dto.getImageUrl())
                .serviceType(dto.getServiceType())
                .category(category)
                .active(dto.isActive())
                .build();

        return mapToAdminDto(productRepository.save(product));
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

        if (dto.getProviderId() != null) {
            Provider provider = providerRepository.findById(dto.getProviderId())
                    .orElseThrow(() -> new ResourceNotFoundException("Provider", "id", dto.getProviderId()));
            product.setProvider(provider);
        }

        if (dto.getName() != null) product.setName(dto.getName());
        if (dto.getSlug() != null) product.setSlug(dto.getSlug());
        if (dto.getDescription() != null) product.setDescription(dto.getDescription());
        
        if (dto.getProviderCost() != null) product.setProviderCost(dto.getProviderCost());
        if (dto.getResellerMargin() != null) product.setResellerMargin(dto.getResellerMargin());

        if (dto.getPrice() != null) {
            product.setPrice(dto.getPrice());
        } else if (product.getProviderCost() != null && product.getResellerMargin() != null) {
            product.setPrice(product.getProviderCost().add(product.getResellerMargin()));
        }

        if (dto.getIntegrationStatus() != null) product.setIntegrationStatus(dto.getIntegrationStatus());
        if (dto.getDeploymentType() != null) product.setDeploymentType(dto.getDeploymentType());
        if (dto.getDemoUrl() != null) product.setDemoUrl(dto.getDemoUrl());
        if (dto.getDocumentationUrl() != null) product.setDocumentationUrl(dto.getDocumentationUrl());
        product.setFeatured(dto.isFeatured());

        if (dto.getStock() != null) product.setStock(dto.getStock());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getServiceType() != null) product.setServiceType(dto.getServiceType());
        product.setActive(dto.isActive());

        return mapToAdminDto(productRepository.save(product));
    }

    @Transactional
    public ProductDto toggleProductStatus(Long id, boolean active) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(active);
        return mapToAdminDto(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }

    /**
     * Public mapping: NEVER expose provider cost, reseller margins, or internal provider details
     */
    public ProductDto mapToPublicDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .providerCost(null) // STRICTLY HIDDEN FROM PUBLIC CLIENTS
                .resellerMargin(null) // STRICTLY HIDDEN FROM PUBLIC CLIENTS
                .providerId(null) // STRICTLY HIDDEN FROM PUBLIC CLIENTS
                .providerName(null) // STRICTLY HIDDEN FROM PUBLIC CLIENTS
                .integrationStatus(product.getIntegrationStatus())
                .deploymentType(product.getDeploymentType())
                .demoUrl(product.getDemoUrl())
                .documentationUrl(product.getDocumentationUrl())
                .featured(product.isFeatured())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .serviceType(product.getServiceType())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .active(product.isActive())
                .build();
    }

    /**
     * Public Product DTO Mapping: Compile-time structural guarantee of zero wholesale leakage
     */
    public com.ohotech.backend.dto.PublicProductDto mapToPublicProductDto(Product product) {
        return com.ohotech.backend.dto.PublicProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .integrationStatus(product.getIntegrationStatus())
                .deploymentType(product.getDeploymentType())
                .demoUrl(product.getDemoUrl())
                .documentationUrl(product.getDocumentationUrl())
                .featured(product.isFeatured())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .serviceType(product.getServiceType())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .active(product.isActive())
                .build();
    }

    public com.ohotech.backend.dto.PublicProductDto getPublicProductBySlug(String slug) {
        Product product = productRepository.findBySlugAndActiveTrue(slug)
                .or(() -> productRepository.findBySlug(slug))
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
        return mapToPublicProductDto(product);
    }

    /**
     * Admin mapping: Includes wholesale pricing, internal margins, and provider relationship
     */
    public ProductDto mapToAdminDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .providerCost(product.getProviderCost())
                .resellerMargin(product.getResellerMargin())
                .providerId(product.getProvider() != null ? product.getProvider().getId() : null)
                .providerName(product.getProvider() != null ? product.getProvider().getName() : null)
                .integrationStatus(product.getIntegrationStatus())
                .deploymentType(product.getDeploymentType())
                .demoUrl(product.getDemoUrl())
                .documentationUrl(product.getDocumentationUrl())
                .featured(product.isFeatured())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .serviceType(product.getServiceType())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .active(product.isActive())
                .build();
    }

    public com.ohotech.backend.dto.AdminProductDto mapToAdminProductDto(Product product) {
        return com.ohotech.backend.dto.AdminProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .providerCost(product.getProviderCost())
                .resellerMargin(product.getResellerMargin())
                .providerId(product.getProvider() != null ? product.getProvider().getId() : null)
                .providerName(product.getProvider() != null ? product.getProvider().getName() : null)
                .integrationStatus(product.getIntegrationStatus())
                .deploymentType(product.getDeploymentType())
                .demoUrl(product.getDemoUrl())
                .documentationUrl(product.getDocumentationUrl())
                .featured(product.isFeatured())
                .stock(product.getStock())
                .imageUrl(product.getImageUrl())
                .serviceType(product.getServiceType())
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .active(product.isActive())
                .build();
    }

    public ProductDto mapToDto(Product product) {
        return mapToPublicDto(product);
    }
}
