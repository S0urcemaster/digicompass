import type { ReactNode } from 'react';
import { Button } from '../../../components/Button';
import type { Rating } from '../../../types/domain';
import type { ImageOverlayTone } from '../collection/imageOverlayTone';
import {
  getImageBottomOverlayClassName,
  getImageIdBadgeClassName,
} from '../collection/imageOverlayTone';
import { StarRating } from './StarRating';

type CompassCardAction = {
  ariaLabel: string;
  icon: ReactNode;
  onClick: () => void;
};

type CompassCardRatingVariant = 'main' | 'preview';

type CompassCardProps = {
  action?: CompassCardAction;
  aspectClassName?: string;
  bottomContent?: ReactNode;
  className?: string;
  imageIdClassName?: string;
  imageAlt: string;
  imageClassName?: string;
  imageFit?: 'contain' | 'cover';
  imageUrl: string;
  loading?: 'eager' | 'lazy';
  overlayTone: ImageOverlayTone;
  rating?: Rating;
  ratingClassName?: string;
  ratingDisabled?: boolean;
  ratingVariant?: CompassCardRatingVariant;
  showImageId?: boolean;
  topContent?: ReactNode;
  topContentClassName?: string;
  imageId?: number;
  onSetRating?: (rating: Rating) => void;
};

const cn = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');

export function CompassCard({
  action,
  aspectClassName = 'aspect-[10/14]',
  bottomContent,
  className,
  imageIdClassName,
  imageAlt,
  imageClassName,
  imageFit = 'cover',
  imageId,
  imageUrl,
  loading = 'lazy',
  onSetRating,
  overlayTone,
  rating,
  ratingClassName,
  ratingDisabled = false,
  ratingVariant = 'main',
  showImageId = false,
  topContent,
  topContentClassName,
}: CompassCardProps) {
  const hasRating = typeof rating === 'number';

  return (
    <article
      className={cn(
        'relative overflow-hidden bg-[#201a18] text-white shadow-[0_30px_90px_rgba(32,26,24,0.28)]',
        aspectClassName,
        className
      )}
    >
      <img
        alt={imageAlt}
        className={cn('absolute inset-0 h-full w-full', imageFit === 'contain' ? 'object-contain' : 'object-cover', imageClassName)}
        decoding="async"
        fetchPriority={loading === 'eager' ? 'high' : 'low'}
        loading={loading}
        src={imageUrl}
      />
      {showImageId && imageId !== undefined ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div
            className={cn('rounded-full px-6 py-3 text-5xl font-semibold', getImageIdBadgeClassName(overlayTone), imageIdClassName)}
          >
            {imageId}
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/55" />

      {topContent ? <div className={cn('absolute left-6 top-6 z-10', topContentClassName)}>{topContent}</div> : null}

      {action ? (
        <Button
          aria-label={action.ariaLabel}
          className={cn('absolute right-6 top-6 z-10 h-[5.25rem] w-[5.25rem]', getImageIdBadgeClassName(overlayTone))}
          onClick={action.onClick}
          shape="round"
          tone={overlayTone}
          variant="overlay-action"
        >
          {action.icon}
        </Button>
      ) : null}

      {bottomContent ? (
        <div className={cn('absolute inset-x-0 bottom-0 z-10 px-6 pb-6 pt-20 sm:px-7 sm:pb-7', getImageBottomOverlayClassName(overlayTone))}>
          {bottomContent}
        </div>
      ) : null}

      {hasRating ? (
        <div className={cn('absolute inset-x-0 bottom-0 z-10 px-6 pb-6 pt-20 sm:px-7 sm:pb-7', getImageBottomOverlayClassName(overlayTone))}>
          <div className="ml-auto max-w-[26rem]">
            <StarRating
              allowClear={false}
              className={ratingClassName}
              disabled={ratingDisabled}
              rating={rating}
              tone={overlayTone}
              variant={ratingVariant === 'preview' ? 'image-preview' : 'image-main'}
              onChange={onSetRating}
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}
