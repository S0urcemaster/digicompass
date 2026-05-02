import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Tabs } from '../components/Tabs';
import { IMAGES } from '../data/images';
import { preloadImages } from '../lib/imageCache';
import { useCompassStore } from '../store/compassStore';
import type { CompassImage, ImageColor, Rating } from '../types/domain';

const VIEW_LABELS = {
  primary: 'Start',
  'focus-editor': 'Fokus-Editor',
  collection: 'Sammlung',
} as const;

const VIEW_TABS = Object.entries(VIEW_LABELS).map(([value, label]) => ({
  label,
  value: value as keyof typeof VIEW_LABELS,
}));

const COLLECTION_TABS = [
  { label: 'Bilder', value: 'images' },
  { disabled: true, label: 'Sprüche', value: 'sayings' },
  { disabled: true, label: 'Foki', value: 'foci' },
  { disabled: true, label: 'Mindsets', value: 'mindsets' },
] as const satisfies ReadonlyArray<{ disabled?: boolean; label: string; value: string }>;

type FocusTileProps = {
  focus: {
    saying: {
      text: string;
      fontSize: number;
    };
    image: {
      color: ImageColor;
      url: string;
    };
  };
  variant?: 'main' | 'preview';
};

const getImageTextColor = (imageColor: ImageColor) => {
  if (imageColor.startsWith('hell')) {
    return "#0e0601";
  }

  if (imageColor.startsWith('dunkel')) {
    return "#f1eade";
  }

  return "#0e0601";
};

const getPreviewImageUrl = (url: string) => url.replace('/images/', '/images/preview/');

const clampRating = (rating: number): Rating => Math.max(0, Math.min(1, rating));
const COLLECTION_IMAGE_PAGE_SIZE = 9;

type StarRatingProps = {
  buttonClassName?: string;
  className?: string;
  disabled?: boolean;
  rating: Rating;
  onChange?: (rating: Rating) => void;
  starClassName?: string;
  tone?: 'light' | 'dark';
};

const getCollectionUiTone = (imageColor: ImageColor): 'light' | 'dark' => {
  if (imageColor.startsWith('hell')) {
    return 'dark';
  }

  if (imageColor.startsWith('dunkel')) {
    return 'light';
  }

  return 'light';
};

const getCollectionUiClasses = (imageColor: ImageColor) => {
  const tone = getCollectionUiTone(imageColor);

  if (tone === 'dark') {
    return {
      actionButton: 'border-[#1f1712]/78 bg-[#1f1712]/88 text-[#f6efe2] backdrop-blur hover:bg-[#17110d]',
      overlay: 'from-black/84 via-black/52 to-transparent',
      metaText: 'text-white/72',
      titleText: 'text-white',
      badge: 'bg-[#1f1712]/88 text-[#f6efe2]',
      tileLabel: 'bg-[#1f1712]/82 text-white',
      tone,
    };
  }

  return {
    actionButton: 'border-white/78 bg-[#fff7ed]/90 text-[#1f1712] backdrop-blur hover:bg-[#fffaf4]',
    overlay: 'from-[#fff7ed]/96 via-[#fff7ed]/56 to-transparent',
    metaText: 'text-[#5b4330]/78',
    titleText: 'text-[#1f1712]',
    badge: 'bg-[#fff7ed]/92 text-[#1f1712]',
    tileLabel: 'bg-[#fff7ed]/92 text-[#1f1712]',
    tone,
  };
};

const getCollectionInfoUiClasses = (imageColor: ImageColor): {
  overlay: string;
  metaText: string;
  titleText: string;
  badge: string;
  tileLabel: string;
  tone: 'light' | 'dark';
} => {
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

function StarRating({
  buttonClassName,
  className,
  disabled = false,
  rating,
  onChange,
  starClassName,
  tone = 'dark',
}: StarRatingProps) {
  const filledStars = Math.round(clampRating(rating) * 5);

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ''}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = clampRating((index + 1) / 5);
        const active = index < filledStars;

        return (
          <Button
            active={active}
            align="center"
            key={starValue}
            aria-label={`Bewertung auf ${index + 1} Sterne setzen`}
            className={`${buttonClassName ?? ''} ${starClassName ?? 'text-2xl'}`}
            disabled={disabled}
            onClick={() => onChange?.(starValue)}
            tone={tone}
            variant="star"
          >
            ★
          </Button>
        );
      })}
    </div>
  );
}

