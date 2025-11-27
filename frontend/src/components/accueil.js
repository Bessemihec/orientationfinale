import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/Mainpage.css';
import '../css/toast.css';
import logo from '../images/holmena.png';
import creativite from '../images/creativite.jpg';
import fiabilite from '../images/fiabilite.png';
import evolution from '../images/evolution.png';
import score from '../images/score.jpg';
import guide from '../images/guide.png';
import ia from '../images/ia.jpg';
import international from '../images/international.png';
import softskills from '../images/soft skills.png';

const HeroSection = () => {
  const { t } = useTranslation();
  
  return (
    <section className="hero-section section-1">
      <div className="hero-content">
        <div className="hero-text">
          <h1>{t('main.hero_title')}</h1>
          <p className="platform-description">
            {t('main.hero_description')}
          </p>
          <div className="hero-buttons">
            <a href="#features" className="hero-button">{t('main.view_features')}</a>
            <a href="#contact" className="hero-button">{t('main.contact')}</a>
          </div>
        </div>
        <div className="hero-image">
          <img src={logo} alt="Holmena" />
        </div>
      </div>
    </section>
  );
};

const WhyHolmena = () => {
  const { t } = useTranslation();
  
  return (
    <section className="why-holmena section-2">
      <h2>{t('main.why_title')}</h2>
      <div className="why-list">
        <div className="why-item">
          <div className="feature-icon">
            <img src={creativite} alt={t('main.creativity')} />
          </div>
          <h3>{t('main.creativity')}</h3>
          <p>{t('main.creativity_desc')}</p>
        </div>
        <div className="why-item">
          <div className="feature-icon">
            <img src={fiabilite} alt={t('main.reliability')} />
          </div>
          <h3>{t('main.reliability')}</h3>
          <p>{t('main.reliability_desc')}</p>
        </div>
        <div className="why-item">
          <div className="feature-icon">
            <img src={evolution} alt={t('main.evolution')} />
          </div>
          <h3>{t('main.evolution')}</h3>
          <p>{t('main.evolution_desc')}</p>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ titleKey, descriptionKey, icon, align }) => {
  const { t } = useTranslation();
  
  return (
    <div className={`feature-item ${align}`}>
      <div className="feature-icon">
        <img src={icon} alt={t(titleKey)} />
      </div>
      <h3>{t(titleKey)}</h3>
      <p>{t(descriptionKey)}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const { t } = useTranslation();
  
  const features = [
    { 
      titleKey: "main.feature1_title", 
      descriptionKey: "main.feature1_desc", 
      icon: score, 
      align: 'left' 
    },
    { 
      titleKey: "main.feature2_title", 
      descriptionKey: "main.feature2_desc", 
      icon: guide, 
      align: 'right' 
    },
    { 
      titleKey: "main.feature3_title", 
      descriptionKey: "main.feature3_desc", 
      icon: ia, 
      align: 'left' 
    },
    { 
      titleKey: "main.feature4_title", 
      descriptionKey: "main.feature4_desc", 
      icon: softskills, 
      align: 'right' 
    },
    { 
      titleKey: "main.feature5_title", 
      descriptionKey: "main.feature5_desc", 
      icon: international, 
      align: 'left' 
    },
  ];

  return (
    <section id="features" className="features-section section-3">
      <h2>{t('main.features_title')}</h2>
      <div className="features-list">
        {features.map(({ titleKey, descriptionKey, icon, align }, idx) => (
          <FeatureItem 
            key={idx} 
            titleKey={titleKey} 
            descriptionKey={descriptionKey} 
            icon={icon} 
            align={align} 
          />
        ))}
      </div>
    </section>
  );
};

const ContactSection = () => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Form Submitted:", { name, email, message });
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <section id="contact" className="contact-section section-4">
      <h2>{t('main.contact_title')}</h2>
      <p>{t('main.contact_subtitle')}</p>
      {submitted && <p className="success-message">{t('main.contact_success')}</p>}
      <form onSubmit={handleSubmit} className="contact-form" noValidate>
        <label htmlFor="name">{t('main.contact_name')}</label>
        <input
          id="name"
          type="text"
          placeholder={t('main.contact_name_placeholder')}
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label htmlFor="email">{t('main.contact_email')}</label>
        <input
          id="email"
          type="email"
          placeholder={t('main.contact_email_placeholder')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label htmlFor="message">{t('main.contact_message')}</label>
        <textarea
          id="message"
          placeholder={t('main.contact_message_placeholder')}
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
          rows={5}
        ></textarea>

        <button className="btncontact" type="submit">{t('main.contact_submit')}</button>
      </form>
    </section>
  );
};

function Mainpage() {
  const { t, i18n } = useTranslation();
  const [etudiant, setEtudiant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    console.log('Fetching user data in Mainpage, token exists:', !!token);
    
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User data fetched successfully in Mainpage:', data);
        setEtudiant(data.etudiant);
        
        // Check if user is admin - don't show toast for admin
        if (data.etudiant.username === "admin") {
          console.log('Admin user detected, skipping toast');
          setIsLoading(false);
          return;
        }
        
        const mgValue = parseFloat(data.etudiant.mg);
        console.log('Checking MG value:', mgValue, 'Type:', typeof mgValue, 'Raw value:', data.etudiant.mg);
        console.log('Translation for welcomeNewUser:', t('toast.welcomeNewUser'));
        
        console.log('Toast container exists:', document.querySelector('.Toastify'));
        
        if (mgValue === 0 || mgValue === 0.0 || data.etudiant.mg === '0' || data.etudiant.mg === 0) {
          console.log('Condition met: Showing welcome toast');
          const toastOptions = {
            position: 'top-center',
            autoClose: 10000, // Increased to 10 seconds for testing
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            onOpen: () => console.log('Toast opened'),
            onClose: () => console.log('Toast closed'),
            className: 'custom-toast',
            toastId: 'welcome-toast' // Prevent duplicates
          };
          console.log('Toast options:', toastOptions);
          toast.info(t('accueil.toast.welcomeNewUser'), toastOptions);
        }
      } else if (response.status === 401) {
        console.log('Token expired or invalid in Mainpage');
        localStorage.removeItem('token');
        setEtudiant(null);
        window.dispatchEvent(new Event('authStateChanged'));
      }
    } catch (error) {
      console.error('Error in Mainpage while fetching user data:', error);
      setEtudiant(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Mainpage mounted, fetching user data...');
    fetchUserData();

    // Listen for auth state changes
    const handleAuthChange = () => {
      console.log('Auth state change event received in Mainpage');
      fetchUserData();
    };

    window.addEventListener('authStateChanged', handleAuthChange);
    return () => {
      console.log('Mainpage unmounting, cleaning up...');
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, [t]);

  if (isLoading) {
    return <div className="loading-container">Loading...</div>;
  }
  
  console.log('Rendering Mainpage, ToastContainer should be mounted');
  
  return (
    <div className="main-container" dir={i18n.dir()}>
      <ToastContainer 
        position="top-center"
        autoClose={10000} // Increased for testing
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={i18n.dir() === 'rtl'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 10000 }}
        className="custom-toast-container"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
      />
      <main>
        <HeroSection />
        <WhyHolmena />
        <FeaturesSection />
        <ContactSection />
      </main>
    </div>
  );
}

export default Mainpage;