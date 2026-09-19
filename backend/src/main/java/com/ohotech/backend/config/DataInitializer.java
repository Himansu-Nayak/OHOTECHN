package com.ohotech.backend.config;

import com.ohotech.backend.entity.Category;
import com.ohotech.backend.entity.Product;
import com.ohotech.backend.entity.Role;
import com.ohotech.backend.entity.User;
import com.ohotech.backend.repository.CategoryRepository;
import com.ohotech.backend.repository.ProductRepository;
import com.ohotech.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.jdbc.core.JdbcTemplate;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS failed_login_attempts INT DEFAULT 0");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS lockout_until TIMESTAMP");
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255) UNIQUE");
            jdbcTemplate.execute("ALTER TABLE audit_logs ALTER COLUMN description TYPE VARCHAR(2000) USING description::text");
            jdbcTemplate.execute("ALTER TABLE audit_logs ALTER COLUMN previous_value TYPE VARCHAR(2000) USING previous_value::text");
            jdbcTemplate.execute("ALTER TABLE audit_logs ALTER COLUMN new_value TYPE VARCHAR(2000) USING new_value::text");
            // Ensure all admin and developer accounts are email verified so they can log in directly without OTP
            jdbcTemplate.execute("UPDATE users SET email_verified = true WHERE role IN ('ROLE_ADMIN', 'ROLE_DEVELOPER', 'ADMIN', 'DEVELOPER')");

            // Seed/Synchronize admin & developer passwords for direct development access
            String standardDevPass = "Admin@12345";
            String encodedPass = passwordEncoder.encode(standardDevPass);

            userRepository.findByEmail("admin@ohotechn.com").ifPresent(admin -> {
                admin.setPasswordHash(encodedPass);
                admin.setEmailVerified(true);
                admin.setEnabled(true);
                admin.setFailedLoginAttempts(0);
                admin.setLockoutUntil(null);
                userRepository.save(admin);
                log.info("Synchronized password for admin@ohotechn.com to {}", standardDevPass);
            });

            userRepository.findByEmail("himansu@ohotechn.com").ifPresent(dev -> {
                dev.setPasswordHash(encodedPass);
                dev.setEmailVerified(true);
                dev.setEnabled(true);
                dev.setFailedLoginAttempts(0);
                dev.setLockoutUntil(null);
                userRepository.save(dev);
                log.info("Synchronized password for himansu@ohotechn.com to {}", standardDevPass);
            });

            if (userRepository.findByEmail("admin@ohotech.com").isEmpty()) {
                User adminAlt = User.builder()
                        .name("System Admin")
                        .email("admin@ohotech.com")
                        .passwordHash(encodedPass)
                        .role(Role.ROLE_ADMIN)
                        .emailVerified(true)
                        .phoneVerified(true)
                        .enabled(true)
                        .failedLoginAttempts(0)
                        .build();
                userRepository.save(adminAlt);
                log.info("Created admin@ohotech.com with password {}", standardDevPass);
            } else {
                userRepository.findByEmail("admin@ohotech.com").ifPresent(alt -> {
                    alt.setPasswordHash(encodedPass);
                    alt.setEmailVerified(true);
                    alt.setEnabled(true);
                    alt.setRole(Role.ROLE_ADMIN);
                    alt.setFailedLoginAttempts(0);
                    alt.setLockoutUntil(null);
                    userRepository.save(alt);
                });
            }

            // Initialize AI Platform Tables if not exists
            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS ai_conversations (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT,
                    session_id VARCHAR(255),
                    title VARCHAR(255) NOT NULL,
                    feature VARCHAR(64) NOT NULL,
                    created_at TIMESTAMP,
                    updated_at TIMESTAMP,
                    CONSTRAINT fk_ai_conv_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
                )
            """);

            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS ai_messages (
                    id BIGSERIAL PRIMARY KEY,
                    conversation_id BIGINT NOT NULL,
                    role VARCHAR(32) NOT NULL,
                    content TEXT NOT NULL,
                    metadata TEXT,
                    created_at TIMESTAMP,
                    CONSTRAINT fk_ai_msg_conv FOREIGN KEY (conversation_id) REFERENCES ai_conversations(id) ON DELETE CASCADE
                )
            """);

            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS ai_usage (
                    id BIGSERIAL PRIMARY KEY,
                    user_id BIGINT,
                    feature VARCHAR(64) NOT NULL,
                    model VARCHAR(64) NOT NULL,
                    prompt_tokens INT,
                    candidate_tokens INT,
                    total_tokens INT,
                    timestamp TIMESTAMP
                )
            """);

            jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS product_embeddings (
                    id BIGSERIAL PRIMARY KEY,
                    product_id BIGINT NOT NULL UNIQUE,
                    product_name VARCHAR(255) NOT NULL,
                    content_text TEXT NOT NULL,
                    embedding_json TEXT NOT NULL,
                    updated_at TIMESTAMP
                )
            """);
        } catch (Exception e) {
            log.warn("Schema initialization warning: {}", e.getMessage());
        }

        if (productRepository.count() > 0) {
            log.info("Database already contains {} products. Skipping auto-seeding.", productRepository.count());
            return;
        }

        log.info("Seeding initial categories and 28 turnkey software products into database...");

        // 1. Create Categories
        Category edu = getOrCreateCategory("Education", "Software solutions for schools, colleges, and training institutes.");
        Category health = getOrCreateCategory("Healthcare", "Digital health solutions for hospitals, clinics, labs, and pharmacies.");
        Category erp = getOrCreateCategory("ERP & HR", "Enterprise resource planning, CRM, and payroll software.");
        Category retail = getOrCreateCategory("Retail & POS", "Point of Sale, inventory, and multi-store billing systems.");
        Category ecom = getOrCreateCategory("E-Commerce", "Custom online storefronts, marketplaces, and delivery portals.");
        Category serviceCat = getOrCreateCategory("Services & Booking", "Appointment scheduling, real estate, and service CRM.");

        // 2. Seed 28 Turnkey Software Products
        List<Product> seedProducts = Arrays.asList(
            // Education
            createProd("School Management Software", "Complete school administration, attendance, fees, and parent communication portal.", new BigDecimal("35000"), edu, "Software"),
            createProd("College ERP", "End-to-end college management with admissions, exams, and placement modules.", new BigDecimal("65000"), edu, "Software"),
            createProd("University Management System", "Multi-campus university operations, research, and accreditation tracking.", new BigDecimal("99000"), edu, "Software"),
            createProd("Coaching Institute Management", "Batch management, fee tracking, and performance analytics for coaching centres.", new BigDecimal("25000"), edu, "Software"),
            createProd("Learning Management System (LMS)", "Online courses, interactive e-Learning content, assessments, and certifications.", new BigDecimal("45000"), edu, "Software"),

            // Healthcare
            createProd("Hospital Management Software", "OPD/IPD, EMR, billing, pharmacy, and lab integration for hospitals.", new BigDecimal("75000"), health, "Software"),
            createProd("IVF & Fertility Clinic Software", "IVF cycle tracking, embryology lab management, follicle monitoring, and fertility EMR.", new BigDecimal("85000"), health, "Software"),
            createProd("Clinic Management Software", "Appointment scheduling, patient records, and billing for specialty clinics.", new BigDecimal("29000"), health, "Software"),
            createProd("Pathology Lab Management", "Sample collection, test reporting, barcode integration, and patient portal.", new BigDecimal("39000"), health, "Software"),
            createProd("Pharmacy Software", "Batch inventory, expiry alerts, GST billing, and supplier PO management.", new BigDecimal("25000"), health, "Software"),

            // ERP & HR
            createProd("Enterprise HRMS & Payroll", "Attendance, biometric sync, leave workflows, salary slips, and tax compliance.", new BigDecimal("55000"), erp, "Software"),
            createProd("Custom Business CRM", "Lead management, sales pipeline, automated WhatsApp & email triggers.", new BigDecimal("45000"), erp, "Software"),
            createProd("Supply Chain & Logistics ERP", "Fleet tracking, warehouse inventory, dispatch routing, and vendor portals.", new BigDecimal("89000"), erp, "Software"),
            createProd("Microfinance & Loan Management", "Loan origination, EMI schedule tracking, penalty calculation, and collector app.", new BigDecimal("69000"), erp, "Software"),

            // Retail & POS
            createProd("Retail POS & Billing Software", "Fast barcode billing, inventory management, multi-store stock sync, and GST invoices.", new BigDecimal("29000"), retail, "Software"),
            createProd("Supermarket Grocery ERP", "Weight scale integration, offer management, stock auditing, and supplier ledger.", new BigDecimal("49000"), retail, "Software"),
            createProd("Garments & Apparel Billing", "Size/color variant matrix, barcode generation, seasonal discounts, and sales reports.", new BigDecimal("35000"), retail, "Software"),
            createProd("Jewellery Store ERP", "Gold/silver weight calculation, stone billing, making charge matrix, and customer scheme tracking.", new BigDecimal("79000"), retail, "Software"),

            // E-Commerce
            createProd("Multi-Vendor E-Commerce Portal", "Custom marketplace platform, vendor payout engine, product catalog, and payment gateway.", new BigDecimal("75000"), ecom, "Software"),
            createProd("D2C Brand Storefront", "Next.js high-speed storefront, cart optimization, Razorpay/Stripe integration, and order tracking.", new BigDecimal("45000"), ecom, "Software"),
            createProd("Food Delivery & Restaurant App", "Customer ordering app, driver tracking, kitchen display system (KDS), and POS.", new BigDecimal("65000"), ecom, "Software"),
            createProd("On-Demand Service Booking App", "Service professional marketplace, geofenced job allocation, and instant payment settlement.", new BigDecimal("70000"), ecom, "Software"),

            // Services & Booking
            createProd("Real Estate CRM & Booking Engine", "Property listing portal, lead allocation, site visit scheduling, and buyer agreements.", new BigDecimal("59000"), serviceCat, "Software"),
            createProd("Gym & Fitness Club Software", "Member attendance, biometric integration, subscription renewal alerts, and trainer schedule.", new BigDecimal("22000"), serviceCat, "Software"),
            createProd("Dental Clinic Software", "Dental chart recording, appointment calendar, treatment plan billing, and SMS reminders.", new BigDecimal("28000"), serviceCat, "Software"),
            createProd("Hotel & Resort Booking Engine", "Room availability grid, channel manager sync, guest check-in/out, and F&B billing.", new BigDecimal("65000"), serviceCat, "Software"),
            createProd("Car Rental & Fleet Management", "Vehicle availability calendar, GPS integration, security deposit tracking, and agreement printer.", new BigDecimal("52000"), serviceCat, "Software"),
            createProd("Event & Ticket Booking Portal", "Seat layout selection, QR ticket generation, gate scanner app, and organizer payout.", new BigDecimal("48000"), serviceCat, "Software")
        );

        productRepository.saveAll(seedProducts);
        log.info("Successfully seeded {} turnkey software products into database!", seedProducts.size());
    }

    private Category getOrCreateCategory(String name, String description) {
        return categoryRepository.findByName(name).orElseGet(() -> {
            Category cat = Category.builder()
                    .name(name)
                    .description(description)
                    .build();
            return categoryRepository.save(cat);
        });
    }

    private Product createProd(String name, String description, BigDecimal price, Category category, String serviceType) {
        return Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .category(category)
                .serviceType(serviceType)
                .stock(100)
                .active(true)
                .imageUrl("/OHO_TECH_LOGO.png")
                .build();
    }
}
