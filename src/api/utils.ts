import { t } from '@i18n';

export function hexToRGB(hex: string, alpha: string) {
  if (hex === undefined || hex === 'none') return;

  const r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);

  if (alpha) {
    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
  } else {
    return 'rgb(' + r + ', ' + g + ', ' + b + ')';
  }
}

// eslint-disable-next-line @typescript-eslint/ban-types
export const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: unknown[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if the image exists, if not, return a default one
 **/
export async function verifyImageExists(
  pfp: string | undefined,
  defaultImage: string,
): Promise<string> {
  if (!pfp) return defaultImage;
  // Thanks CORS for making me do this garbage
  return new Promise((resolve) => {
    const img = document.createElement('img');

    img.onload = () => {
      resolve(pfp);
    };

    img.onerror = () => {
      resolve(defaultImage);
    };

    // Hide the <img> tag to prevent it from affecting the page layout
    img.style.display = 'none';

    // Append the <img> tag to the document body (necessary for the load events to fire)
    document.body.appendChild(img);

    // Set the img source (this triggers the loading)
    img.src = pfp;
  });
}

/**
 * Turns seconds into a Creation
 * @param number timeCreated in seconds
 * @returns Creation date in a string | "Unknown"
 */
export function formatCreationDate(timeCreated: number): string {
  if (!timeCreated) return t('UNKNOWN');

  const unixTimestamp = timeCreated * 1000;
  const date = new Date(unixTimestamp);

  if (isNaN(date.getTime())) return t('UNKNOWN');

  return date.toLocaleDateString();
}
