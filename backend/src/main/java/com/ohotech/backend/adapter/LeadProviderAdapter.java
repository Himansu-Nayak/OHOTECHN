package com.ohotech.backend.adapter;

import com.ohotech.backend.dto.NormalizedLeadInput;

import java.util.Map;

public interface LeadProviderAdapter {

    boolean supports(String providerName);

    boolean verifySignature(String payload, String signatureHeader, String secret);

    NormalizedLeadInput parseAndNormalize(String payload, Map<String, String> headers);
}
