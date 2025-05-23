import React, { useState, useEffect } from 'react'; // Added React import
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // Added Navigate, useNavigate
import './App.css';
import RestaurantRegistration from './components/RestaurantRegistration';
import RestaurantDashboard from './components/RestaurantDashboard'; // Import Dashboard

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // This is a very basic check for the OTP flow.
  // For a real app, you'd validate the token's authenticity and expiration.
  if (token === 'otp-verified-restaurant') {
    return children;
  }
  // If no valid token, redirect to restaurant registration or a general login page.
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
        {/* Add a fallback route if needed, e.g., for 404 */}
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes>
    </Router>
  );
}

function MainContent() {
  const [slideIndex, setSlideIndex] = useState(1);

  const showSlides = (n) => {
    let i;
    const slides = document.getElementsByClassName("mySlides");
    if (!slides || slides.length === 0) return; // Added check for slides existence
    
    let newIndex = n;
    if (n > slides.length) newIndex = 1;
    if (n < 1) newIndex = slides.length;
    
    for (i = 0; i < slides.length; i++) {
      if (slides[i] && slides[i].style) { // Check if slide and style exist
         slides[i].style.display = "none";
      }
    }
    
    if (slides[newIndex - 1] && slides[newIndex - 1].style) { // Check if slide and style exist
        slides[newIndex - 1].style.display = "block";
    }
    setSlideIndex(newIndex);
  };

  const plusSlides = (n) => {
    showSlides(slideIndex + n);
  };

  useEffect(() => {
    showSlides(slideIndex); // Initial call
    
    const interval = setInterval(() => {
      // Check if slides are still present (e.g., component is mounted)
      if (document.getElementsByClassName("mySlides").length > 0) {
        plusSlides(1);
      }
    }, 5000);
    
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [slideIndex]); // Rerun effect if slideIndex changes

  return (
    <div className="App">
      <Header />
      <SliderSection plusSlides={plusSlides} />
      <WelcomeSection />
      <MissionSection />
      <TestimonialsSection />
      <ContributeSection />
      <VolunteerSection /> {/* Updated this component below */}
      <HowItWorksSection />
      <TeamSection />
      <Footer />
    </div>
  );
}

function Header() {
  // Using Link for SPA navigation for internal links if desired, or keep as href for section jumps
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
            {/* <li><a href="#get-help">Get Help</a></li> Link from contribute section */}
            <li><a href="#how-it-works">Services</a></li> {/* Assuming services links to how-it-works */}
            <li><a href="#mission">About Us</a></li> {/* Assuming about-us links to mission */}
            <li><a href="#contact" onClick={(e) => { e.preventDefault(); document.querySelector('footer .contact').scrollIntoView({ behavior: 'smooth' }); }}>Contact</a></li>
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
    <div id="one" style={{ marginTop: "25%" }}> {/* Consider reducing this margin if slider isn't that tall */}
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
    window.open('https://food-don.vercel.app/donate', '_blank'); // Open in new tab
  };

  const handleGetHelpClick = () => {
    window.open('https://food-don.vercel.app/get-food', '_blank'); // Open in new tab
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
      <div className="container1">
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
  const navigate = useNavigate(); // Use useNavigate hook

  const handleRestaurantClick = (e) => {
    e.preventDefault();
    navigate('/restaurant-registration'); // Use navigate for SPA navigation
  };

  const handleVolunteerClick = () => {
    window.open('https://food-don.vercel.app/volunteer', '_blank'); // Open in new tab
  };

  return (
    <section className="contribute"> {/* Consider renaming class if not purely for contribution */}
      <div className="container2">
        <h2 id="animationid">Restaurants</h2>
        <div className="content-box">
          <img src="/src/api/i3.jpeg" id="imgid1" alt="Restaurant Registration" />
        </div>
        <a onClick={handleRestaurantClick} className="btn" style={{ cursor: 'pointer' }}>Register</a>
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
    <section id="about-us" className="section about-us">
      <div className="container">
        <h2><strong>Our Team</strong></h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div id="check" key={index}>
              <div className="team-member">
                <img src={member.image} alt={`Team Member ${index + 1}`} />
              </div>
              <p id="pid" style={{ color: "black" }}><strong>{member.name}</strong></p>
              <p id="pid">{member.id}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact"> {/* Added id for contact link */}
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
              <li><a href="#mission">About Us</a></li> {/* Corrected link to match section ID */}
              <li><a href="#contribute">Food Donors</a></li> {/* Pointing to contribute */}
              <li><a href="#contribute">Volunteers</a></li> {/* Pointing to contribute */}
              {/* <li><a href="#charities">Charities</a></li> No specific section for charities */}
              <li><a href="#about-us">Our Team</a></li> {/* Pointing to team section */}
              {/* <li><a href="#faqs">FAQs</a></li> No specific FAQ section */}
            </ul>
          </div>

          <div className="footer-section contact">
            <h3>Contact Us</h3>
            <address>
              <p><i className="fa-solid fa-location-dot"></i> IIITL, Chakganjaraia,<br />C.G. City Lucknow, 226002</p>
              <p><i className="fa-solid fa-phone"></i> +91123467899</p>
              <p><i className="fa-solid fa-envelope"></i> <a href="mailto:annadaan@gmail.com" style={{color: "inherit", textDecoration: "none"}}>annadaan@gmail.com</a></p> {/* Added icon and style */}
            </address>
          </div>

          <div className="footer-section newsletter">
            <h3>Join Our Newsletter</h3>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit" className="btn-subscribe">Subscribe</button>
            </form>
            <div className="social-media">
              {/* Social media icons could go here e.g.
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a> 
              */}
            </div>
          </div>
        </div>
      </div>

      <div className="donate-banner">
        <p>Help us make a difference today</p>
        <a href="#contribute" className="btn-donate">DONATE NOW</a> {/* Changed to #contribute section */}
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© 2024 Ann Daan. All rights reserved.</p>
          <ul className="footer-policies">
             {/* You would create actual pages for these or link to sections if they exist */}
            <li><a href="#privacy-policy-section">Privacy Policy</a></li>
            <li><a href="#terms-of-service-section">Terms of Service</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default App;