import type { ReactNode } from 'react';
import type { CompassImage, Rating } from '../../../types/domain';
import { CompassCard } from '../shared/CompassCard';
import {
  getImageBadgeClassName,
  getImageOverlayTone,
  getImageStarContainerClassName,
} from './imageOverlayTone';

type CollectionImagePanelProps = {
  image: CompassImage;
  imageClassName?: string;
  panelClassName?: string;
  onOpenModal: () => void;
  onSetRating?: (rating: Rating) => void;
  showImageId?: boolean;
  topContent?: ReactNode;
};

export function CollectionImagePanel({
  image,
  imageClassName,
  panelClassName,
  onOpenModal,
  onSetRating,
  showImageId = false,
  topContent,
}: CollectionImagePanelProps) {
  const overlayTone = getImageOverlayTone(image.color);
  const ratingDisabled = !onSetRating;

  return (
    <CompassCard
      action={{
        ariaLabel: 'Vergrößertes Bild öffnen',
        icon: (
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
        ),
        onClick: onOpenModal,
      }}
      className={panelClassName}
      imageAlt={image.categories.map((category) => category.text).join(', ')}
      imageClassName={imageClassName}
      imageFit={imageClassName?.includes('object-cover') ? 'cover' : 'contain'}
      imageId={image.id}
      imageUrl={image.url}
      loading="eager"
      onSetRating={onSetRating}
      overlayTone={overlayTone}
      rating={image.rating}
      ratingClassName={getImageStarContainerClassName(overlayTone)}
      ratingDisabled={ratingDisabled}
      showImageId={showImageId}
      topContent={
        topContent ?? (
          <p
            className={`inline-flex rounded-full px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
          >
            {image.categories[0]?.text ?? 'Unsortiert'}
          </p>
        )
      }
    />
  );
}
