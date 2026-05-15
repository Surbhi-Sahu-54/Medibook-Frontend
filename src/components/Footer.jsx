import React from 'react';
import { Stethoscope, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="logo" style={{ marginBottom: '1.5rem' }}>
              <Stethoscope size={28} color="var(--primary)" />
              <span>Medibook</span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Making healthcare accessible, fast, and reliable. Book your appointments with top doctors in just a few clicks.
            </p>
          </div>
          
          <div className="footer-col">
            <h3>Quick Links</h3>
            <div className="footer-links">
              <a href="/">Home</a>
              <a href="/doctors">Find Doctors</a>
              <a href="/login">Login</a>
              <a href="/register">Register</a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Services</h3>
            <div className="footer-links">
              <a href="#">General Checkup</a>
              <a href="#">Specialist Consultation</a>
              <a href="#">Online Diagnosis</a>
              <a href="#">Emergency Care</a>
            </div>
          </div>
          
          <div className="footer-col">
            <h3>Contact Us</h3>
            <div className="footer-links">
              <a href="mailto:support@medibook.com" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Mail size={16} /> support@medibook.com
              </a>
              <a href="tel:+1234567890" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Phone size={16} /> +1 (234) 567-890
              </a>
              <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)' }}>
                <MapPin size={16} /> 123 Health Ave, NY 10001
              </span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Medibook Microservices Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
