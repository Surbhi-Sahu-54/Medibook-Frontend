import React from 'react';

const About = () => {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', minHeight: 'calc(100vh - 5rem)', textAlign: 'center' }}>
      <div className="glass-panel animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>About Medibook</h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
          Medibook is a comprehensive online appointment booking system designed to seamlessly connect patients with top healthcare professionals. 
          Our mission is to simplify healthcare access by providing a user-friendly platform for finding specialists, booking appointments, and managing medical records.
        </p>
      </div>
    </div>
  );
};

export default About;
