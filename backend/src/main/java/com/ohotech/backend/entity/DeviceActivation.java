package com.ohotech.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "device_activations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceActivation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "license_id", nullable = false)
    @JsonIgnore
    private License license;

    @Column(nullable = false)
    private String deviceIdentifier;

    private String deviceName;
    private String operatingSystem;
    private String applicationVersion;

    private LocalDateTime activatedAt;
    private LocalDateTime lastSeenAt;

    @Builder.Default
    private boolean active = true;

    @PrePersist
    protected void onCreate() {
        activatedAt = LocalDateTime.now();
        lastSeenAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        lastSeenAt = LocalDateTime.now();
    }
}
