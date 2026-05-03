import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import { Tabs } from '../../../components/Tabs';
import { IMAGES } from '../../../data/images';
import { SAYINGS } from '../../../data/sayings';
import { preloadImages } from '../../../lib/imageCache';
import type { CompassImage, Focus, Saying } from '../../../types/domain';
import { CollectionImagePanel } from './CollectionImagePanel';
import { StarRating } from '../shared/StarRating';
import {
  getImageBadgeClassName,
  getImageBottomOverlayClassName,
  getImageIdBadgeClassName,
  getImageOverlayTone,
  getImageStarContainerClassName,
} from './imageOverlayTone';

const COLLECTION_TABS = [
  { label: 'Bilder', value: 'images' },
  { label: 'Sprüche', value: 'sayings' },
  { label: 'Foki', value: 'foci' },
  { disabled: true, label: 'Mindsets', value: 'mindsets' },
] as const satisfies ReadonlyArray<{ disabled?: boolean; label: string; value: string }>;

const COLLECTION_IMAGE_PAGE_SIZE = 9;
const COLLECTION_FOCUS_PAGE_SIZE = 9;
const COLLECTION_SAYING_PAGE_SIZE = 5;

const getPreviewImageUrl = (url: string) => url.replace('/images/', '/images/preview/');
const getFocusKey = (focus: Focus) => `${focus.saying.id}:${focus.image.id}`;

const getSayingFontSize = (fontSize: number, expanded = false) =>
  expanded
    ? `clamp(2rem, ${fontSize / 12}vw, ${fontSize * 1.08}px)`
    : `clamp(1.35rem, ${fontSize / 16.2}vw, ${Math.max(29, fontSize * 0.7)}px)`;

type CollectionTabValue = (typeof COLLECTION_TABS)[number]['value'];

type CollectionViewProps = {
  collectionFoci: Focus[];
  collectionImages: CompassImage[];
  collectionSayings: Saying[];
  addCollectionImage: (image: CompassImage) => void;
  addCollectionSaying: (saying: Saying) => void;
  setCollectionFocusRating: (focusKey: string, rating: number) => void;
  setCollectionImageRating: (imageId: number, rating: number) => void;
  setCollectionSayingRating: (sayingId: number, rating: number) => void;
};

