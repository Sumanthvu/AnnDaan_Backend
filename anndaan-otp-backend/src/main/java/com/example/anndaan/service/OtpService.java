package com.example.anndaan.service;

import com.example.anndaan.dto.OtpData;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
public class OtpService {

    private final Map<String, OtpData> otpCache = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    @Value("${app.otp.expiration-minutes}")
    private int otpExpirationMinutes;

    public String generateOtp(String email) {
        String otp = String.format("%06d", random.nextInt(999999));
        otpCache.put(email, new OtpData(otp));
        return otp;
    }

    public boolean validateOtp(String email, String otpToValidate) {
        OtpData storedOtpData = otpCache.get(email);

        if (storedOtpData == null) {
            return false; // OTP not found or already used/expired
        }

        long currentTime = System.currentTimeMillis();
        long otpTimestamp = storedOtpData.getTimestamp();

        if (TimeUnit.MILLISECONDS.toMinutes(currentTime - otpTimestamp) >= otpExpirationMinutes) {
            otpCache.remove(email); // OTP expired
            return false;
        }

        if (storedOtpData.getOtp().equals(otpToValidate)) {
            otpCache.remove(email); // OTP is correct, remove it after validation
            return true;
        }

        return false; // OTP is incorrect
    }

    public void clearOtp(String email) {
        otpCache.remove(email);
    }
}