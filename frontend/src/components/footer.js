import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../css/Footer.css';
import logo from '../images/holmena.png';

const Footer = () => {
  const { t, i18n } = useTranslation();

  return (
    <footer className="findx-footer" dir={i18n.dir()}>
      <div className="footer-container">
        {/* Brand Section */}
        <div className="footer-brand-section">
          <div className="brand-content">
            <Link to="/" className="logo-wrapper">
              <img src={logo} alt="FindX Logo" className="brand-logo" />
            </Link>
            <div className="brand-text">
              <h2 className="brand-title">FindX</h2>
              <p className="brand-description">
                {t('footer.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="footer-section">
          <h3 className="section-title">{t('footer.contact_title')}</h3>
          <div className="contact-info">
            <p>{t('footer.address')}</p>
            <p>{t('footer.phone')}</p>
            <p>{t('footer.email')}</p>
            <p>{t('footer.hours')}</p>
          </div>
        </div>

        {/* Location Map */}
        <div className="footer-section">
          <h3 className="section-title">{t('footer.location_title')}</h3>
          <div className="map-container">
            <iframe
              title={t('footer.map')}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3190.7551652769686!2d10.3246!3d36.8665!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDUyJzAwLjQiTiAxMMKwMTknMjguNiJF!5e0!3m2!1sen!2stn!4v1620000000000!5m2!1sen!2stn"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t('footer.copyright')}</p>
      </div>
    </footer>
  );
};

export default Footer;