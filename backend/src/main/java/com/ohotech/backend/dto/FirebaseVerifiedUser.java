package com.ohotech.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FirebaseVerifiedUser {
    private String uid;
    private String email;
    private boolean emailVerified;
    private String phone;
    private String name;
    private String picture;
}
