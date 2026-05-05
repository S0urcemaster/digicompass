import type { CompassImage, Rating } from '../../../types/domain';
import { getImageBadgeClassName, getImageOverlayTone, getImageStarContainerClassName } from '../collection/imageOverlayTone';
import { CompassCard } from './CompassCard';

type ImageTileProps = {
  image: CompassImage;
  imageUrl?: string;
  rating?: Rating;
  showImageId?: boolean;
};

export function ImageTile({ image, imageUrl, rating = image.rating, showImageId = false }: ImageTileProps) {
  const overlayTone = getImageOverlayTone(image.color);

  return (
    <CompassCard
      aspectClassName="aspect-[733/1024]"
      className="rounded-[18px] shadow-none"
      imageAlt={image.categories.map((category) => category.text).join(', ')}
      imageId={image.id}
      imageIdClassName="px-3 py-1.5 text-[0.75rem]"
      imageUrl={imageUrl ?? image.url}
      overlayTone={overlayTone}
      rating={rating}
      ratingClassName={`justify-center gap-0.5 px-1.5 py-1 ${getImageStarContainerClassName(overlayTone)}`}
      ratingDisabled
      ratingStarClassName="text-[0.9rem]"
      showImageId={showImageId}
      topContent={
        <p className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}>
          {image.categories[0]?.text ?? 'Unsortiert'}
        </p>
      }
      topContentClassName="left-2 top-2"
    />
  );
}
