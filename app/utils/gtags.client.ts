declare global {
  interface Window {
    gtag: (
      option: "config",
      gaTrackingId: string,
      options: { page_path: string }
    ) => void;
  }
}

/**
 * @example
 * https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 */
export const pageview = (url: string, trackingId: string) => {
  if (!window.gtag) {
    console.warn(
      "window.gtag is not defined. This could mean your google analytics script has not loaded on the page yet."
    );

    return;
  }

  window.gtag("config", trackingId, {
    page_path: url,
  });
};
