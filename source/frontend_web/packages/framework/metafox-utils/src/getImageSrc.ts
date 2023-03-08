import { get, isObject, isString } from 'lodash';

/**
 *
 * @param {Object} img - Get image src path. Example: {"300": "/bgs/01/a1_300.png", "origin": "..."}
 * @param {String} prefers - Prefer size. Example "300,120"
 * @param defaultValue - Default value should be loaded from settings.
 * @returns
 */
export default function getImageSrc(
  img?: Record<string, string> | string,
  prefers: string = '500', // etc: 500,1024, split by comma.
  defaultValue?: string
): string | undefined {
  if (!img) return defaultValue;

  if (isString(img)) return img;

  if (isObject(img)) {
    if (prefers) {
      const size = prefers
        .split(',')
        .map(x => x.trim())
        .find(size => img[size]);

      if (size) {
        return img[size];
      }

      return get(img, 'origin');
    }
  }

  return defaultValue;
}
