import { openDB } from 'idb';
import { Operator } from '../../types.config';

interface LogoEntry {
  id: string;
  image: string;
}

const dbPromise = openDB('logo-cache-db', 1, {
  upgrade(db) {
    db.createObjectStore('logos', { keyPath: 'id' });
  },
});

/**
 * Caches an image in IndexedDB.
 * @param {number} id - The unique identifier for the image.
 * @param {string} network - The network name associated with the image.
 * @param {string} image - The base64 encoded image data.
 * @returns {Promise<void>} A promise that resolves when the image is cached.
 */
export async function cacheImage(id: number, network: string, image: string): Promise<void> {
  const db = await dbPromise;
  await db.put('logos', { id: `${network}-${id}`, image });
}

/**
 * Retrieves a cached image from IndexedDB.
 * @param {number} id - The unique identifier for the image.
 * @param {string} network - The network name associated with the image.
 * @returns {Promise<string | null>} A promise that resolves with the base64 encoded image data, or null if not found.
 */
export async function getCachedImage(id: number, network: string): Promise<string | null> {
  const db = await dbPromise;
  const entry: LogoEntry | undefined = await db.get('logos', `${network}-${id}`);
  return entry ? entry.image : null;
}

/**
 * Converts an image URL to a base64 encoded string.
 * @param {string} url - The URL of the image to convert.
 * @returns {Promise<string>} A promise that resolves with the base64 encoded image data.
 */
export async function convertImageToBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

/**
 * Preloads and caches images for a list of operators.
 * @param {Operator[]} data - The list of operators containing image URLs.
 * @param {string} network - The network name associated with the images.
 * @returns {Promise<Record<string, string>>} A promise that resolves with an object mapping image IDs to base64 encoded image data.
 */
export async function preloadAndCacheImages(data: Operator[], network: string): Promise<Record<string, string>> {
  const cachedImages: Record<string, string> = {};

  const imagePromises = data.map(async (item) => {
    try {
      let cachedImage = await getCachedImage(item.id, network);
      if (!cachedImage) {
        cachedImage = await convertImageToBase64(item.logo);
        await cacheImage(item.id, network, cachedImage);
      }
      cachedImages[`${network}-${item.id}`] = cachedImage;
    } catch (error) {
      cachedImages[`${network}-${item.id}`] = ""; // Return an empty string if loading or caching fails
    }
  });

  await Promise.all(imagePromises);

  return cachedImages;
}

/**
 * Clears all cached images from IndexedDB.
 * @returns {Promise<void>} A promise that resolves when all cached images are cleared.
 */
export async function clearImageCache(): Promise<void> {
  const db = await dbPromise;
  await db.clear('logos');
}