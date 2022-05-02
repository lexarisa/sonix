import './styles/footer.scss';
// import React from 'react';
const scrollToTop = () => {
  window.scrollTo(0, 0);
};

const Footer = (): JSX.Element => {
  return (
    <footer className="footer">
      <h3 className="footer-logo">
        sonix - <span className="date">&copy; {new Date().getFullYear()}</span>
      </h3>
      <p className="footer-text" onClick={scrollToTop}>
        Back to top
      </p>
    </footer>
  );
};

export default Footer;
