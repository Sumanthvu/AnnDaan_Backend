import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'; // Added Link
import './App.css';
import RestaurantRegistration from './components/RestaurantRegistration';
import RestaurantDashboard from './components/RestaurantDashboard'; // Make sure this path is correct

// ProtectedRoute Component (Essential for guarding dashboard access)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // Check for a specific token and that user role is RESTAURANT
  if (token === 'otp-verified-restaurant' && user && user.role === 'RESTAURANT') {
    return children;
  }
  return <Navigate to="/restaurant-registration" replace />;
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/restaurant-registration" element={<RestaurantRegistration />} />
        <Route 
          path="/restaurant-dashboard" 
          element={
            <ProtectedRoute>
              <RestaurantDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes>
    </Router>
  );
}

// MainContent and its sub-components (Header, SliderSection, etc.)
// are assumed to be the same as you provided.
// Key change: In VolunteerSection, use <Link> or navigate for SPA behavior.

function MainContent() {
  const [slideIndex, setSlideIndex] = useState(1);

  const showSlides = (n) => {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    if (!slides || slides.length === 0) return;
    
    let newIndex = n;
    if (n > slides.length) newIndex = 1;
    if (n < 1) newIndex = slides.length;
    
    for (i = 0; i < slides.length; i++) {
      if (slides[i] && slides[i].style) {
         slides[i].style.display = "none";
      }
    }
    
    if (slides[newIndex - 1] && slides[newIndex - 1].style) {
        slides[newIndex - 1].style.display = "block";
    }
    setSlideIndex(newIndex);
  };

  const plusSlides = (n) => {
    showSlides(slideIndex + n);
  };

  useEffect(() => {
    // Only run slider logic if slides are present on the page
    const slides = document.getElementsByClassName("mySlides");
    if (slides && slides.length > 0) {
        showSlides(slideIndex); // Initial call
        const interval = setInterval(() => {
            if (document.getElementsByClassName("mySlides").length > 0) { // Re-check inside interval
                plusSlides(1);
            }
        }, 5000);
        return () => clearInterval(interval);
    }
  }, [slideIndex]); 

  return (
    <div className="App">
      <Header />
      <SliderSection plusSlides={plusSlides} />
      <WelcomeSection />
      <MissionSection />
      <TestimonialsSection />
      <ContributeSection />
      <VolunteerSection />
      <HowItWorksSection />
      <TeamSection />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header>
      <div className="header-content">
        <div className="logo">
          <img src="/src/assets/img/Logo.png" alt="Ann Daan Logo" />
          <h1>Ann Daan</h1>
        </div>
        <nav>
          <ul>
            <li><a href="#one">Home</a></li>
            <li><a href="#contribute">Contribute</a></li>
            <li><a href="#get-help" onClick={(e)=>{e.preventDefault(); document.getElementById('get-help-anchor')?.scrollIntoView({ behavior: 'smooth' });}}>Get Help</a></li>
            <li><a href="#how-it-works">Services</a></li>
            <li><a href="#mission">About Us</a></li>
            <li><a href="#contact" onClick={(e)=>{e.preventDefault(); document.getElementById('contact-anchor')?.scrollIntoView({ behavior: 'smooth' });}}>Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function SliderSection({ plusSlides }) {
  return (
    <section className="slider-container">
      <div className="slider">
        <div className="mySlides fade">
          <div className="numbertext">1 / 4</div>
          <div className="img-container">
            <img src="/src/assets/img/img1.jpg" alt="Slide 1" />
          </div>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">2 / 4</div>
          <div className="img-container">
            <img src="/src/assets/img/img2.jpg" alt="Slide 2" />
          </div>
        </div>

        <div className="mySlides fade">
          <div className="numbertext">3 / 4</div>
          <div className="img-container">
            <img src="/src/assets/img/img3.jpg" alt="Slide 3" />
          </div>
        </div>
        
        <div className="mySlides fade">
          <div className="numbertext">4 / 4</div>
          <div className="img-container">
            <img src="/src/assets/img/img4.jpg" alt="Slide 4" />
          </div>
        </div>
        
        <a className="prev" onClick={() => plusSlides(-1)}>❮</a>
        <a className="next" onClick={() => plusSlides(1)}>❯</a>
      </div>
    </section>
  );
}

function WelcomeSection() {
  return (
    <div id="one" style={{ marginTop: "25%" }}> {/* This large margin might be an issue if slider isn't tall enough */}
      <h1>Welcome to Ann Daan</h1>
    </div>
  );
}

function MissionSection() {
  return (
    <section id="mission" className="section">
      <div className="container">
        <h2>Our Mission</h2>
        <div className="mission-content">
          <div className="mission-text" id="min">
            <p>At Ann Daan, we believe that no one should go hungry while good food goes to waste. Our mission is to create a sustainable and efficient food donation ecosystem that connects surplus food with those in need, fostering a sense of community and social responsibility.</p>
          </div>

          <div className="mission-stats">
            <div className="stat-item">
              <span className="number">1M+</span>
              <span className="label">Meals Served</span>
            </div>
            <div className="stat-item">
              <span className="number">50K+</span>
              <span className="label">Lives Impacted</span>
            </div>
            <div className="stat-item">
              <span className="number">69+</span>
              <span className="label">Cities Covered</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <h2>What People Say</h2>
        <div className="testimonial-grid">
          <div className="testimonial fade-in">
            <p className="testimonial-content">"Ann Daan has made a huge difference in our community. Their dedication to fighting hunger is inspiring."</p>
            <p className="testimonial-author">- Varun Shinde, Local Resident</p>
          </div>
          <div className="testimonial fade-in">
            <p className="testimonial-content">"As a restaurant owner, I'm grateful for the opportunity to donate our surplus food and make a positive impact."</p>
            <p className="testimonial-author">- Virat Sharma, Restaurant Owner</p>
          </div>
          <div className="testimonial fade-in">
            <p className="testimonial-content">"The volunteers at Ann Daan are amazing. Their kindness and hard work truly make a difference."</p>
            <p className="testimonial-author">- John Doe, Volunteer</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContributeSection() {
  const handleDonateClick = () => {
    window.open('https://food-don.vercel.app/donate', '_blank', 'noopener,noreferrer');
  };

  const handleGetHelpClick = () => {
    window.open('https://food-don.vercel.app/get-food', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="contribute" id="contribute">
      <div className="container2">
        <h2 id="animationid">Contribute</h2>
        <div className="content-box">
          <img src="/src/api/i1.jpeg" id="imgid1" alt="Donate Food" />
        </div>
        <a onClick={handleDonateClick} className="btn" style={{ cursor: 'pointer' }}>Donate</a>
      </div>
      <div id="get-help-anchor" className="container1"> {/* Added anchor for "Get Help" link */}
        <h2 id="animationid">Get Help!</h2>
        <div className="content-box">
          <img src="/src/api/i2.jpeg" id="imgid1" alt="Get Food Help" />
        </div>
        <a onClick={handleGetHelpClick} className="btn" style={{ cursor: 'pointer' }}>Get Help</a>
      </div>
    </section>
  );
}

function VolunteerSection() {
  // Using Link for internal navigation
  const handleVolunteerClick = () => {
    window.open('https://food-don.vercel.app/volunteer', '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="contribute">
      <div className="container2">
        <h2 id="animationid">Restaurants</h2>
        <div className="content-box">
          <img src="/src/api/i3.jpeg" id="imgid1" alt="Restaurant Registration" />
        </div>
        {/* Use Link component for SPA navigation */}
        <Link to="/restaurant-registration" className="btn" style={{ cursor: 'pointer', textDecoration: 'none' }}>Register</Link>
      </div>
      <div className="container2">
        <h2 id="animationid">Volunteer!</h2>
        <div className="content-box">
          <img src="/src/api/i4.jpg" id="imgid1" alt="Volunteer Registration" />
        </div>
        <a onClick={handleVolunteerClick} className="btn" style={{ cursor: 'pointer' }}>Register</a>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <h2>How It Works</h2>
        <div style={{ margin: "50px", gap: "55px" }} className="how-it-works">
          <div className="step slide-in-left">
            <img src="/src/assets/img/Donate.png" alt="Donate Food" />
            <h3>Food is Donated</h3>
            <p>Generous donations of surplus and fresh food from local businesses, farmers, and community members.</p>
          </div>
          <div className="step fade-in">
            <img src="/src/assets/img/Secure.png" alt="Secure Food" />
            <h3>Food is Secured</h3>
            <p>Food is secured through our network of generous donors and partners, ensuring it reaches those in need.</p>
          </div>
          <div className="step slide-in-right">
            <img src="/src/assets/img/Pick.png" alt="Pick Up Food" />
            <h3>Food is Picked Up</h3>
            <p>Our team ensures that every donation is picked up promptly and delivered safely to those who need it most.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamSection() { 
  const teamMembers = [
    { name: "Vaidik Saxena", id: "LCS2024016", image: "/src/assets/img/1.jpeg" },
    { name: "Sumanth V U", id: "LIT2024058", image: "/src/assets/img/2.jpeg" },
    { name: "Mozammil Ali", id: "LCS2024035", image: "/src/assets/img/3.jpeg" },
    { name: "Chowdam Tanmai", id: "LCS2024016", image: "/src/assets/img/4.jpeg" },
    { name: "Sandesh Raj", id: "LCS2024004", image: "/src/assets/img/5.jpeg" },
    { name: "Vansh Tomar", id: "LCS2024043", image: "/src/assets/img/6.jpeg" },
    { name: "Gubba Pavani", id: "LIT2024035", image: "/src/assets/img/7.jpeg" },
    { name: "Shaik Meer G S", id: "LCS2024025", image: "/src/assets/img/8.jpeg" }
  ];


  return (
    <section id="about-us" className="section about-us"> {/* This ID is also used for Mission, consider renaming if they are distinct */}
      <div className="container">
        <h2><strong>Our Team</strong></h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div id="check" key={index}> {/* `id` should be unique, use `className` if styling multiple elements */}
              <div className="team-member">
                <img src={member.image} alt={`Team Member ${index + 1}`} />
              </div>
              <p className="pid-name" style={{ color: "black" }}><strong>{member.name}</strong></p> {/* Changed id to className */}
              <p className="pid-id">{member.id}</p> {/* Changed id to className */}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact-anchor"> {/* Added anchor for "Contact" link */}
      <div className="container footer-content">
        <div className="footer-main">
          <div className="footer-section branding">
            <div style={{ marginLeft: "18%" }}>
              <img src="/src/assets/img/Logo.png" alt="Ann Daan Logo" className="footer-logo" />
              <h3>Ann Daan</h3>
            </div>
            <p>Fighting hunger, reducing waste, building community.</p>
          </div>

          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="#one">Home</a></li>
              <li><a href="#mission">About Us</a></li>
              <li><a href="#contribute">Food Donors</a></li>
              <li><a href="#contribute">Volunteers</a></li>
              {/* Removed #charities as no section */}
              <li><a href="#about-us">Our Team</a></li>
              {/* Removed #faqs as no section */}
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <address>
              <p><i className="fa-solid fa-location-dot"></i> IIITL, Chakganjaraia,<br />C.G. City Lucknow, 226002</p>
              <p><i className="fa-solid fa-phone"></i> +91123467899</p>
              <p><i className="fa-solid fa-envelope"></i> <a href="mailto:annadaan@gmail.com" style={{color: "inherit", textDecoration:"none"}}>annadaan@gmail.com</a></p>
            </address>
          </div>

          <div className="footer-section newsletter">
            <h3>Join Our Newsletter</h3>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn-subscribe">Subscribe</button>
            </form>
            <div className="social-media">
              {/* Social media icons could go here */}
            </div>
          </div>
        </div>
      </div>

      <div className="donate-banner">
        <p>Help us make a difference today</p>
        <a href="#contribute" className="btn-donate">DONATE NOW</a>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 Ann Daan. All rights reserved.</p>
          <ul className="footer-policies">
             {/* Placeholder links - create actual pages or sections */}
            <li><a href="#privacy-policy">Privacy Policy</a></li>
            <li><a href="#terms-of-service">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default App;