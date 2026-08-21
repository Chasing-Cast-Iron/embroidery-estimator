import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo">
          <span className="header__logo-name">Intrlup</span>
          <span className="header__logo-sub">Custom Embroidery</span>
        </div>
        <nav className="header__nav" aria-label="Main navigation">
          <a href="/">Home</a>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a>
          <a href="#request" onClick={(e) => { e.preventDefault(); scrollTo('request'); }}>Start Request</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a>
          <button className="btn btn-accent btn-sm" onClick={() => scrollTo('request')}>
            Start Request
          </button>
        </nav>
        <button
          className="header__hamburger"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
      {menuOpen && (
        <nav className="header__mobile-nav" aria-label="Mobile navigation">
          <a href="/">Home</a>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo('how-it-works'); }}>How It Works</a>
          <a href="#request" onClick={(e) => { e.preventDefault(); scrollTo('request'); }}>Start Request</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('faq'); }}>FAQ</a>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a>
        </nav>
      )}
    </header>
  );
}
