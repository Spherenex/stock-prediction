import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-copyright">
            © {new Date().getFullYear()} StockPredict. All rights reserved.
          </div>
          
          <div className="footer-disclaimer">
            Disclaimer: This application is for educational purposes only. Predictions may not be accurate and should not be used for actual trading decisions.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;