package com.example.anndaan.controller;

import com.example.anndaan.dto.OtpRequest;
import com.example.anndaan.dto.VerifyOtpRequest;
import com.example.anndaan.service.EmailService;
import com.example.anndaan.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
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
        if (otpRequest.getEmail() == null || otpRequest.getEmail().trim().isEmpty() ||
            !otpRequest.getEmail().matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) { // Basic email validation
            return ResponseEntity.badRequest().body(Map.of("message", "A valid email address is required."));
        }
        if (otpRequest.getName() == null || otpRequest.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Restaurant name is required."));
        }

        String email = otpRequest.getEmail().trim();
        String name = otpRequest.getName().trim();

        // Optional: Clear any existing OTP for this email before generating a new one
        // otpService.clearOtp(email);

        String otp = otpService.generateOtp(email);
        try {
            emailService.sendOtpEmail(email, name, otp);
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to " + email));
        } catch (MailException e) {
            // Log the detailed error for server-side diagnosis
            System.err.println("Mail sending failed for " + email + ". Error: " + e.getMessage());
            // e.printStackTrace(); // Uncomment for full stack trace in logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send OTP email. This could be due to email server issues or incorrect configuration. Please contact support if the problem persists."));
        } catch (Exception e) {
            // Catch other unexpected errors
            System.err.println("Unexpected error during OTP sending for " + email + ". Error: " + e.getMessage());
            // e.printStackTrace(); // Uncomment for full stack trace in logs
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "An unexpected error occurred while sending OTP. Please try again."));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest verifyOtpRequest) {
        if (verifyOtpRequest.getEmail() == null || verifyOtpRequest.getEmail().trim().isEmpty() ||
            verifyOtpRequest.getOtp() == null || verifyOtpRequest.getOtp().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and OTP are required."));
        }

        String email = verifyOtpRequest.getEmail().trim();
        String otp = verifyOtpRequest.getOtp().trim();

        boolean isValid = otpService.validateOtp(email, otp);

        if (isValid) {
            return ResponseEntity.ok(Map.of("message", "OTP verified successfully. Registration complete."));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid or expired OTP. Please try again."));
        }
    }
}