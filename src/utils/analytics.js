export const GA_MEASUREMENT_ID = 'G-5PG3VZYJ8H';

export function trackPageView(path) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_location: window.location.href,
    page_path: path,
    page_title: document.title,
  });
}
