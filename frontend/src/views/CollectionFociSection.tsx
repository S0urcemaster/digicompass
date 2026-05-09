import { useEffect, useMemo, useState } from 'react';
import categoriesData from '../data/categories.json';
import { Button } from '../components/Button';
import { CardBrowser } from '../components/CardBrowser';
import { CategoryFilter } from '../components/CategoryFilter';
import { FocusCard } from '../components/FocusCard';
import { ImageCard } from '../components/ImageCard';
import { SayingsBrowser } from '../components/SayingsBrowser';
import { useCompassStore } from '../store/compassStore';
import type { CompassImage, Focus, Saying } from '../types/domain';

type FocusMode = 'foci' | 'images' | 'sayings';

const focusModes: Array<{ value: FocusMode; label: string }> = [
  { value: 'foci', label: 'Foci' },
  { value: 'images', label: 'Images' },
  { value: 'sayings', label: 'Sayings' },
];

const createFocusDraft = (image: CompassImage, saying: Saying, existing?: Focus): Focus => ({
  id: existing?.id ?? `focus-${image.id}-${saying.id}`,
  image,
  saying,
  rating: existing?.rating ?? Math.max(image.rating, saying.rating, 0.6),
  notes: existing?.notes ?? '',
});

export function CollectionFociSection() {
  const { data, saveCollectionFocus, rateCollectionSaying } = useCompassStore();
  const [mode, setMode] = useState<FocusMode>('foci');
  const [category, setCategory] = useState(categoriesData[0]);
  const [selectedFocusIndex, setSelectedFocusIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSayingIndex, setSelectedSayingIndex] = useState(0);

  const filteredFoci = useMemo(
    () =>
      data.collection.foci.filter(
        (focus) =>
          focus.image.category === category || focus.saying.categories.includes(category),
      ),
    [category, data.collection.foci],
  );
  const filteredImages = useMemo(
    () => data.collection.images.filter((image) => image.category === category),
    [category, data.collection.images],
  );
  const filteredSayings = useMemo(
    () => data.collection.sayings.filter((saying) => saying.categories.includes(category)),
    [category, data.collection.sayings],
  );

  const safeFocusIndex = Math.min(selectedFocusIndex, Math.max(0, filteredFoci.length - 1));
  const safeImageIndex = Math.min(selectedImageIndex, Math.max(0, filteredImages.length - 1));
  const safeSayingIndex = Math.min(selectedSayingIndex, Math.max(0, filteredSayings.length - 1));
  const selectedFocus = filteredFoci[safeFocusIndex];
  const selectedImage = filteredImages[safeImageIndex];
  const selectedSaying = filteredSayings[safeSayingIndex];

  useEffect(() => {
    if (!selectedFocus) {
      return;
    }

    const imageIndex = filteredImages.findIndex((image) => image.id === selectedFocus.image.id);
    const sayingIndex = filteredSayings.findIndex((saying) => saying.id === selectedFocus.saying.id);
    if (imageIndex >= 0) {
      setSelectedImageIndex(imageIndex);
    }
    if (sayingIndex >= 0) {
      setSelectedSayingIndex(sayingIndex);
    }
  }, [filteredImages, filteredSayings, selectedFocus]);

  if (data.collection.images.length === 0 || data.collection.sayings.length === 0) {
    return (
      <section className="empty-panel">
        <h3>Foci</h3>
        <p>Add at least one collected image and one collected saying before assembling a focus.</p>
      </section>
    );
  }

  const assemblyBase = selectedFocus && mode === 'foci' ? selectedFocus : undefined;
  const assembledFocus =
    selectedImage && selectedSaying ? createFocusDraft(selectedImage, selectedSaying, assemblyBase) : undefined;

  return (
    <section className="view-stack">
      <CategoryFilter
        categories={categoriesData}
        value={category}
        onChange={(next) => {
          setCategory(next);
          setSelectedFocusIndex(0);
          setSelectedImageIndex(0);
          setSelectedSayingIndex(0);
        }}
      />
      <div className="main-tab collection-subnav">
        {focusModes.map((entry) => (
          <Button
            key={entry.value}
            type="button"
            active={mode === entry.value}
            onClick={() => setMode(entry.value)}
          >
            {entry.label}
          </Button>
        ))}
      </div>
      {assembledFocus ? (
        <section className="focus-preview-panel">
          <FocusCard
            focus={assembledFocus}
            onRate={(rating) => saveCollectionFocus(assembledFocus, rating)}
          />
        </section>
      ) : (
        <section className="empty-panel">
          <p>The current category does not yet contain both a collected image and a collected saying.</p>
        </section>
      )}
      {mode === 'foci' &&
        (filteredFoci.length > 0 ? (
          <CardBrowser
            items={filteredFoci}
            selectedIndex={safeFocusIndex}
            onSelect={setSelectedFocusIndex}
            renderSelected={(focus) => (
              <FocusCard focus={focus} onRate={(rating) => saveCollectionFocus(focus, rating)} />
            )}
            renderPreview={(focus) => <FocusCard focus={focus} size="preview" />}
          />
        ) : (
          <section className="empty-panel">
            <p>No collected foci match the selected category yet.</p>
          </section>
        ))}
      {mode === 'images' &&
        (filteredImages.length > 0 ? (
          <CardBrowser
            items={filteredImages}
            selectedIndex={safeImageIndex}
            onSelect={setSelectedImageIndex}
            renderSelected={(image) => <ImageCard image={image} rating={image.rating} />}
            renderPreview={(image) => <ImageCard image={image} rating={image.rating} size="preview" />}
          />
        ) : (
          <section className="empty-panel">
            <p>No collected images match the selected category.</p>
          </section>
        ))}
      {mode === 'sayings' &&
        (filteredSayings.length > 0 ? (
          <SayingsBrowser
            sayings={filteredSayings}
            selectedIndex={safeSayingIndex}
            onSelect={setSelectedSayingIndex}
            onRate={rateCollectionSaying}
          />
        ) : (
          <section className="empty-panel">
            <p>No collected sayings match the selected category.</p>
          </section>
        ))}
    </section>
  );
}
