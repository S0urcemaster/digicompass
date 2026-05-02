import { Button } from '../../../components/Button';
import type { CompassImage, Rating } from '../../../types/domain';
import { StarRating } from '../shared/StarRating';

type CollectionImagePanelProps = {
  image: CompassImage;
  isInCollection: boolean;
  panelClassName?: string;
  onToggleCollection: () => void;
  onOpenModal: () => void;
  onSetRating: (rating: Rating) => void;
  showImageId?: boolean;
};

export function CollectionImagePanel({
  image,
  isInCollection,
  panelClassName,
  onToggleCollection,
  onOpenModal,
  onSetRating,
  showImageId = false,
}: CollectionImagePanelProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-[28px] bg-[#201a18] shadow-[0_30px_90px_rgba(32,26,24,0.28)] ${panelClassName ?? ''}`}
    >
      <img
        alt={image.categories.map((category) => category.text).join(', ')}
        className="min-[900px]:h-full w-full object-contain"
        decoding="async"
        fetchpriority="high"
        loading="eager"
        src={image.url}
      />
      {showImageId ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="rounded-full bg-[#fff7ed]/92 px-6 py-3 text-5xl font-semibold text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.18)]">
            {image.id}
          </div>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/55" />

      <Button
        aria-label={isInCollection ? 'Bild aus der Sammlung entfernen' : 'Bild zur Sammlung hinzufügen'}
        aria-pressed={isInCollection}
        className="absolute left-6 top-6 z-10 h-[5.25rem] w-[5.25rem] text-[1.875rem]"
        onClick={onToggleCollection}
        shape="round"
        tone="light"
        variant="overlay-action"
      >
        {isInCollection ? '✓' : '+'}
      </Button>

      <Button
        aria-label="Vergrößertes Bild öffnen"
        className="absolute right-6 top-6 z-10 h-[5.25rem] w-[5.25rem]"
        onClick={onOpenModal}
        shape="round"
        tone="light"
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

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 bg-gradient-to-t from-[#fff7ed]/96 via-[#fff7ed]/56 to-transparent px-6 pb-6 pt-20 sm:px-7 sm:pb-7">
        <div className="flex-1" />

        <div className="z-10 text-right">
          <p className="mb-3 text-[1.65rem] font-semibold leading-tight text-[#1f1712]">
            {image.categories.map((category) => category.text).join(' / ')}
          </p>
          <StarRating
            className="w-full justify-between px-2"
            buttonClassName="flex-1 text-center"
            disabled={!isInCollection}
            rating={image.rating}
            starClassName="text-[3.25rem]"
            tone="dark"
            onChange={onSetRating}
          />
        </div>
      </div>
    </article>
  );
}
