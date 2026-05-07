import embroideryHat from '../assets/embroidery-hat.webp';
import customEmbroideryLogo from '../assets/custom-embroidery-logo-transparent.png';

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" aria-labelledby="hero-headline">
      <div className="hero__inner">
        <div className="hero__panel">
          <p className="hero__parent-brand">Chasing Cast Iron</p>
          <div className="hero__logo-card">
            <img
              className="hero__service-logo"
              src={customEmbroideryLogo}
              alt="Custom Embroidery logo with phone number 218-544-0071"
            />
          </div>
          <div className="brand-rule" aria-hidden="true" />
          <p className="hero__eyebrow">Embroidery by Chasing Cast Iron</p>
          <h1 className="hero__headline" id="hero-headline">
            Start an Embroidery Request
          </h1>
          <p className="hero__subheading">
            Hats, apparel, reunion gear, business apparel, and more. Get an estimate first
            or send a quote request now.
          </p>
          <div className="hero__actions">
            <button className="btn btn-primary btn-lg" onClick={() => scrollTo('request')}>
              Start Request
            </button>
          </div>
        </div>
        <div className="hero__image-wrap">
          <img
            className="hero__image"
            src={embroideryHat}
            alt="Embroidered Grandpa's Guns hat by Chasing Cast Iron"
          />
        </div>
      </div>
    </section>
  );
}
