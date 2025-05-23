package com.example.anndaan.dto;

import lombok.Data;

@Data
public class VerifyOtpRequest {
    private String email;
    private String otp;
}