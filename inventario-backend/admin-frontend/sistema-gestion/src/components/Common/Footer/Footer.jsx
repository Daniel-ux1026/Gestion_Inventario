import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faInstagram,
  faYoutube,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-3 mt-auto">
      <div className="container text-center">
        {/* Redes Sociales */}
        <div className="social-icons mb-2">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faYoutube} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>

        {/* Información Legal */}
        <p className="mb-1">
          Inversiones El Lirio de los Valles S.A.C - RUC 20480460538
        </p>
        <p className="mb-0">
          TODOS LOS DERECHOS RESERVADOS ✋ | <a href="#" className="text-white text-decoration-underline">Libro de Reclamaciones</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

