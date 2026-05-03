import { Button } from '../../../components/Button';
import type { ReactNode } from 'react';
import type { CompassImage, Rating } from '../../../types/domain';
import { StarRating } from '../shared/StarRating';
import {
  getImageBadgeClassName,
  getImageBottomOverlayClassName,
  getImageIdBadgeClassName,
  getImageOverlayTone,
  getImageStarContainerClassName,
} from './imageOverlayTone';

type CollectionImagePanelProps = {
  image: CompassImage;
  panelClassName?: string;
  onOpenModal: () => void;
  onSetRating: (rating: Rating) => void;
  showImageId?: boolean;
  topContent?: ReactNode;
};

export function CollectionImagePanel({
  image,
  panelClassName,
  onOpenModal,
  onSetRating,
  showImageId = false,
  topContent,
}: CollectionImagePanelProps) {
  const overlayTone = getImageOverlayTone(image.color);

  return (
    <article
      className={`relative overflow-hidden rounded-[28px] bg-[#201a18] shadow-[0_30px_90px_rgba(32,26,24,0.28)] ${panelClassName ?? ''}`}
    >
      <img
        alt={image.categories.map((category) => category.text).join(', ')}
        className="min-[900px]:h-full w-full object-contain"
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src={image.url}
      />
      {showImageId ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className={`rounded-full px-6 py-3 text-5xl font-semibold ${getImageIdBadgeClassName(overlayTone)}`}>
            {image.id}
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/55" />

      <div className="absolute left-6 top-6 z-10">
        {topContent ?? (
          <p
            className={`inline-flex rounded-full px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
          >
            {image.categories[0]?.text ?? 'Unsortiert'}
          </p>
        )}
      </div>

      <Button
        aria-label="Vergrößertes Bild öffnen"
        className={`absolute right-6 top-6 z-10 h-[5.25rem] w-[5.25rem] ${getImageIdBadgeClassName(overlayTone)}`}
        onClick={onOpenModal}
        shape="round"
        tone={overlayTone}
        variant="overlay-action"
      >
        <svg
          aria-hidden="true"
          className="h-9 w-9"
          fill="none"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 16L21 21" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        </svg>
      </Button>

      <div
        className={`absolute inset-x-0 bottom-0 z-10 px-6 pb-6 pt-20 sm:px-7 sm:pb-7 ${getImageBottomOverlayClassName(overlayTone)}`}
      >
        <div className="ml-auto max-w-[26rem]">
          <StarRating
            className={`w-full justify-between rounded-full px-2 py-2 ${getImageStarContainerClassName(overlayTone)}`}
            buttonClassName="flex-1 text-center"
            rating={image.rating}
            starClassName="text-[3.25rem]"
            tone={overlayTone}
            onChange={onSetRating}
          />
        </div>
      </div>
    </article>
  );
}
