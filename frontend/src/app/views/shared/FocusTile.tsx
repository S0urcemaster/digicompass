import { CompassCard } from './CompassCard';
import type { ImageColor } from '../../../types/domain';
import type { Rating } from '../../../types/domain';
import { getImageBadgeClassName, getImageOverlayTone, getImageStarContainerClassName } from '../collection/imageOverlayTone';

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
  const sayingCard = (
    <div
      className={`max-w-[26rem] rounded-[24px] text-left shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-[3px] ${
        overlayTone === 'light' ? 'bg-[#1f1712]/72 text-[#fff7ed]' : 'bg-[#fff7ed]/78 text-[#1f1712]'
      } ${isMain ? 'px-5 py-4' : 'max-w-[86%] px-3.5 py-3'}`}
    >
      <p
        className={`font-semibold uppercase tracking-[0.18em] ${
          overlayTone === 'light' ? 'text-[#fff7ed]/80' : 'text-[#1f1712]/72'
        } ${isMain ? 'text-[0.68rem]' : 'text-[0.52rem]'}`}
      >
        {sayingCategories}
      </p>
      <p
        className={`font-semibold leading-[1.08] tracking-[-0.04em] ${isMain ? 'mt-3' : 'mt-2'}`}
        style={{
          fontSize: isMain
            ? `clamp(2rem, ${focus.saying.fontSize / 12}vw, ${focus.saying.fontSize * 1.08}px)`
            : `clamp(1rem, ${focus.saying.fontSize / 22}vw, ${Math.max(21, focus.saying.fontSize * 0.5)}px)`,
        }}
      >
        {focus.saying.text}
      </p>
    </div>
  );

  if (isMain) {
    return (
      <CompassCard
        imageAlt={focus.saying.text}
        imageUrl={focus.image.url}
        loading="eager"
        onSetRating={onSetRating}
        overlayTone={overlayTone}
        rating={focus.rating}
        ratingClassName={getImageStarContainerClassName(overlayTone)}
        topContent={sayingCard}
      />
    );
  }

  return (
    <CompassCard
      aspectClassName="aspect-[733/1024]"
      className="rounded-[20px] shadow-none"
      imageAlt={focus.saying.text}
      imageUrl={focus.image.url}
      overlayTone={overlayTone}
      topContent={
        <div className="space-y-2">
          <p
            className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
          >
            {imageCategory}
          </p>
          {sayingCard}
        </div>
      }
      topContentClassName="left-3 top-3 right-3"
    />
  );
}
