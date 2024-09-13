import { INTERVAL_TIME } from '../constants';
import { preloadAndCacheImages } from '../utils/imageCache';
import { getOperatorList, getAddressNonce } from "../../api"

/**
 * get address nonce using api
 * 
 * @param ownerAddress
 * @param network 
 * 
 * @returns nonce
 *          
 */
export const getNonce = async (network: string, ownerAddress: string): Promise<number> => {
  const params = {
    network_type: network,
    address: ownerAddress,
  }
  const res = await getAddressNonce(params);

  return res.data.nonce;
};

export function sortOperatorFunction(a: any, b: any) {
  if (a.name.includes('DxPool') !== b.name.includes('DxPool')) {
    return a.name.includes('DxPool') ? -1 : 1;
  }
  return 0;
}

/**
 * Handles the operator request by fetching data from the provided URL,
 * updating the progress, and retrieving the next nonce for the given address.
 *
 * @param {(progress: number) => void} setProgress - The function to update the progress.
 * @param {string} network - The network to retrieve the nonce from.
 * @param {string} ownerAddress - The owner address to get the nonce for.
 * @returns {Promise<{ data: any; nextNonce: number }>} - A promise that resolves with the fetched data and the next nonce.
 * @throws Will throw an error if the fetch request fails.
 */
export const handleOperatorRequest = async (
  setProgress: (progress: number) => void,
  network: string,
  ownerAddress: string,
): Promise<{ data: any; nextNonce: number }> => {
  let progress = 0;

  const updateProgress = () => {
    if (progress < 90) {
      progress += 10;
      setProgress(progress);
    }
  };

  const intervalId = setInterval(updateProgress, INTERVAL_TIME);

  try {
    const params = {
      network_type: network.toLowerCase()
    }
    const response = await getOperatorList(params);
    const data = response.data.items;

    const nextNonce = await getNonce(network.toLowerCase(), ownerAddress);

    await preloadAndCacheImages(data, network);

    clearInterval(intervalId);
    setProgress(100);

    return { data, nextNonce };
  } catch (err: any) {
    clearInterval(intervalId);
    // reset progress bar
    setProgress(0);
    throw err;
  }
};

/**
 * Creates a debounced function that delays invoking the provided function until after 
 * a specified wait time has elapsed since the last time the debounced function was invoked.
 * 
 * @template T - The type of the function to debounce.
 * @param {T} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {(...args: Parameters<T>) => void} A new debounced function.
 */
export const debounce = <T extends (...args: any[]) => void>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

export function cutString(str: string, len1: number, len2: number) {
  if (!str) return

  let strlen = str.length
  if ( strlen <= len1 + len2) return str

  str = str.substring(0, len1) + '...' + str.substring(strlen - len2)

  return str
}