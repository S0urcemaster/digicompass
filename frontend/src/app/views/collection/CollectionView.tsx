import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import { Tabs } from '../../../components/Tabs';
import { IMAGES } from '../../../data/images';
import { preloadImages } from '../../../lib/imageCache';
import type { CompassImage } from '../../../types/domain';
import { CollectionImagePanel } from './CollectionImagePanel';
import { StarRating } from '../shared/StarRating';

const COLLECTION_TABS = [
  { label: 'Bilder', value: 'images' },
  { disabled: true, label: 'Sprüche', value: 'sayings' },
  { disabled: true, label: 'Foki', value: 'foci' },
  { disabled: true, label: 'Mindsets', value: 'mindsets' },
] as const satisfies ReadonlyArray<{ disabled?: boolean; label: string; value: string }>;

const COLLECTION_IMAGE_PAGE_SIZE = 9;

const getPreviewImageUrl = (url: string) => url.replace('/images/', '/images/preview/');

type CollectionViewProps = {
  collectionImages: CompassImage[];
  addCollectionImage: (image: CompassImage) => void;
  setCollectionImageRating: (imageId: number, rating: number) => void;
};

export function CollectionView({
  collectionImages,
  addCollectionImage,
  setCollectionImageRating,
}: CollectionViewProps) {
  const [collectionImageFilter, setCollectionImageFilter] = useState('');
  const [collectionImagePage, setCollectionImagePage] = useState(0);
  const [selectedCollectionImageId, setSelectedCollectionImageId] = useState<number | null>(IMAGES[0]?.id ?? null);
  const [zoomedImageId, setZoomedImageId] = useState<number | null>(null);
  const [showCollectionImageIds, setShowCollectionImageIds] = useState(false);
  const normalizedImageFilter = collectionImageFilter.trim().toLowerCase();
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
    <section className="mt-6 space-y-5">
      <Tabs activeValue="images" className="grid grid-cols-2 gap-2 sm:grid-cols-4" items={[...COLLECTION_TABS]} />

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
                              <div className="rounded-full bg-[#fff7ed]/92 px-4 py-2 text-3xl font-semibold text-[#1f1712] shadow-[0_10px_22px_rgba(0,0,0,0.16)]">
                                {image.id}
                              </div>
                            </div>
                          ) : null}
                          <div className="absolute left-2 top-2">
                            <p className="inline-flex rounded-full bg-[#fff7ed]/92 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f1712] shadow-[0_6px_18px_rgba(0,0,0,0.16)]">
                              {image.categories[0]?.text ?? 'Unsortiert'}
                            </p>
                          </div>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fff7ed]/96 via-[#fff7ed]/56 to-transparent px-2 pb-2 pt-8">
                            <StarRating
                              className="w-full justify-center gap-0.5"
                              disabled
                              rating={previewRating}
                              starClassName="text-[0.9rem]"
                              tone="dark"
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
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${showCollectionImageIds ? 'left-6' : 'left-1'}`}
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
  );
}
