export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  landingPage?: string;
}

const STORAGE_KEY = 'ohotech_utm_params';

/**
 * Capture UTM parameters from URL query string and store them in sessionStorage.
 * Safe for SSR and client navigation.
 */
export function captureUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');

    const existingJson = sessionStorage.getItem(STORAGE_KEY);
    let existing: UtmParams = existingJson ? JSON.parse(existingJson) : {};

    // If new UTM parameters are present in current URL, update session storage
    if (utmSource || utmMedium || utmCampaign || utmTerm || utmContent) {
      existing = {
        ...existing,
        utmSource: utmSource || existing.utmSource,
        utmMedium: utmMedium || existing.utmMedium,
        utmCampaign: utmCampaign || existing.utmCampaign,
        utmTerm: utmTerm || existing.utmTerm,
        utmContent: utmContent || existing.utmContent,
        landingPage: existing.landingPage || window.location.pathname,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    } else if (!existing.landingPage) {
      existing.landingPage = window.location.pathname;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    }

    return existing;
  } catch (e) {
    console.warn('UTM tracking storage exception:', e);
    return {};
  }
}

/**
 * Retrieve captured UTM parameters stored during user session.
 */
export function getCapturedUtmParams(): UtmParams {
  if (typeof window === 'undefined') return {};
  try {
    const json = sessionStorage.getItem(STORAGE_KEY);
    if (json) {
      return JSON.parse(json);
    }
  } catch (e) {
    console.warn('UTM tracking retrieval exception:', e);
  }
  return captureUtmParams();
}
