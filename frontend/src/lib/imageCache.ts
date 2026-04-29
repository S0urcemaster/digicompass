const imageLoadCache = new Map<string, Promise<void>>();

const loadImage = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const image = new Image();

    image.onload = () => {
      if (typeof image.decode === 'function') {
        image.decode().catch(() => undefined).finally(() => resolve());
        return;
      }

      resolve();
    };
    image.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
    image.src = src;
  });

export const preloadImage = (src: string) => {
  const cachedLoad = imageLoadCache.get(src);

  if (cachedLoad) {
    return cachedLoad;
  }

  const nextLoad = loadImage(src).catch((error) => {
    imageLoadCache.delete(src);
    throw error;
  });

  imageLoadCache.set(src, nextLoad);

  return nextLoad;
};

export const preloadImages = (sources: string[]) =>
  Promise.allSettled([...new Set(sources)].map((src) => preloadImage(src)));
