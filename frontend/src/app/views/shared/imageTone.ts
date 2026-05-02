import type { ImageColor } from '../../../types/domain';

export const getImageTextColor = (imageColor: ImageColor) => {
  if (imageColor.startsWith('hell')) {
    return '#0e0601';
  }

  if (imageColor.startsWith('dunkel')) {
    return '#f1eade';
  }

  return '#0e0601';
};

export const getCollectionUiTone = (imageColor: ImageColor): 'light' | 'dark' => {
  if (imageColor.startsWith('hell')) {
    return 'dark';
  }

  if (imageColor.startsWith('dunkel')) {
    return 'light';
  }

  return 'light';
};

export const getCollectionUiClasses = (imageColor: ImageColor) => {
  const tone = getCollectionUiTone(imageColor);

  if (tone === 'dark') {
    return {
      overlay: 'from-black/84 via-black/52 to-transparent',
      metaText: 'text-white/72',
      titleText: 'text-white',
      badge: 'bg-[#1f1712]/88 text-[#f6efe2]',
      tileLabel: 'bg-[#1f1712]/82 text-white',
      tone,
    };
  }

  return {
    overlay: 'from-[#fff7ed]/96 via-[#fff7ed]/56 to-transparent',
    metaText: 'text-[#5b4330]/78',
    titleText: 'text-[#1f1712]',
    badge: 'bg-[#fff7ed]/92 text-[#1f1712]',
    tileLabel: 'bg-[#fff7ed]/92 text-[#1f1712]',
    tone,
  };
};

export const getCollectionInfoUiClasses = (imageColor: ImageColor) => {
  const tone: 'light' | 'dark' = getCollectionUiTone(imageColor) === 'dark' ? 'light' : 'dark';

  if (tone === 'dark') {
    return {
      overlay: 'from-black/84 via-black/52 to-transparent',
      metaText: 'text-white/72',
      titleText: 'text-white',
      badge: 'bg-[#1f1712]/88 text-[#f6efe2]',
      tileLabel: 'bg-[#1f1712]/82 text-white',
      tone,
    };
  }

  return {
    overlay: 'from-[#fff7ed]/96 via-[#fff7ed]/56 to-transparent',
    metaText: 'text-[#5b4330]/78',
    titleText: 'text-[#1f1712]',
    badge: 'bg-[#fff7ed]/92 text-[#1f1712]',
    tileLabel: 'bg-[#fff7ed]/92 text-[#1f1712]',
    tone,
  };
};