export function CollectionView({
  collectionFoci,
  collectionImages,
  collectionSayings,
  addCollectionImage,
  addCollectionSaying,
  setCollectionFocusRating,
  setCollectionImageRating,
  setCollectionSayingRating,
}: CollectionViewProps) {
  const [activeTab, setActiveTab] = useState<CollectionTabValue>('foci');
  const [collectionFocusFilter, setCollectionFocusFilter] = useState('');
  const [collectionFocusPage, setCollectionFocusPage] = useState(0);
  const [focusEditorImageFilter, setFocusEditorImageFilter] = useState('');
  const [focusEditorImagePage, setFocusEditorImagePage] = useState(0);
  const [focusEditorSayingFilter, setFocusEditorSayingFilter] = useState('');
  const [focusEditorSayingPage, setFocusEditorSayingPage] = useState(0);
  const [collectionImageFilter, setCollectionImageFilter] = useState('');
  const [collectionImagePage, setCollectionImagePage] = useState(0);
  const [selectedCollectionFocusKey, setSelectedCollectionFocusKey] = useState<string | null>(null);
  const [selectedFocusEditorImageId, setSelectedFocusEditorImageId] = useState<number | null>(null);
  const [selectedCollectionImageId, setSelectedCollectionImageId] = useState<number | null>(IMAGES[0]?.id ?? null);
  const [zoomedImageId, setZoomedImageId] = useState<number | null>(null);
  const [showCollectionImageIds, setShowCollectionImageIds] = useState(true);
  const [collectionSayingFilter, setCollectionSayingFilter] = useState('');
  const [collectionSayingPage, setCollectionSayingPage] = useState(0);
  const [selectedFocusEditorSayingId, setSelectedFocusEditorSayingId] = useState<number | null>(null);
  const [selectedCollectionSayingId, setSelectedCollectionSayingId] = useState<number | null>(SAYINGS[0]?.id ?? null);
  const [showCollectionSayingIds, setShowCollectionSayingIds] = useState(true);

  const normalizedFocusFilter = collectionFocusFilter.trim().toLowerCase();
  const normalizedFocusEditorImageFilter = focusEditorImageFilter.trim().toLowerCase();
  const normalizedFocusEditorSayingFilter = focusEditorSayingFilter.trim().toLowerCase();
  const normalizedImageFilter = collectionImageFilter.trim().toLowerCase();
  const normalizedSayingFilter = collectionSayingFilter.trim().toLowerCase();

  const filteredCollectionFoci = collectionFoci.filter((focus) =>
    normalizedFocusFilter.length === 0
      ? true
      : focus.image.categories.some((category) => category.text.toLowerCase().includes(normalizedFocusFilter)) ||
          focus.saying.categories.some((category) => category.text.toLowerCase().includes(normalizedFocusFilter))
  );
  const collectionFocusPageCount = Math.max(1, Math.ceil(filteredCollectionFoci.length / COLLECTION_FOCUS_PAGE_SIZE));
  const safeCollectionFocusPage = Math.min(collectionFocusPage, collectionFocusPageCount - 1);
  const pagedCollectionFoci = filteredCollectionFoci.slice(
    safeCollectionFocusPage * COLLECTION_FOCUS_PAGE_SIZE,
    (safeCollectionFocusPage + 1) * COLLECTION_FOCUS_PAGE_SIZE
  );
  const selectedCollectionFocus =
    filteredCollectionFoci.find((focus) => getFocusKey(focus) === selectedCollectionFocusKey) ?? filteredCollectionFoci[0] ?? null;

  const filteredFocusEditorImages = collectionImages.filter((image) =>
    normalizedFocusEditorImageFilter.length === 0
      ? true
      : image.categories.some((category) => category.text.toLowerCase().includes(normalizedFocusEditorImageFilter))
  );
  const focusEditorImagePageCount = Math.max(1, Math.ceil(filteredFocusEditorImages.length / COLLECTION_IMAGE_PAGE_SIZE));
  const safeFocusEditorImagePage = Math.min(focusEditorImagePage, focusEditorImagePageCount - 1);
  const pagedFocusEditorImages = filteredFocusEditorImages.slice(
    safeFocusEditorImagePage * COLLECTION_IMAGE_PAGE_SIZE,
    (safeFocusEditorImagePage + 1) * COLLECTION_IMAGE_PAGE_SIZE
  );
  const selectedFocusEditorImage =
    filteredFocusEditorImages.find((image) => image.id === selectedFocusEditorImageId) ?? filteredFocusEditorImages[0] ?? null;

  const filteredFocusEditorSayings = collectionSayings.filter((saying) =>
    normalizedFocusEditorSayingFilter.length === 0
      ? true
      : saying.categories.some((category) => category.text.toLowerCase().includes(normalizedFocusEditorSayingFilter))
  );
  const focusEditorSayingPageCount = Math.max(1, Math.ceil(filteredFocusEditorSayings.length / COLLECTION_SAYING_PAGE_SIZE));
  const safeFocusEditorSayingPage = Math.min(focusEditorSayingPage, focusEditorSayingPageCount - 1);
  const pagedFocusEditorSayings = filteredFocusEditorSayings.slice(
    safeFocusEditorSayingPage * COLLECTION_SAYING_PAGE_SIZE,
    (safeFocusEditorSayingPage + 1) * COLLECTION_SAYING_PAGE_SIZE
  );
  const selectedFocusEditorSaying =
    filteredFocusEditorSayings.find((saying) => saying.id === selectedFocusEditorSayingId) ?? filteredFocusEditorSayings[0] ?? null;

  const collectionImageById = new Map(collectionImages.map((image) => [image.id, image] as const));
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
  const collectedImage = selectedCollectionImage ? collectionImageById.get(selectedCollectionImage.id) ?? null : null;
  const selectedImageDetails = collectedImage ?? selectedCollectionImage;
  const zoomedImage = zoomedImageId === null ? null : IMAGES.find((image) => image.id === zoomedImageId) ?? null;

  const collectionSayingById = new Map(collectionSayings.map((saying) => [saying.id, saying] as const));
  const filteredCollectionSayings = SAYINGS.filter((saying) =>
    normalizedSayingFilter.length === 0
      ? true
      : saying.categories.some((category) => category.text.toLowerCase().includes(normalizedSayingFilter))
  );
  const collectionSayingPageCount = Math.max(1, Math.ceil(filteredCollectionSayings.length / COLLECTION_SAYING_PAGE_SIZE));
  const safeCollectionSayingPage = Math.min(collectionSayingPage, collectionSayingPageCount - 1);
  const pagedCollectionSayings = filteredCollectionSayings.slice(
    safeCollectionSayingPage * COLLECTION_SAYING_PAGE_SIZE,
    (safeCollectionSayingPage + 1) * COLLECTION_SAYING_PAGE_SIZE
  );

  const handleSetSelectedImageRating = (rating: number) => {
    if (!selectedCollectionImage) {
      return;
    }

    if (!collectedImage) {
      addCollectionImage({ ...selectedCollectionImage, rating });
      return;
    }

    setCollectionImageRating(selectedCollectionImage.id, rating);
  };

  const handleSetSayingRating = (saying: Saying, rating: number) => {
    const existingSaying = collectionSayingById.get(saying.id) ?? null;

    if (!existingSaying) {
      addCollectionSaying({ ...saying, rating });
      return;
    }

    setCollectionSayingRating(saying.id, rating);
  };

  const handleSetFocusRating = (focus: Focus, rating: number) => {
    setCollectionFocusRating(getFocusKey(focus), rating);
  };

  useEffect(() => {
    void preloadImages(IMAGES.map((image) => getPreviewImageUrl(image.url)));
  }, []);

  useEffect(() => {
    if (collectionFocusPage !== safeCollectionFocusPage) {
      setCollectionFocusPage(safeCollectionFocusPage);
    }
  }, [collectionFocusPage, safeCollectionFocusPage]);

  useEffect(() => {
    setCollectionFocusPage(0);
  }, [normalizedFocusFilter]);

  useEffect(() => {
    if (focusEditorImagePage !== safeFocusEditorImagePage) {
      setFocusEditorImagePage(safeFocusEditorImagePage);
    }
  }, [focusEditorImagePage, safeFocusEditorImagePage]);

  useEffect(() => {
    setFocusEditorImagePage(0);
  }, [normalizedFocusEditorImageFilter]);

  useEffect(() => {
    if (selectedFocusEditorImageId === null && filteredFocusEditorImages[0]) {
      setSelectedFocusEditorImageId(filteredFocusEditorImages[0].id);
      return;
    }

    if (
      selectedFocusEditorImageId !== null &&
      filteredFocusEditorImages.length > 0 &&
      !filteredFocusEditorImages.some((image) => image.id === selectedFocusEditorImageId)
    ) {
      setSelectedFocusEditorImageId(filteredFocusEditorImages[0].id);
    }
  }, [filteredFocusEditorImages, selectedFocusEditorImageId]);

  useEffect(() => {
    if (focusEditorSayingPage !== safeFocusEditorSayingPage) {
      setFocusEditorSayingPage(safeFocusEditorSayingPage);
    }
  }, [focusEditorSayingPage, safeFocusEditorSayingPage]);

  useEffect(() => {
    setFocusEditorSayingPage(0);
  }, [normalizedFocusEditorSayingFilter]);

  useEffect(() => {
    if (selectedFocusEditorSayingId === null && filteredFocusEditorSayings[0]) {
      setSelectedFocusEditorSayingId(filteredFocusEditorSayings[0].id);
      return;
    }

    if (
      selectedFocusEditorSayingId !== null &&
      filteredFocusEditorSayings.length > 0 &&
      !filteredFocusEditorSayings.some((saying) => saying.id === selectedFocusEditorSayingId)
    ) {
      setSelectedFocusEditorSayingId(filteredFocusEditorSayings[0].id);
    }
  }, [filteredFocusEditorSayings, selectedFocusEditorSayingId]);

  useEffect(() => {
    if (selectedCollectionFocusKey === null && filteredCollectionFoci[0]) {
      setSelectedCollectionFocusKey(getFocusKey(filteredCollectionFoci[0]));
      return;
    }

    if (
      selectedCollectionFocusKey !== null &&
      filteredCollectionFoci.length > 0 &&
      !filteredCollectionFoci.some((focus) => getFocusKey(focus) === selectedCollectionFocusKey)
    ) {
      setSelectedCollectionFocusKey(getFocusKey(filteredCollectionFoci[0]));
    }
  }, [filteredCollectionFoci, selectedCollectionFocusKey]);

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

  useEffect(() => {
    if (collectionSayingPage !== safeCollectionSayingPage) {
      setCollectionSayingPage(safeCollectionSayingPage);
    }
  }, [collectionSayingPage, safeCollectionSayingPage]);

  useEffect(() => {
    setCollectionSayingPage(0);
  }, [normalizedSayingFilter]);

  useEffect(() => {
    if (selectedCollectionSayingId === null && filteredCollectionSayings[0]) {
      setSelectedCollectionSayingId(filteredCollectionSayings[0].id);
      return;
    }

    if (
      selectedCollectionSayingId !== null &&
      filteredCollectionSayings.length > 0 &&
      !filteredCollectionSayings.some((saying) => saying.id === selectedCollectionSayingId)
    ) {
      setSelectedCollectionSayingId(filteredCollectionSayings[0].id);
    }
  }, [filteredCollectionSayings, selectedCollectionSayingId]);

  return (
    <section className="mt-6 space-y-5">
      <Tabs
        activeValue={activeTab}
        className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        items={[...COLLECTION_TABS]}
        onChange={setActiveTab}
      />

      <section>
        {activeTab === 'images' ? (
          selectedCollectionImage && selectedImageDetails ? (
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
                      onClick={() => setCollectionImagePage((page) => Math.min(collectionImagePageCount - 1, page + 1))}
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
                onOpenModal={() => setZoomedImageId(selectedCollectionImage.id)}
                onSetRating={handleSetSelectedImageRating}
                showImageId={showCollectionImageIds}
              />

              <section className="flex min-h-0 flex-col">
                {filteredCollectionImages.length > 0 ? (
                  <div className="pr-1">
                    <div className="grid grid-cols-3 gap-3">
                      {pagedCollectionImages.map((image) => {
                        const isSelected = image.id === selectedCollectionImage.id;
                        const collectedListImage = collectionImageById.get(image.id) ?? null;
                        const previewRating = collectedListImage?.rating ?? 0;
                        const overlayTone = getImageOverlayTone(image.color);

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
                                <div
                                  className={`rounded-full px-4 py-2 text-3xl font-semibold ${getImageIdBadgeClassName(overlayTone)}`}
                                >
                                  {image.id}
                                </div>
                              </div>
                            ) : null}
                            <div className="absolute left-2 top-2">
                              <p
                                className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
                              >
                                {image.categories[0]?.text ?? 'Unsortiert'}
                              </p>
                            </div>
                            <div
                              className={`absolute inset-x-0 bottom-0 px-2 pb-2 pt-8 ${getImageBottomOverlayClassName(overlayTone)}`}
                            >
                              <StarRating
                                className={`w-full justify-center gap-0.5 rounded-full px-1.5 py-1 ${getImageStarContainerClassName(overlayTone)}`}
                                disabled
                                rating={previewRating}
                                starClassName="text-[0.9rem]"
                                tone={overlayTone}
                              />
                            </div>
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
          )
        ) : activeTab === 'sayings' ? (
          filteredCollectionSayings.length > 0 ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 items-center">
                <label className="block" htmlFor="collection-saying-filter">
                  <input
                    id="collection-saying-filter"
                    className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Kategorie eingeben, z. B. Freiheit oder Erkenntnis"
                    value={collectionSayingFilter}
                    onChange={(event) => setCollectionSayingFilter(event.target.value)}
                  />
                </label>

                {filteredCollectionSayings.length > 0 ? (
                  <div className="flex items-center gap-3">
                    <Button
                      aria-label="Vorherige Spruchseite"
                      className="flex-1"
                      disabled={safeCollectionSayingPage === 0}
                      fullWidth
                      onClick={() => setCollectionSayingPage((page) => Math.max(0, page - 1))}
                      shape="pill"
                      variant="pager"
                    >
                      ←
                    </Button>
                    <div className="min-w-[6rem] text-center text-base font-semibold text-muted">
                      {safeCollectionSayingPage + 1} / {collectionSayingPageCount}
                    </div>
                    <Button
                      aria-label="Nächste Spruchseite"
                      className="flex-1"
                      disabled={safeCollectionSayingPage >= collectionSayingPageCount - 1}
                      fullWidth
                      onClick={() => setCollectionSayingPage((page) => Math.min(collectionSayingPageCount - 1, page + 1))}
                      shape="pill"
                      variant="pager"
                    >
                      →
                    </Button>
                  </div>
                ) : null}
              </div>

              <section className="flex min-h-0 flex-col">
                <div className="pr-1">
                  <div className="grid grid-cols-1 gap-3">
                    {pagedCollectionSayings.map((saying) => {
                      const collectedListSaying = collectionSayingById.get(saying.id) ?? null;
                      const previewRating = collectedListSaying?.rating ?? 0;

                      return (
                        <article
                          key={saying.id}
                          className="relative overflow-hidden border border-amber-950/12 bg-[var(--button-bg-light)] transition"
                        >
                          <button
                            className="absolute inset-0 z-0"
                            aria-label={`Spruch ${saying.id} auswählen`}
                            onClick={() => setSelectedCollectionSayingId(saying.id)}
                            type="button"
                          />
                          <div className="relative z-10 flex h-full flex-col gap-3 px-4 py-3 sm:px-5">
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <div className="flex items-start justify-between gap-3">
                                <div
                                  className={`min-w-0 ${showCollectionSayingIds ? 'grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2' : 'block'}`}
                                >
                                  {showCollectionSayingIds ? (
                                    <div className="border border-amber-950/12 bg-[var(--button-bg-light)] px-2.5 py-1 text-sm font-semibold text-[#1f1712]">
                                      {saying.id}
                                    </div>
                                  ) : null}
                                  <p className="min-w-0 border border-amber-950/12 bg-[var(--button-bg-light)] px-2.5 py-1 text-[32px] font-medium text-[#6c6258]">
                                    {saying.categories.length > 0
                                      ? saying.categories.map((category) => category.text).join('   ')
                                      : 'Unsortiert'}
                                  </p>
                                </div>
                                <StarRating
                                  className="relative z-10 shrink-0 items-start justify-center self-start border border-amber-950/12 bg-[var(--button-bg-light)] px-2 py-0 text-[#1f1712]"
                                  rating={previewRating}
                                  buttonClassName="flex h-[1.9rem] w-[1.9rem] items-center justify-center p-0 leading-none"
                                  starClassName="text-[2.3rem] leading-none"
                                  tone="dark"
                                  onChange={(rating) => handleSetSayingRating(saying, rating)}
                                />
                              </div>
                              <p
                                className="w-full font-semibold tracking-[-0.04em] text-[#1f1712]"
                                style={{ fontSize: getSayingFontSize(saying.fontSize), lineHeight: 1.1 }}
                              >
                                {saying.text}
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
              <p className="text-sm text-muted">Für diesen Filter sind keine Sprüche verfügbar.</p>
            </div>
          )
        ) : activeTab === 'foci' ? (
          selectedCollectionFocus ? (
            <div className="space-y-8">
              <div className="grid gap-x-5 gap-y-4 min-[900px]:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] min-[900px]:items-start">
                <label className="block" htmlFor="collection-focus-filter">
                  <input
                    id="collection-focus-filter"
                    className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                    placeholder="Kategorie eingeben, z. B. Freiheit oder Erkenntnis"
                    value={collectionFocusFilter}
                    onChange={(event) => setCollectionFocusFilter(event.target.value)}
                  />
                </label>

                <div>
                  {filteredCollectionFoci.length > 0 ? (
                    <div className="flex items-center gap-3">
                      <Button
                        aria-label="Vorherige Fokusseite"
                        className="flex-1"
                        disabled={safeCollectionFocusPage === 0}
                        fullWidth
                        onClick={() => setCollectionFocusPage((page) => Math.max(0, page - 1))}
                        shape="pill"
                        variant="pager"
                      >
                        ←
                      </Button>
                      <div className="min-w-[6rem] text-center text-base font-semibold text-muted">
                        {safeCollectionFocusPage + 1} / {collectionFocusPageCount}
                      </div>
                      <Button
                        aria-label="Nächste Fokusseite"
                        className="flex-1"
                        disabled={safeCollectionFocusPage >= collectionFocusPageCount - 1}
                        fullWidth
                        onClick={() => setCollectionFocusPage((page) => Math.min(collectionFocusPageCount - 1, page + 1))}
                        shape="pill"
                        variant="pager"
                      >
                        →
                      </Button>
                    </div>
                  ) : null}
                </div>

                <CollectionImagePanel
                  image={{ ...selectedCollectionFocus.image, rating: selectedCollectionFocus.rating }}
                  onOpenModal={() => setZoomedImageId(selectedCollectionFocus.image.id)}
                  onSetRating={(rating) => handleSetFocusRating(selectedCollectionFocus, rating)}
                  topContent={
                    <div className="max-w-[26rem] rounded-[24px] bg-black/32 px-5 py-4 text-left text-white shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-[3px]">
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/80">
                        {selectedCollectionFocus.image.categories[0]?.text ?? 'Unsortiert'}
                      </p>
                      <p
                        className="mt-3 font-semibold tracking-[-0.04em] text-white"
                        style={{ fontSize: getSayingFontSize(selectedCollectionFocus.saying.fontSize), lineHeight: 1.08 }}
                      >
                        {selectedCollectionFocus.saying.text}
                      </p>
                    </div>
                  }
                />

                <section className="flex min-h-0 flex-col">
                  {filteredCollectionFoci.length > 0 ? (
                    <div className="pr-1">
                      <div className="grid grid-cols-3 gap-3">
                        {pagedCollectionFoci.map((focus) => {
                          const focusKey = getFocusKey(focus);
                          const isSelected = focusKey === getFocusKey(selectedCollectionFocus);
                          const overlayTone = getImageOverlayTone(focus.image.color);

                          return (
                            <Button
                              align="left"
                              key={focusKey}
                              className="group relative overflow-hidden rounded-[18px]"
                              onClick={() => setSelectedCollectionFocusKey(focusKey)}
                              selected={isSelected}
                              variant="surface"
                            >
                              <img
                                alt={focus.image.categories.map((category) => category.text).join(', ')}
                                className="aspect-[733/1024] w-full object-cover"
                                decoding="async"
                                loading="lazy"
                                src={getPreviewImageUrl(focus.image.url)}
                              />
                              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-2">
                                <div className="rounded-[14px] bg-black/32 px-3 py-2 text-left text-white shadow-[0_12px_30px_rgba(0,0,0,0.2)] backdrop-blur-[3px]">
                                  <p className="line-clamp-4 text-sm font-semibold leading-[1.05] tracking-[-0.04em]">
                                    {focus.saying.text}
                                  </p>
                                </div>
                              </div>
                              <div className="absolute left-2 top-2 pt-[5.8rem]">
                                <p
                                  className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
                                >
                                  {focus.image.categories[0]?.text ?? 'Unsortiert'}
                                </p>
                              </div>
                              <div
                                className={`absolute inset-x-0 bottom-0 px-2 pb-2 pt-8 ${getImageBottomOverlayClassName(overlayTone)}`}
                              >
                                <StarRating
                                  className={`w-full justify-center gap-0.5 rounded-full px-1.5 py-1 ${getImageStarContainerClassName(overlayTone)}`}
                                  disabled
                                  rating={focus.rating}
                                  starClassName="text-[0.9rem]"
                                  tone={overlayTone}
                                />
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                      <p className="text-sm text-muted">Keine Foki passen zu diesem Kategorienfilter.</p>
                    </div>
                  )}
                </section>
              </div>

              <section className="space-y-4 rounded-[28px] border border-amber-950/10 bg-white/55 p-4 shadow-[0_22px_60px_rgba(76,59,48,0.08)] sm:p-5">
                <div className="flex flex-col gap-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Editor</p>
                  <h3 className="text-xl font-semibold tracking-tight text-ink">Bilder und Sprüche aus deiner Sammlung</h3>
                </div>

                <div className="grid gap-5 min-[980px]:grid-cols-2 min-[980px]:items-start">
                  <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label className="block flex-1" htmlFor="focus-editor-image-filter">
                        <input
                          id="focus-editor-image-filter"
                          className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                          placeholder="User-Bilder nach Kategorie filtern"
                          value={focusEditorImageFilter}
                          onChange={(event) => setFocusEditorImageFilter(event.target.value)}
                        />
                      </label>

                      {filteredFocusEditorImages.length > 0 ? (
                        <div className="flex items-center gap-3 sm:w-[15rem]">
                          <Button
                            aria-label="Vorherige User-Bildseite"
                            className="flex-1"
                            disabled={safeFocusEditorImagePage === 0}
                            fullWidth
                            onClick={() => setFocusEditorImagePage((page) => Math.max(0, page - 1))}
                            shape="pill"
                            variant="pager"
                          >
                            ←
                          </Button>
                          <div className="min-w-[5.5rem] text-center text-base font-semibold text-muted">
                            {safeFocusEditorImagePage + 1} / {focusEditorImagePageCount}
                          </div>
                          <Button
                            aria-label="Nächste User-Bildseite"
                            className="flex-1"
                            disabled={safeFocusEditorImagePage >= focusEditorImagePageCount - 1}
                            fullWidth
                            onClick={() =>
                              setFocusEditorImagePage((page) => Math.min(focusEditorImagePageCount - 1, page + 1))
                            }
                            shape="pill"
                            variant="pager"
                          >
                            →
                          </Button>
                        </div>
                      ) : null}
                    </div>

                    {filteredFocusEditorImages.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {pagedFocusEditorImages.map((image) => {
                          const isSelected = image.id === selectedFocusEditorImage?.id;
                          const overlayTone = getImageOverlayTone(image.color);

                          return (
                            <Button
                              align="left"
                              key={image.id}
                              className="group relative overflow-hidden rounded-[18px]"
                              onClick={() => setSelectedFocusEditorImageId(image.id)}
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
                              <div className="absolute left-2 top-2">
                                <p
                                  className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${getImageBadgeClassName(overlayTone)}`}
                                >
                                  {image.categories[0]?.text ?? 'Unsortiert'}
                                </p>
                              </div>
                              <div
                                className={`absolute inset-x-0 bottom-0 px-2 pb-2 pt-8 ${getImageBottomOverlayClassName(overlayTone)}`}
                              >
                                <StarRating
                                  className={`w-full justify-center gap-0.5 rounded-full px-1.5 py-1 ${getImageStarContainerClassName(overlayTone)}`}
                                  disabled
                                  rating={image.rating}
                                  starClassName="text-[0.9rem]"
                                  tone={overlayTone}
                                />
                              </div>
                            </Button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                        <p className="text-sm text-muted">In deiner Sammlung passen keine Bilder zu diesem Filter.</p>
                      </div>
                    )}
                  </section>

                  <section className="space-y-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <label className="block flex-1" htmlFor="focus-editor-saying-filter">
                        <input
                          id="focus-editor-saying-filter"
                          className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                          placeholder="User-Sprüche nach Kategorie filtern"
                          value={focusEditorSayingFilter}
                          onChange={(event) => setFocusEditorSayingFilter(event.target.value)}
                        />
                      </label>

                      {filteredFocusEditorSayings.length > 0 ? (
                        <div className="flex items-center gap-3 sm:w-[15rem]">
                          <Button
                            aria-label="Vorherige User-Spruchseite"
                            className="flex-1"
                            disabled={safeFocusEditorSayingPage === 0}
                            fullWidth
                            onClick={() => setFocusEditorSayingPage((page) => Math.max(0, page - 1))}
                            shape="pill"
                            variant="pager"
                          >
                            ←
                          </Button>
                          <div className="min-w-[5.5rem] text-center text-base font-semibold text-muted">
                            {safeFocusEditorSayingPage + 1} / {focusEditorSayingPageCount}
                          </div>
                          <Button
                            aria-label="Nächste User-Spruchseite"
                            className="flex-1"
                            disabled={safeFocusEditorSayingPage >= focusEditorSayingPageCount - 1}
                            fullWidth
                            onClick={() =>
                              setFocusEditorSayingPage((page) => Math.min(focusEditorSayingPageCount - 1, page + 1))
                            }
                            shape="pill"
                            variant="pager"
                          >
                            →
                          </Button>
                        </div>
                      ) : null}
                    </div>

                    {filteredFocusEditorSayings.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3">
                        {pagedFocusEditorSayings.map((saying) => {
                          const isSelected = saying.id === selectedFocusEditorSaying?.id;

                          return (
                            <article
                              key={saying.id}
                              className={`relative overflow-hidden border border-amber-950/12 bg-[var(--button-bg-light)] transition ${
                                isSelected ? 'ring-2 ring-accent/40' : ''
                              }`}
                            >
                              <button
                                className="absolute inset-0 z-0"
                                aria-label={`User-Spruch ${saying.id} auswählen`}
                                onClick={() => setSelectedFocusEditorSayingId(saying.id)}
                                type="button"
                              />
                              <div className="relative z-10 flex h-full flex-col gap-3 px-4 py-3 sm:px-5">
                                <div className="flex min-w-0 flex-1 flex-col gap-2">
                                  <div className="flex items-start justify-between gap-3">
                                    <p className="min-w-0 border border-amber-950/12 bg-[var(--button-bg-light)] px-2.5 py-1 text-[32px] font-medium text-[#6c6258]">
                                      {saying.categories.length > 0
                                        ? saying.categories.map((category) => category.text).join('   ')
                                        : 'Unsortiert'}
                                    </p>
                                    <StarRating
                                      className="relative z-10 shrink-0 items-start justify-center self-start border border-amber-950/12 bg-[var(--button-bg-light)] px-2 py-0 text-[#1f1712]"
                                      rating={saying.rating}
                                      buttonClassName="flex h-[1.9rem] w-[1.9rem] items-center justify-center p-0 leading-none"
                                      starClassName="text-[2.3rem] leading-none"
                                      tone="dark"
                                      onChange={(rating) => handleSetSayingRating(saying, rating)}
                                    />
                                  </div>
                                  <p
                                    className="w-full font-semibold tracking-[-0.04em] text-[#1f1712]"
                                    style={{ fontSize: getSayingFontSize(saying.fontSize), lineHeight: 1.1 }}
                                  >
                                    {saying.text}
                                  </p>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
                        <p className="text-sm text-muted">In deiner Sammlung passen keine Sprüche zu diesem Filter.</p>
                      </div>
                    )}
                  </section>
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
              <p className="text-sm text-muted">In deiner Sammlung sind noch keine Foki verfügbar.</p>
            </div>
          )
        ) : (
          <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
            <p className="text-sm text-muted">Dieser Bereich ist noch nicht umgesetzt.</p>
          </div>
        )}

        {activeTab === 'images' || activeTab === 'sayings' ? (
          <form className="mt-5">
            <label className="inline-flex items-center gap-3 rounded-full border border-amber-950/10 bg-white/80 px-4 py-3 text-sm text-ink">
              <Button
                active={activeTab === 'images' ? showCollectionImageIds : showCollectionSayingIds}
                aria-pressed={activeTab === 'images' ? showCollectionImageIds : showCollectionSayingIds}
                className="relative h-7 w-12"
                onClick={() =>
                  activeTab === 'images'
                    ? setShowCollectionImageIds((value) => !value)
                    : setShowCollectionSayingIds((value) => !value)
                }
                shape="pill"
                variant="toggle"
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                    (activeTab === 'images' ? showCollectionImageIds : showCollectionSayingIds) ? 'left-6' : 'left-1'
                  }`}
                />
              </Button>
              <span>{activeTab === 'images' ? 'Image-ID in der Kartenmitte anzeigen' : 'Spruch-ID anzeigen'}</span>
            </label>
          </form>
        ) : null}
      </section>

      {zoomedImage && (activeTab === 'images' || activeTab === 'foci') ? (
        <Button
          aria-label="Vergrößerte Bildansicht schließen"
          className="fixed inset-0 z-50 p-4 sm:p-8"
          onClick={() => setZoomedImageId(null)}
          variant="scrim"
        >
          <img
            alt={zoomedImage.categories.map((category) => category.text).join(', ')}
            className="max-h-full max-w-full rounded-[24px] object-contain shadow-[0_30px_120px_rgba(0,0,0,0.42)]"
            src={zoomedImage.url}
          />
        </Button>
      ) : null}
    </section>
  );
}
