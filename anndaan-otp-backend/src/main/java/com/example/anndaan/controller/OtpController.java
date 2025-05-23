package com.example.anndaan.controller;

import com.example.anndaan.dto.OtpRequest;
import com.example.anndaan.dto.VerifyOtpRequest;
import com.example.anndaan.service.EmailService;
import com.example.anndaan.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequest otpRequest) {
        if (otpRequest.getEmail() == null || otpRequest.getEmail().isEmpty() ||
            otpRequest.getName() == null || otpRequest.getName().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and Name are required."));
        }

        // Optional: Clear any existing OTP for this email before generating a new one
        // otpService.clearOtp(otpRequest.getEmail());

        String otp = otpService.generateOtp(otpRequest.getEmail());
        try {
            emailService.sendOtpEmail(otpRequest.getEmail(), otpRequest.getName(), otp);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + otpRequest.getEmail()));
        } catch (Exception e) {
            // Log the exception e
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send OTP. Please try again."));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        if (verifyOtpRequest.getEmail() == null || verifyOtpRequest.getEmail().isEmpty() ||
            verifyOtpRequest.getOtp() == null || verifyOtpRequest.getOtp().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required."));
        }

        boolean isValid = otpService.validateOtp(verifyOtpRequest.getEmail(), verifyOtpRequest.getOtp());

        if (isValid) {
            // In a real app, you might create a user session or JWT token here
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully. Registration complete."));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired OTP."));
        }
    }
}