import type { CompassImage } from '../../../types/domain';

export type ImageOverlayTone = 'light' | 'dark';

const getDominantImageTone = (color: CompassImage['color']): 'light' | 'dark' | 'neutral' => {
  if (color.startsWith('dunkel')) {
    return 'dark';
  }

  if (color.startsWith('hell')) {
    return 'light';
  }

  return 'neutral';
};

export const getImageOverlayTone = (color: CompassImage['color']): ImageOverlayTone =>
  getDominantImageTone(color) === 'dark' ? 'light' : 'dark';

export const getImageBadgeClassName = (tone: ImageOverlayTone) =>
  tone === 'light'
    ? 'bg-[#1f1712]/84 text-[#fff7ed] shadow-[0_8px_24px_rgba(0,0,0,0.22)]'
    : 'bg-[#fff7ed]/92 text-[#1f1712] shadow-[0_8px_24px_rgba(0,0,0,0.18)]';

export const getImageIdBadgeClassName = (tone: ImageOverlayTone) =>
  tone === 'light'
    ? 'bg-[#1f1712]/84 text-[#fff7ed] shadow-[0_12px_28px_rgba(0,0,0,0.22)]'
    : 'bg-[#fff7ed]/92 text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.18)]';

export const getImageBottomOverlayClassName = (tone: ImageOverlayTone) =>
  tone === 'light'
    ? 'bg-gradient-to-t from-[#fff7ed]/96 via-[#fff7ed]/56 to-transparent'
    : 'bg-gradient-to-t from-[#1f1712]/96 via-[#1f1712]/62 to-transparent';

export const getImageStarContainerClassName = (tone: ImageOverlayTone) =>
  tone === 'light'
    ? 'bg-[#1f1712]/84 text-[#fff7ed] shadow-[0_12px_28px_rgba(0,0,0,0.22)]'
    : 'bg-[#fff7ed]/92 text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.18)]';
