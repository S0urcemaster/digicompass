import { getImageOverlayTone } from '../collection/imageOverlayTone';
import type { ImageColor } from '../../../types/domain';
import type { Rating } from '../../../types/domain';
import { StarRating } from './StarRating';
import { getImageBottomOverlayClassName, getImageStarContainerClassName } from '../collection/imageOverlayTone';

type FocusTileProps = {
  focus: {
    rating: Rating;
    saying: {
      categories: Array<{
        text: string;
      }>;
      text: string;
      fontSize: number;
    };
    image: {
      categories: Array<{
        text: string;
      }>;
      color: ImageColor;
      url: string;
    };
  };
  onSetRating?: (rating: Rating) => void;
  variant?: 'main' | 'preview';
};

export function FocusTile({ focus, onSetRating, variant = 'preview' }: FocusTileProps) {
  const isMain = variant === 'main';
  const sayingCategories = focus.saying.categories.map((category) => category.text).join(' / ') || 'Unsortiert';
  const imageCategory = focus.image.categories[0]?.text ?? 'Unsortiert';
  const overlayTone = getImageOverlayTone(focus.image.color);

  if (isMain) {
    return (
      <div className="relative aspect-[10/14] overflow-hidden rounded-[28px] bg-[#201a18] text-white shadow-[0_30px_90px_rgba(32,26,24,0.28)]">
        <img
          alt={focus.saying.text}
          className="absolute inset-0 h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
          loading="eager"
          src={focus.image.url}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/55" />
        <div className="absolute left-6 top-6 z-10 max-w-[26rem]">
          <div
            className={`rounded-[24px] px-5 py-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-[3px] ${
              overlayTone === 'light' ? 'bg-[#1f1712]/72 text-[#fff7ed]' : 'bg-[#fff7ed]/78 text-[#1f1712]'
            }`}
          >
            <p
              className={`text-[0.68rem] font-semibold uppercase tracking-[0.18em] ${
                overlayTone === 'light' ? 'text-[#fff7ed]/80' : 'text-[#1f1712]/72'
              }`}
            >
              {sayingCategories}
            </p>
            <p
              className="mt-3 font-semibold leading-[1.08] tracking-[-0.04em]"
              style={{ fontSize: `clamp(2rem, ${focus.saying.fontSize / 12}vw, ${focus.saying.fontSize * 1.08}px)` }}
            >
              {focus.saying.text}
            </p>
          </div>
        </div>
        <div
          className={`absolute inset-x-0 bottom-0 z-10 px-6 pb-6 pt-20 sm:px-7 sm:pb-7 ${getImageBottomOverlayClassName(overlayTone)}`}
        >
          <div className="ml-auto max-w-[26rem]">
            <StarRating
              allowClear={false}
              className={`w-full justify-between rounded-full px-2 py-2 ${getImageStarContainerClassName(overlayTone)}`}
              buttonClassName="flex-1 text-center"
              rating={focus.rating}
              starClassName="text-[3.25rem]"
              tone={overlayTone}
              onChange={onSetRating}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative aspect-[733/1024] overflow-hidden rounded-[20px] bg-[#201a18] text-white"
    >
      <img
        alt={focus.saying.text}
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        fetchPriority="low"
        loading="lazy"
        src={focus.image.url}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/65" />
      <div
        className="absolute left-1/2 top-[8%] z-10 w-[88%] -translate-x-1/2 px-2 text-center font-serif leading-[1.08] drop-shadow-[0_6px_12px_rgba(0,0,0,0.48)]"
        style={{
          color: '#0e0601',
          fontSize: `clamp(1.425rem, ${focus.saying.fontSize / 18.67}vw, ${Math.max(30, focus.saying.fontSize * 0.72)}px)`,
        }}
      >
        {focus.saying.text}
      </div>
      <div className="absolute left-2 top-2 z-10">
        <p className="inline-flex rounded-full bg-[#fff7ed]/92 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f1712] shadow-[0_6px_18px_rgba(0,0,0,0.16)]">
          {imageCategory}
        </p>
      </div>
    </div>
  );
}
