package com.example.anndaan.dto;

import lombok.Getter;

@Getter
public class OtpData {
    private final String otp;
    private final long timestamp;

    public OtpData(String otp) {
        this.otp = otp;
        this.timestamp = System.currentTimeMillis();
    }
}