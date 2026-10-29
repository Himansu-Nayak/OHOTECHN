package com.ohotech.backend.service;

import org.springframework.stereotype.Component;

/**
 * Normalizes phone numbers to standard E.164 format and formats them for Meta WhatsApp Cloud API dispatches.
 */
@Component
public class WhatsAppPhoneNormalizer {

    /**
     * Normalizes a phone string into E.164 format (e.g., +917684054872).
     */
    public String normalizeToE164(String rawPhone) {
        if (rawPhone == null || rawPhone.isBlank()) {
            throw new IllegalArgumentException("Phone number cannot be null or empty");
        }

        String cleaned = rawPhone.trim().replaceAll("[\\s\\-\\(\\)]", "");

        if (cleaned.startsWith("+")) {
            String digits = cleaned.substring(1);
            if (!digits.matches("\\d{7,15}")) {
                throw new IllegalArgumentException("Invalid international phone number format: " + rawPhone);
            }
            return "+" + digits;
        }

        // If 10 digits starting with 6, 7, 8, or 9 (Standard Indian mobile)
        if (cleaned.matches("[6-9]\\d{9}")) {
            return "+91" + cleaned;
        }

        // If 11 digits starting with 0 followed by 6-9 (Domestic STD prefixed Indian mobile)
        if (cleaned.matches("0[6-9]\\d{9}")) {
            return "+91" + cleaned.substring(1);
        }

        // If 12 digits starting with 91 (India with country code, without +)
        if (cleaned.matches("91[6-9]\\d{9}")) {
            return "+" + cleaned;
        }

        // Generic fallback for digits
        if (cleaned.matches("\\d{7,15}")) {
            return "+" + cleaned;
        }

        throw new IllegalArgumentException("Unable to normalize phone number to E.164 format: " + rawPhone);
    }

    /**
     * Formats normalized phone for Meta WhatsApp Cloud API (numeric digits only, no + prefix).
     * e.g., +917684054872 -> 917684054872
     */
    public String toMetaRecipient(String rawOrNormalizedPhone) {
        String e164 = normalizeToE164(rawOrNormalizedPhone);
        return e164.startsWith("+") ? e164.substring(1) : e164;
    }
}
