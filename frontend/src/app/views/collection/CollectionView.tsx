import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import { Tabs } from '../../../components/Tabs';
import { IMAGES } from '../../../data/images';
import { SAYINGS } from '../../../data/sayings';
import { preloadImages } from '../../../lib/imageCache';
import type { CompassImage, Saying } from '../../../types/domain';
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
  { disabled: true, label: 'Foki', value: 'foci' },
  { disabled: true, label: 'Mindsets', value: 'mindsets' },
] as const satisfies ReadonlyArray<{ disabled?: boolean; label: string; value: string }>;

const COLLECTION_PAGE_SIZE = 9;

const getPreviewImageUrl = (url: string) => url.replace('/images/', '/images/preview/');

const getSayingFontSize = (fontSize: number, expanded = false) =>
  expanded
    ? `clamp(2rem, ${fontSize / 12}vw, ${fontSize * 1.08}px)`
    : `clamp(1rem, ${fontSize / 22}vw, ${Math.max(22, fontSize * 0.52)}px)`;

type CollectionTabValue = (typeof COLLECTION_TABS)[number]['value'];

type CollectionViewProps = {
  collectionImages: CompassImage[];
  collectionSayings: Saying[];
  addCollectionImage: (image: CompassImage) => void;
  addCollectionSaying: (saying: Saying) => void;
  setCollectionImageRating: (imageId: number, rating: number) => void;
  setCollectionSayingRating: (sayingId: number, rating: number) => void;
};

export function CollectionView({
  collectionImages,
  collectionSayings,
  addCollectionImage,
  addCollectionSaying,
  setCollectionImageRating,
  setCollectionSayingRating,
}: CollectionViewProps) {
  const [activeTab, setActiveTab] = useState<CollectionTabValue>('images');
  const [collectionImageFilter, setCollectionImageFilter] = useState('');
  const [collectionImagePage, setCollectionImagePage] = useState(0);
  const [selectedCollectionImageId, setSelectedCollectionImageId] = useState<number | null>(IMAGES[0]?.id ?? null);
  const [zoomedImageId, setZoomedImageId] = useState<number | null>(null);
  const [showCollectionImageIds, setShowCollectionImageIds] = useState(true);
  const [collectionSayingFilter, setCollectionSayingFilter] = useState('');
  const [collectionSayingPage, setCollectionSayingPage] = useState(0);
  const [selectedCollectionSayingId, setSelectedCollectionSayingId] = useState<number | null>(SAYINGS[0]?.id ?? null);
  const [showCollectionSayingIds, setShowCollectionSayingIds] = useState(true);

  const normalizedImageFilter = collectionImageFilter.trim().toLowerCase();
  const normalizedSayingFilter = collectionSayingFilter.trim().toLowerCase();

  const collectionImageById = new Map(collectionImages.map((image) => [image.id, image] as const));
  const filteredCollectionImages = IMAGES.filter((image) =>
    normalizedImageFilter.length === 0
      ? true
      : image.categories.some((category) => category.text.toLowerCase().includes(normalizedImageFilter))
  );
  const collectionImagePageCount = Math.max(1, Math.ceil(filteredCollectionImages.length / COLLECTION_PAGE_SIZE));
  const safeCollectionImagePage = Math.min(collectionImagePage, collectionImagePageCount - 1);
  const pagedCollectionImages = filteredCollectionImages.slice(
    safeCollectionImagePage * COLLECTION_PAGE_SIZE,
    (safeCollectionImagePage + 1) * COLLECTION_PAGE_SIZE
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
  const collectionSayingPageCount = Math.max(1, Math.ceil(filteredCollectionSayings.length / COLLECTION_PAGE_SIZE));
  const safeCollectionSayingPage = Math.min(collectionSayingPage, collectionSayingPageCount - 1);
  const pagedCollectionSayings = filteredCollectionSayings.slice(
    safeCollectionSayingPage * COLLECTION_PAGE_SIZE,
    (safeCollectionSayingPage + 1) * COLLECTION_PAGE_SIZE
  );
  const selectedCollectionSaying =
    filteredCollectionSayings.find((saying) => saying.id === selectedCollectionSayingId) ?? filteredCollectionSayings[0] ?? null;

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
              <label className="block" htmlFor="collection-saying-filter">
                <input
                  id="collection-saying-filter"
                  className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                  placeholder="Kategorie eingeben, z. B. Freiheit oder Erkenntnis"
                  value={collectionSayingFilter}
                  onChange={(event) => setCollectionSayingFilter(event.target.value)}
                />
              </label>

              <div className="min-[900px]:max-w-[28rem]">
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
                      const isSelected = saying.id === selectedCollectionSaying?.id;
                      const collectedListSaying = collectionSayingById.get(saying.id) ?? null;
                      const previewRating = collectedListSaying?.rating ?? 0;

                      return (
                        <article
                          key={saying.id}
                          className={`relative min-h-[7.75rem] overflow-hidden rounded-[18px] border bg-[linear-gradient(145deg,#fff8ef_0%,#f8eddd_46%,#edd8b8_100%)] transition ${
                            isSelected
                              ? 'border-accent ring-2 ring-accent shadow-[0_18px_40px_rgba(212,138,31,0.24)]'
                              : 'border-amber-950/10 shadow-[0_14px_30px_rgba(32,26,24,0.08)]'
                          }`}
                        >
                          <button
                            className="absolute inset-0 z-0"
                            aria-label={`Spruch ${saying.id} auswählen`}
                            onClick={() => setSelectedCollectionSayingId(saying.id)}
                            type="button"
                          />
                          <div className="relative z-10 flex h-full items-center gap-4 px-4 py-3">
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <div className="flex items-start justify-between gap-2">
                                <p className="inline-flex rounded-full bg-[#fff7ed]/92 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f1712] shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
                                  {saying.categories[0]?.text ?? 'Unsortiert'}
                                </p>
                                {showCollectionSayingIds ? (
                                  <div className="shrink-0 rounded-full border border-[#fff7ed]/16 bg-[#fff7ed]/92 px-2.5 py-1 text-sm font-semibold text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.1)]">
                                    {saying.id}
                                  </div>
                                ) : null}
                              </div>
                              <p
                                className="line-clamp-2 pr-3 font-semibold tracking-[-0.04em] text-[#1f1712]"
                                style={{ fontSize: getSayingFontSize(saying.fontSize), lineHeight: 1.08 }}
                              >
                                {saying.text}
                              </p>
                            </div>
                            <StarRating
                              className="relative z-10 justify-center gap-0.5 rounded-full bg-[#fff7ed]/92 px-2 py-1.5 text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.08)]"
                              rating={previewRating}
                              buttonClassName="min-w-[1.5rem]"
                              starClassName="text-[1.1rem]"
                              tone="dark"
                              onChange={(rating) => handleSetSayingRating(saying, rating)}
                            />
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
        ) : (
          <div className="mt-5 rounded-[22px] border border-dashed border-amber-950/14 bg-[#fbf6ec] px-4 py-10 text-center">
            <p className="text-sm text-muted">Dieser Bereich ist noch nicht umgesetzt.</p>
          </div>
        )}

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
      </section>

      {zoomedImage && activeTab === 'images' ? (
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