function FocusTile({ focus, variant = 'preview' }: FocusTileProps) {
  const isMain = variant === 'main';

  return (
    <div
      className={`relative overflow-hidden bg-[#201a18] text-white ${
        isMain ? 'aspect-[733/1024] rounded-[24px]' : 'aspect-[733/1024] rounded-[20px]'
      }`}
    >
      <img
        alt={focus.saying.text}
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        fetchPriority={isMain ? 'high' : 'low'}
        loading={isMain ? 'eager' : 'lazy'}
        src={focus.image.url}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/65"
      />
      <div
        className={`absolute left-1/2 top-[8%] z-10 w-[88%] -translate-x-1/2 text-center font-serif leading-[1.08] drop-shadow-[0_6px_12px_rgba(0,0,0,0.48)] ${
          isMain ? '' : 'px-2'
        }`}
        style={{
          color: getImageTextColor(focus.image.color),
          fontSize: isMain
            ? `clamp(3.3rem, ${focus.saying.fontSize / 9}vw, ${focus.saying.fontSize * 2}px)`
            : `clamp(1.425rem, ${focus.saying.fontSize / 18.67}vw, ${Math.max(30, focus.saying.fontSize * 0.72)}px)`,
        }}
      >
        {focus.saying.text}
      </div>
    </div>
  );
}

type CollectionImagePanelProps = {
  image: CompassImage;
  isInCollection: boolean;
  panelClassName?: string;
  onToggleCollection: () => void;
  onOpenModal: () => void;
  onSetRating: (rating: Rating) => void;
  showImageId?: boolean;
};

