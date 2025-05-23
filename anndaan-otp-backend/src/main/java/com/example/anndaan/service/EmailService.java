package com.example.anndaan.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.otp.expiration-minutes}")
    private int otpExpirationMinutes; // To include in email

    /**
     * Sends an OTP email.
     * @param toEmail The recipient's email address.
     * @param restaurantName The name of the restaurant for personalization.
     * @param otp The One-Time Password.
     * @throws MailException if sending the email fails.
     */
    public void sendOtpEmail(String toEmail, String restaurantName, String otp) throws MailException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Ann Daan - Your OTP for Restaurant Registration");
        message.setText("Hello " + (restaurantName != null && !restaurantName.isEmpty() ? restaurantName : "User") + ",\n\n"
                + "Thank you for registering with Ann Daan.\n"
                + "Your One-Time Password (OTP) is: " + otp + "\n\n"
                + "This OTP is valid for " + otpExpirationMinutes + " minutes.\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "Regards,\nThe Ann Daan Team");
        
        mailSender.send(message);
        System.out.println("OTP email sent successfully to " + toEmail);
    }
}