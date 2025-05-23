import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

// Styled Components (same as provided before)
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: 'Arial', sans-serif;
  padding: 20px;
`;

const RegistrationCard = styled.div`
  background: #ffffff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
  font-size: 28px;
  font-weight: 600;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  text-align: left;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Button = styled.button`
  padding: 14px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #0056b3;
  }
  
  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: #a0cfff;
    cursor: not-allowed;
  }
`;

const Loader = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #007bff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: ${spin} 1s linear infinite;
`;

const Message = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: ${props => (props.type === 'error' ? '#dc3545' : '#28a745')};
  white-space: pre-wrap; // To show multi-line messages if backend sends them
`;

const OtpInfo = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #555;
`;

const RestaurantRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:8080/api/otp'; // Your backend URL

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (message.text) setMessage({ text: '', type: '' }); // Clear message on input change
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
    if (message.text) setMessage({ text: '', type: '' }); // Clear message on input change
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setMessage({ text: 'Restaurant name and email are required.', type: 'error' });
      return;
    }
    // Basic email format validation (optional, backend should also validate)
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setMessage({ text: 'Please enter a valid email address.', type: 'error' });
        return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.post(`${API_BASE_URL}/send`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
      });
      setMessage({ text: response.data.message, type: 'success' });
      setShowOtpInput(true);
    } catch (error) {
      console.error("Send OTP error:", error.response || error.message);
      setMessage({
        text: error.response?.data?.message || 'Failed to send OTP. Please check your connection and try again.',
        type: 'error',
      });
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim() || otp.trim().length !== 6) { // Assuming 6-digit OTP
      setMessage({ text: 'Please enter a valid 6-digit OTP.', type: 'error' });
      return;
    }
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const response = await axios.post(`${API_BASE_URL}/verify`, {
        email: formData.email.trim(), // Send the same email used for sending OTP
        otp: otp.trim(),
      });
      setMessage({ text: response.data.message, type: 'success' });
      
      localStorage.setItem('user', JSON.stringify({ email: formData.email.trim(), name: formData.name.trim(), role: 'RESTAURANT' }));
      localStorage.setItem('token', 'otp-verified-restaurant'); 

      setTimeout(() => {
        navigate('/restaurant-dashboard');
      }, 1500);
    } catch (error) {
      console.error("Verify OTP error:", error.response || error.message);
      setMessage({
        text: error.response?.data?.message || 'OTP verification failed. Please try again.',
        type: 'error',
      });
    }
    setIsLoading(false);
  };

  return (
    <PageContainer>
      <RegistrationCard>
        {!showOtpInput ? (
          <>
            <Title>Restaurant Registration</Title>
            <Subtitle>Let's get your restaurant on board!</Subtitle>
            <Form onSubmit={handleSendOtp}>
              <InputGroup>
                <Label htmlFor="name">Restaurant Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your restaurant's name"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </InputGroup>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader />}
                Send OTP
              </Button>
            </Form>
          </>
        ) : (
          <>
            <Title>Verify Your Email</Title>
            <Subtitle>An OTP has been sent to {formData.email}</Subtitle>
            <Form onSubmit={handleVerifyOtp}>
              <InputGroup>
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  type="text"
                  name="otp"
                  id="otp"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter 6-digit OTP"
                  maxLength="6"
                  pattern="\d{6}" // Ensures 6 digits
                  title="OTP must be 6 digits"
                  required
                />
              </InputGroup>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader />}
                Verify OTP & Register
              </Button>
            </Form>
            <OtpInfo>
              Didn't receive OTP?{' '}
              <a 
                href="#" 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setShowOtpInput(false); 
                  setMessage({text:'', type:''}); 
                  setOtp('');
                }} 
                style={{ color: '#007bff', textDecoration: 'none' }}
              >
                Resend OTP or change email
              </a>
            </OtpInfo>
          </>
        )}
        {message.text && <Message type={message.type}>{message.text}</Message>}
      </RegistrationCard>
    </PageContainer>
  );
};

export default RestaurantRegistration;