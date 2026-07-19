export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="contact">
      <p className="footer__name">Custom Embroidery by Chasing Cast Iron</p>
      <p className="footer__contact">
        Call 218-544-0071 or email{' '}
        <a href="mailto:EricksonEmbroidery@gmail.com">EricksonEmbroidery@gmail.com</a>{' '}
        for custom embroidery orders.
      </p>
      <p className="footer__copy">© {year} Chasing Cast Iron. All rights reserved.</p>
      <p className="footer__disclaimer">
        All estimates are preliminary and subject to change after artwork review.
        Final pricing is confirmed before production begins.
      </p>
    </footer>
  );
}
