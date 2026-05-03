export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero" aria-labelledby="hero-headline">
      <p className="hero__eyebrow">Professional Embroidery Services</p>
      <h1 className="hero__headline" id="hero-headline">
        Custom Embroidery for Hats, Apparel &amp; More
      </h1>
      <p className="hero__subheading">
        Upload your design, choose your item and quantity, and get an estimated
        quote before we review your artwork.
      </p>
      <div className="hero__actions">
        <button className="btn btn-primary btn-lg" onClick={() => scrollTo('estimate')}>
          Start Estimate
        </button>
        <button className="btn btn-secondary btn-lg" style={{ borderColor: 'rgba(255,255,255,0.6)', color: '#fff' }} onClick={() => scrollTo('how-it-works')}>
          How It Works
        </button>
      </div>
      <p className="hero__note">Final pricing is confirmed after artwork review.</p>
    </section>
  );
}
