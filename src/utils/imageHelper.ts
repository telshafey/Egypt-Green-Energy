import heroCommandImg from '../assets/images/hero_light_current_command_1792181184410.jpg';
import cctvImg from '../assets/images/cctv_surveillance_control_1792181185253.jpg';
import cablingImg from '../assets/images/structured_cabling_rack_1792181185069.jpg';
import accessImg from '../assets/images/access_control_turnstiles_1792181185252.jpg';
import datacenterImg from '../assets/images/it_scada_datacenter_1792180511048.jpg';
import energyImg from '../assets/images/energy_solar_microgrid_1792180512010.jpg';
import biotechImg from '../assets/images/biotech_algae_hydroponics_1792180510094.jpg';
import jojobaImg from '../assets/images/jojoba_biofuel_plantation_1792180511642.jpg';
import fireAlarmImg from '../assets/images/fire_alarm_smart_panel_1792182918338.jpg';
import bmsImg from '../assets/images/bms_smart_building_dashboard_1792182919025.jpg';

export {
  heroCommandImg,
  cctvImg,
  cablingImg,
  accessImg,
  datacenterImg,
  energyImg,
  biotechImg,
  jojobaImg,
  fireAlarmImg,
  bmsImg,
};

export const DEFAULT_HERO_IMAGE = heroCommandImg;
export const DEFAULT_CCTV_IMAGE = cctvImg;
export const DEFAULT_CABLING_IMAGE = cablingImg;
export const DEFAULT_ACCESS_IMAGE = accessImg;
export const DEFAULT_DATACENTER_IMAGE = datacenterImg;
export const DEFAULT_ENERGY_IMAGE = energyImg;
export const DEFAULT_BIOTECH_IMAGE = biotechImg;
export const DEFAULT_JOJOBA_IMAGE = jojobaImg;
export const DEFAULT_FIRE_ALARM_IMAGE = fireAlarmImg;
export const DEFAULT_BMS_IMAGE = bmsImg;

/**
 * Robust image URL resolver:
 * Ensures any image URL (bundled, stored in Firestore, or public) is properly resolved
 * and guaranteed to load on both local dev and production (Vercel, Cloud Run, etc.)
 */
export function resolveImageUrl(url?: string | null, fallback: string = heroCommandImg): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return fallback;
  }

  const cleanUrl = url.trim();

  // Handle mapped asset image names and keywords
  const lower = cleanUrl.toLowerCase();

  if (lower.includes('cctv') || lower.includes('surveillance') || lower.includes('camera')) {
    return cctvImg;
  }
  if (lower.includes('cabling') || lower.includes('structured') || lower.includes('cat6') || lower.includes('fiber')) {
    return cablingImg;
  }
  if (lower.includes('access') || lower.includes('turnstile') || lower.includes('biometric') || lower.includes('gate')) {
    return accessImg;
  }
  if (lower.includes('fire_alarm') || lower.includes('fire') || lower.includes('alarm') || lower.includes('detector')) {
    return fireAlarmImg;
  }
  if (lower.includes('bms') || lower.includes('automation') || lower.includes('scada') || lower.includes('building_dashboard')) {
    return bmsImg;
  }
  if (lower.includes('datacenter') || lower.includes('telephony') || lower.includes('pbx') || lower.includes('server')) {
    return datacenterImg;
  }
  if (lower.includes('energy') || lower.includes('solar') || lower.includes('microgrid') || lower.includes('pv')) {
    return energyImg;
  }
  if (lower.includes('biotech') || lower.includes('algae') || lower.includes('hydroponic') || lower.includes('water')) {
    return biotechImg;
  }
  if (lower.includes('jojoba') || lower.includes('biofuel') || lower.includes('plantation')) {
    return jojobaImg;
  }
  if (lower.includes('hero') || lower.includes('command') || lower.includes('operations')) {
    return heroCommandImg;
  }

  // Handle /src/assets/images paths stored in Firestore
  if (cleanUrl.startsWith('/src/assets/images/')) {
    const filename = cleanUrl.replace('/src/assets/images/', '');
    return `/assets/images/${filename}`;
  }

  // Handle /public/ prefix
  if (cleanUrl.startsWith('/public/')) {
    return cleanUrl.replace('/public/', '/');
  }

  // Handle direct HTTP/HTTPS URLs or valid public paths
  return cleanUrl;
}

/**
 * Universal error handler for HTML <img> tags to prevent broken image icons.
 * Can be used directly: `onError={handleImageError}`
 * Or with a specific fallback: `onError={handleImageFallback(DEFAULT_CCTV_IMAGE)}`
 */
export function handleImageFallback(fallbackSrc: string = DEFAULT_HERO_IMAGE) {
  return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    if (target.src !== fallbackSrc && !target.dataset.fallbackApplied) {
      target.dataset.fallbackApplied = 'true';
      target.src = fallbackSrc;
    }
  };
}

export function handleImageError(
  eOrFallback?: React.SyntheticEvent<HTMLImageElement, Event> | string,
  maybeFallback?: string
) {
  // If called as curried function with string: handleImageError(fallbackSrc)(e)
  if (typeof eOrFallback === 'string') {
    return handleImageFallback(eOrFallback);
  }

  // If called directly as event handler: <img onError={handleImageError} />
  if (eOrFallback && typeof eOrFallback === 'object' && 'currentTarget' in eOrFallback) {
    const target = eOrFallback.currentTarget;
    const fallback = maybeFallback || DEFAULT_HERO_IMAGE;
    if (target.src !== fallback && !target.dataset.fallbackApplied) {
      target.dataset.fallbackApplied = 'true';
      target.src = fallback;
    }
    return;
  }

  return handleImageFallback(DEFAULT_HERO_IMAGE);
}


