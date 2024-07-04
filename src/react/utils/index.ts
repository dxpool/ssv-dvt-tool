import config from '../../config';
import { INTERVAL_TIME } from '../constants';
import { OperatorRequestParams } from '../modals/SyncOperatorModal';
import { preloadAndCacheImages } from '../utils/imageCache';

export function sortOperatorFunction(a: any, b: any) {
  if (a.name.includes('DxPool') !== b.name.includes('DxPool')) {
    return a.name.includes('DxPool') ? -1 : 1;
  }
  return 0;
}

export function buildUrl(params: OperatorRequestParams): string {
  const { network } = params;
  let url = `${config.baseUrl}?network_type=${network.toLowerCase()}`;

  const queryParams = new URLSearchParams();

  url += queryParams.toString();
  return url;
}

/**
 * Handles the operator request by fetching data from the provided URL,
 * updating the progress, and retrieving the next nonce for the given address.
 *
 * @param {string} url - The URL to fetch data from.
 * @param {(progress: number) => void} setProgress - The function to update the progress.
 * @param {string} network - The network to retrieve the nonce from.
 * @param {string} ownerAddress - The owner address to get the nonce for.
 * @param {string} nodeUrl - The node URL to connect to.
 * @returns {Promise<{ data: any; nextNonce: number }>} - A promise that resolves with the fetched data and the next nonce.
 * @throws Will throw an error if the fetch request fails.
 */
export const handleOperatorRequest = async (
  url: string,
  setProgress: (progress: number) => void,
  network: string,
  ownerAddress: string,
  nodeUrl: string
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
    const response = await fetch(url);
    const data = (await response.json()).items;

    const nextNonce = await window.ssvKeys.getAddressNonce(network, ownerAddress, nodeUrl);

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