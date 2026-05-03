const steps = [
  { number: 1, title: 'Choose Your Item', description: 'Select the type of item you want embroidered — hat, shirt, jacket, or bring your own.' },
  { number: 2, title: 'Upload Your Design', description: 'Share your logo or artwork file. We accept PNG, JPG, PDF, SVG, and more.' },
  { number: 3, title: 'Get an Estimate', description: 'Instantly see a price range based on your item type, quantity, and design complexity.' },
  { number: 4, title: 'Submit Quote Request', description: 'Send us your estimate along with your artwork and contact details.' },
  { number: 5, title: 'We Confirm Final Quote', description: 'We review your artwork, stitch count, and details — then confirm your final price.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Getting a custom embroidery quote is quick and easy.</p>
        </div>
        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.number}>
              <div className="step__number" aria-hidden="true">{step.number}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
