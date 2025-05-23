package com.example.anndaan.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String restaurantName, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Ann Daan - Your OTP for Restaurant Registration");
            message.setText("Hello " + restaurantName + ",\n\n"
                    + "Thank you for registering with Ann Daan.\n"
                    + "Your One-Time Password (OTP) is: " + otp + "\n\n"
                    + "This OTP is valid for 5 minutes.\n\n"
                    + "If you did not request this, please ignore this email.\n\n"
                    + "Regards,\nThe Ann Daan Team");
            mailSender.send(message);
            System.out.println("OTP email sent successfully to " + toEmail);
        } catch (Exception e) {
            System.err.println("Error sending OTP email to " + toEmail + ": " + e.getMessage());
            // Consider a more robust error handling/logging strategy for production
        }
    }
}