function CollectionImagePanel({
  image,
  isInCollection,
  panelClassName,
  onToggleCollection,
  onOpenModal,
  onSetRating,
  showImageId = false,
}: CollectionImagePanelProps) {
  const actionUi = getCollectionUiClasses(image.color);
  const infoUi = getCollectionInfoUiClasses(image.color);

  return (
    <article
      className={`relative overflow-hidden rounded-[28px] bg-[#201a18] shadow-[0_30px_90px_rgba(32,26,24,0.28)] ${panelClassName ?? ''}`}
    >
      <img
        alt={image.categories.map((category) => category.text).join(', ')}
        className="w-full object-contain min-[900px]:h-full"
        decoding="async"
        fetchPriority="high"
        loading="eager"
        src={image.url}
      />
      {showImageId ? (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className={`rounded-full px-6 py-3 text-5xl font-semibold shadow-[0_12px_28px_rgba(0,0,0,0.18)] ${infoUi.badge}`}>
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
        tone={actionUi.tone}
        variant="overlay-action"
      >
        {isInCollection ? '✓' : '+'}
      </Button>

      <Button
        aria-label="Vergrößertes Bild öffnen"
        className="absolute right-6 top-6 z-10 h-[5.25rem] w-[5.25rem]"
        onClick={onOpenModal}
        shape="round"
        tone={actionUi.tone}
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

      <div className={`absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 bg-gradient-to-t px-6 pb-6 pt-20 sm:px-7 sm:pb-7 ${infoUi.overlay}`}>
        <div className="flex-1" />

        <div className="z-10 text-right">
          <p className={`mb-3 text-[1.65rem] font-semibold leading-tight ${infoUi.titleText}`}>
            {image.categories.map((category) => category.text).join(' / ')}
          </p>
          <StarRating
            className="w-full justify-between px-2"
            buttonClassName="flex-1 text-center"
            disabled={!isInCollection}
            rating={image.rating}
            starClassName="text-[3.25rem]"
            tone={infoUi.tone}
            onChange={onSetRating}
          />
        </div>
      </div>
    </article>
  );
}

export function App() {
  const {
    activeView,
    addCollectionImage,
    data,
    removeCollectionImage,
    selectedFocusIndex,
    selectedMindsetIndex,
    setCollectionImageRating,
    setActiveView,
    setUsername,
    selectFocus,
    selectMindset,
  } = useCompassStore();
  const [collectionImageFilter, setCollectionImageFilter] = useState('');
  const [collectionImagePage, setCollectionImagePage] = useState(0);
  const [selectedCollectionImageId, setSelectedCollectionImageId] = useState<number | null>(IMAGES[0]?.id ?? null);
  const [zoomedImageId, setZoomedImageId] = useState<number | null>(null);
  const [showCollectionImageIds, setShowCollectionImageIds] = useState(false);
  const currentMindset = data.mindsets[selectedMindsetIndex];
  const currentFocus = currentMindset?.foci[selectedFocusIndex] ?? currentMindset?.foci[0];
  const visibleFocusIndex = currentMindset?.foci.findIndex((focus) => focus === currentFocus) ?? 0;
  const remainingFoci =
    currentMindset?.foci.filter((_, index) => index !== visibleFocusIndex).slice(0, 4) ?? [];
  const normalizedImageFilter = collectionImageFilter.trim().toLowerCase();
  const filteredCollectionImages = IMAGES.filter((image) =>
    normalizedImageFilter.length === 0
      ? true
      : image.categories.some((category) => category.text.toLowerCase().includes(normalizedImageFilter))
  );
  const collectionImagePageCount = Math.max(1, Math.ceil(filteredCollectionImages.length / COLLECTION_IMAGE_PAGE_SIZE));
  const safeCollectionImagePage = Math.min(collectionImagePage, collectionImagePageCount - 1);
  const pagedCollectionImages = filteredCollectionImages.slice(
    safeCollectionImagePage * COLLECTION_IMAGE_PAGE_SIZE,
    (safeCollectionImagePage + 1) * COLLECTION_IMAGE_PAGE_SIZE
  );
  const selectedCollectionImage =
    filteredCollectionImages.find((image) => image.id === selectedCollectionImageId) ?? filteredCollectionImages[0] ?? null;
  const collectedImage = selectedCollectionImage
    ? data.collection.images.find((image) => image.id === selectedCollectionImage.id) ?? null
    : null;
  const selectedImageDetails = collectedImage ?? selectedCollectionImage;
  const zoomedImage =
    zoomedImageId === null ? null : IMAGES.find((image) => image.id === zoomedImageId) ?? null;
  const mindsetTabs = data.mindsets.map((mindset, index) => ({
    label: mindset.name,
    value: String(index),
  }));

  useEffect(() => {
    void preloadImages(IMAGES.map((image) => getPreviewImageUrl(image.url)));
  }, []);

  useEffect(() => {
    if (!selectedCollectionImage) {
      return;
    }

    void preloadImages([selectedCollectionImage.url]);
  }, [selectedCollectionImage]);

  useEffect(() => {
    if (collectionImagePage !== safeCollectionImagePage) {
      setCollectionImagePage(safeCollectionImagePage);
    }
  }, [collectionImagePage, safeCollectionImagePage]);

  useEffect(() => {
    setCollectionImagePage(0);
  }, [normalizedImageFilter]);

  useEffect(() => {
    if (selectedCollectionImageId === null && filteredCollectionImages[0]) {
      setSelectedCollectionImageId(filteredCollectionImages[0].id);
      return;
    }

    if (
      selectedCollectionImageId !== null &&
      filteredCollectionImages.length > 0 &&
      !filteredCollectionImages.some((image) => image.id === selectedCollectionImageId)
    ) {
      setSelectedCollectionImageId(filteredCollectionImages[0].id);
    }
  }, [filteredCollectionImages, selectedCollectionImageId]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-5 border-b border-amber-950/10 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Digi Compass</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Mindsets für reale Situationen</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Wähle ein Mindset, fokussiere dich auf einen visuellen Spruch und halte den Rest des Sets direkt griffbereit.
              </p>
            </div>

            <label className="block sm:min-w-[220px]" htmlFor="username">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-muted">Benutzername</span>
              <input
                id="username"
                className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={data.username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
          </div>

          <Tabs
            activeValue={activeView}
            className="grid grid-cols-1 gap-2 sm:grid-cols-3"
            items={VIEW_TABS}
            onChange={setActiveView}
            variant="nav"
          />
      </header>

      {activeView === 'primary' ? (
        currentMindset && currentFocus ? (
          <section className="mt-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Aktuelles Mindset</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">{currentMindset.name}</p>
                  </div>
                  <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    Bewertung {currentMindset.rating.toFixed(2)}
                  </div>
                </div>

                <Tabs
                  activeValue={String(selectedMindsetIndex)}
                  className="grid gap-2"
                  items={mindsetTabs}
                  onChange={(value) => selectMindset(Number(value))}
                  style={{ gridTemplateColumns: `repeat(${Math.max(data.mindsets.length, 1)}, minmax(0, 1fr))` }}
                />
              </div>

              <section className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
                <article className="overflow-hidden rounded-[24px] bg-[#201a18] text-white shadow-[0_30px_80px_rgba(32,26,24,0.32)]">
                  <FocusTile focus={currentFocus} variant="main" />
                </article>

                <section className="grid gap-3 sm:grid-cols-2 sm:grid-rows-2 lg:auto-rows-[minmax(0,0.88fr)]">
                  {remainingFoci.map((focus) => {
                    const nextIndex = currentMindset.foci.indexOf(focus);

                    return (
                      <Button
                        align="left"
                        key={`${focus.saying.id}-${focus.image.id}`}
                        className="overflow-hidden rounded-[20px] bg-[#201a18] shadow-[0_18px_48px_rgba(32,26,24,0.22)] hover:shadow-[0_22px_56px_rgba(32,26,24,0.28)]"
                        onClick={() => selectFocus(nextIndex)}
                        variant="surface"
                      >
                        <FocusTile focus={focus} />
                      </Button>
                    );
                  })}
                </section>
              </section>

              <section className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] bg-[#f4e8d5] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Fokus-Bewertung</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">{currentFocus.rating.toFixed(2)}</p>
                </div>
                <div className="rounded-[20px] bg-[#e8efe8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Kategorien</p>
                  <p className="mt-2 text-sm leading-6 text-ink">
                    {currentFocus.saying.categories.map((category) => category.text).join(' / ')}
                  </p>
                </div>
                <div className="rounded-[20px] bg-[#e4ebf1] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Notizen</p>
                  <p className="mt-2 text-sm leading-6 text-ink">{currentFocus.notes || 'Noch keine Notizen.'}</p>
                </div>
              </section>
          </section>
        ) : (
          <p className="mt-6 text-sm text-muted">Keine Mindset-Daten verfügbar.</p>
        )
      ) : activeView === 'collection' ? (
        <section className="mt-6 space-y-5">
            <Tabs
              activeValue="images"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              items={[...COLLECTION_TABS]}
            />

            <section>
              {selectedCollectionImage && selectedImageDetails ? (
                <div className="grid gap-x-5 gap-y-4 min-[900px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] min-[900px]:items-start">
                  <label className="block" htmlFor="collection-image-filter">
                    <input
                      id="collection-image-filter"
                      className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                      placeholder="Kategorie eingeben, z. B. Freiheit oder Erkenntnis"
                      value={collectionImageFilter}
                      onChange={(event) => setCollectionImageFilter(event.target.value)}
                    />
                  </label>

                  <div>
                    {filteredCollectionImages.length > 0 ? (
                      <div className="flex items-center gap-3">
                        <Button
                          aria-label="Vorherige Bildseite"
                          className="flex-1"
                          disabled={safeCollectionImagePage === 0}
                          fullWidth
                          onClick={() => setCollectionImagePage((page) => Math.max(0, page - 1))}
                          shape="pill"
                          variant="pager"
                        >
                          ←
                        </Button>
                        <div className="min-w-[6rem] text-center text-base font-semibold text-muted">
                          {safeCollectionImagePage + 1} / {collectionImagePageCount}
                        </div>
                        <Button
                          aria-label="Nächste Bildseite"
                          className="flex-1"
                          disabled={safeCollectionImagePage >= collectionImagePageCount - 1}
                          fullWidth
                          onClick={() =>
                            setCollectionImagePage((page) => Math.min(collectionImagePageCount - 1, page + 1))
                          }
                          shape="pill"
                          variant="pager"
                        >
                          →
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  <CollectionImagePanel
                    image={selectedImageDetails}
                    isInCollection={Boolean(collectedImage)}
                    onOpenModal={() => setZoomedImageId(selectedCollectionImage.id)}
                    onSetRating={(rating) => setCollectionImageRating(selectedCollectionImage.id, rating)}
                    showImageId={showCollectionImageIds}
                    onToggleCollection={() =>
                      collectedImage
                        ? removeCollectionImage(selectedCollectionImage.id)
                        : addCollectionImage(selectedCollectionImage)
                    }
                  />

                  <section className="flex min-h-0 flex-col">
                    {filteredCollectionImages.length > 0 ? (
                      <div className="pr-1">
                        <div className="grid grid-cols-3 gap-3">
                          {pagedCollectionImages.map((image) => {
                            const isSelected = image.id === selectedCollectionImage.id;
                            const isCollected = data.collection.images.some((entry) => entry.id === image.id);
                            const infoUi = getCollectionInfoUiClasses(image.color);

                            return (
                              <Button
                                align="left"
                                key={image.id}
                                className="group relative overflow-hidden rounded-[18px]"
                                onClick={() => setSelectedCollectionImageId(image.id)}
                                selected={isSelected}
                                variant="surface"
                              >
                                <img
                                  alt={image.categories.map((category) => category.text).join(', ')}
                                  className="aspect-[733/1024] w-full object-cover"
                                  decoding="async"
                                  loading="lazy"
                                  src={getPreviewImageUrl(image.url)}
                                />
                                {showCollectionImageIds ? (
                                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                                    <div className={`rounded-full px-4 py-2 text-3xl font-semibold shadow-[0_10px_22px_rgba(0,0,0,0.16)] ${infoUi.badge}`}>
                                      {image.id}
                                    </div>
                                  </div>
                                ) : null}
                                <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t px-2 pb-2 pt-8 ${infoUi.overlay}`}>
                                  <p className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${infoUi.tileLabel}`}>
                                    {image.categories[0]?.text ?? 'Unsortiert'}
                                  </p>
                                </div>
                                {isCollected ? (
                                  <div className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${infoUi.badge}`}>
                                    Hinzugefügt
                                  </div>
                                ) : null}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                        <p className="text-sm text-muted">Keine Bilder passen zu diesem Kategorienfilter.</p>
                      </div>
                    )}
                  </section>
                </div>
              ) : (
                <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                  <p className="text-sm text-muted">Für diesen Filter sind keine Bilder verfügbar.</p>
                </div>
              )}

              <form className="mt-5">
                <label className="inline-flex items-center gap-3 rounded-full border border-amber-950/10 bg-white/80 px-4 py-3 text-sm text-ink">
                  <Button
                    active={showCollectionImageIds}
                    aria-pressed={showCollectionImageIds}
                    className="relative h-7 w-12"
                    onClick={() => setShowCollectionImageIds((value) => !value)}
                    shape="pill"
                    variant="toggle"
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        showCollectionImageIds ? 'left-6' : 'left-1'
                      }`}
                    />
                  </Button>
                  <span>Image-ID in der Kartenmitte anzeigen</span>
                </label>
              </form>
            </section>

            {zoomedImage ? (
              <Button
                aria-label="Vergrößertes Bild schließen"
                className="fixed inset-0 z-50 px-4 py-6"
                onClick={() => setZoomedImageId(null)}
                variant="scrim"
              >
                <img
                  alt={zoomedImage.categories.map((category) => category.text).join(', ')}
                  className="max-h-full max-w-full rounded-[24px] object-contain shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
                  decoding="async"
                  loading="eager"
                  src={zoomedImage.url}
                />
              </Button>
            ) : null}
        </section>
      ) : (
        <section className="mt-6 rounded-[24px] border border-dashed border-amber-950/15 bg-[#fbf6ec] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{VIEW_LABELS[activeView]}</p>
          <h2 className="mt-2 text-2xl font-semibold text-ink">Im Store vorbereitet, aber noch nicht gestaltet</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Der Fokus-Editor ist der nächste Screen nach den Sammlungsbildern. Sein Zustand existiert bereits, aber
            seine UI ist bewusst noch ausstehend.
          </p>
        </section>
      )}
    </main>
  );
}
