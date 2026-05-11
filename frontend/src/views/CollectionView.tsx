import { useState } from 'react';
import { CompassImageCard } from '../components/content/CompassImageCard';
import { FocusCard } from '../components/content/FocusCard';
import { SayingsBrowser } from '../components/content/SayingsBrowser';
import { SayingPanel } from '../components/content/SayingPanel';
import { Button } from '../components/reusable/Button';
import { CardBrowser } from '../components/reusable/CardBrowser';
import { CategoryFilter } from '../components/reusable/CategoryFilter';
import { HorizontalBrowser } from '../components/reusable/HorizontalBrowser';
import { StarRating } from '../components/reusable/StarRating';
import { allCategories, libraryImages, librarySayings } from '../store/factoryState';
import { useCompassStore } from '../store/compassStore';
import type {
  CollectionSection,
  CompassImage,
  Focus,
  FocusBrowserMode,
  Mindset,
  MindsetBrowserMode,
  Saying,
} from '../types/domain';

function wrapIndex(index: number, size: number): number {
  return (index + size) % size;
}

function CollectionImagesSection() {
  const rateLibraryImage = useCompassStore((state) => state.rateLibraryImage);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const filteredImages = (() => {
    if (!filterEnabled) {
      return libraryImages;
    }

    return libraryImages.filter((image) => image.category === allCategories[categoryIndex]);
  })();
  const [selectedImageId, setSelectedImageId] = useState(filteredImages[0]?.id ?? libraryImages[0]?.id ?? 0);
  const selectedImage =
    filteredImages.find((image) => image.id === selectedImageId) ?? filteredImages[0] ?? null;

  return (
    <section className="view-stack">
      <CategoryFilter
        categories={allCategories}
        categoryIndex={categoryIndex}
        enabled={filterEnabled}
        onNext={() => setCategoryIndex((current) => wrapIndex(current + 1, allCategories.length))}
        onPrevious={() => setCategoryIndex((current) => wrapIndex(current - 1, allCategories.length))}
        onToggle={() => setFilterEnabled((current) => !current)}
      />
      <CardBrowser
        getKey={(image) => image.id}
        items={filteredImages}
        onSelect={(image) => setSelectedImageId(image.id)}
        renderPreview={(image) => <CompassImageCard image={image} preview />}
        renderSelected={(image) => (
          <CompassImageCard
            image={image}
            onRatingChange={(rating) => rateLibraryImage(image, rating)}
            ratingInteractive
          />
        )}
        selectedItem={selectedImage}
      />
    </section>
  );
}

function CollectionSayingsSection() {
  const rateLibrarySaying = useCompassStore((state) => state.rateLibrarySaying);
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const filteredSayings = (() => {
    if (!filterEnabled) {
      return librarySayings;
    }

    return librarySayings.filter((saying) => saying.categories.includes(allCategories[categoryIndex]));
  })();
  const [selectedSayingId, setSelectedSayingId] = useState(filteredSayings[0]?.id ?? librarySayings[0]?.id ?? 0);
  const selectedSaying =
    filteredSayings.find((saying) => saying.id === selectedSayingId) ?? filteredSayings[0] ?? null;

  return (
    <section className="view-stack">
      <CategoryFilter
        categories={allCategories}
        categoryIndex={categoryIndex}
        enabled={filterEnabled}
        onNext={() => setCategoryIndex((current) => wrapIndex(current + 1, allCategories.length))}
        onPrevious={() => setCategoryIndex((current) => wrapIndex(current - 1, allCategories.length))}
        onToggle={() => setFilterEnabled((current) => !current)}
      />
      <SayingsBrowser
        onRate={rateLibrarySaying}
        onSelect={(saying) => setSelectedSayingId(saying.id)}
        sayings={filteredSayings}
        selectedSaying={selectedSaying}
      />
    </section>
  );
}

function FocusPreviewPanel({ image, saying }: { image: CompassImage | null; saying: Saying | null }) {
  if (!image || !saying) {
    return <div className="empty-state">Select one image and one saying from your collection.</div>;
  }

  const previewFocus: Focus = {
    id: -1,
    image,
    saying,
    rating: 0,
    notes: '',
  };

  return <FocusCard focus={previewFocus} />;
}

function CollectionFociSection() {
  const collectionImages = useCompassStore((state) => state.data.collection.images);
  const collectionSayings = useCompassStore((state) => state.data.collection.sayings);
  const collectionFoci = useCompassStore((state) => state.data.collection.foci);
  const saveFocus = useCompassStore((state) => state.saveFocus);
  const rateCollectedFocus = useCompassStore((state) => state.rateCollectedFocus);
  const [mode, setMode] = useState<FocusBrowserMode>('foci');
  const [selectedFocusId, setSelectedFocusId] = useState(collectionFoci[0]?.id ?? 0);
  const [selectedImageId, setSelectedImageId] = useState(collectionImages[0]?.id ?? 0);
  const [selectedSayingId, setSelectedSayingId] = useState(collectionSayings[0]?.id ?? 0);

  const selectedFocus = collectionFoci.find((focus) => focus.id === selectedFocusId) ?? collectionFoci[0] ?? null;
  const selectedImage = collectionImages.find((image) => image.id === selectedImageId) ?? collectionImages[0] ?? null;
  const selectedSaying = collectionSayings.find((saying) => saying.id === selectedSayingId) ?? collectionSayings[0] ?? null;

  const nextFocusId = collectionFoci.reduce((max, focus) => Math.max(max, focus.id), 0) + 1;

  return (
    <section className="view-stack">
      <div className="triple-row">
        <Button active={mode === 'foci'} onClick={() => setMode('foci')}>
          Foci
        </Button>
        <Button active={mode === 'images'} onClick={() => setMode('images')}>
          Images
        </Button>
        <Button active={mode === 'sayings'} onClick={() => setMode('sayings')}>
          Sayings
        </Button>
      </div>
      {mode === 'foci' ? (
        <CardBrowser
          getKey={(focus) => focus.id}
          items={collectionFoci}
          onSelect={(focus) => setSelectedFocusId(focus.id)}
          renderPreview={(focus) => <FocusCard focus={focus} preview />}
          renderSelected={(focus) => (
            <FocusCard
              focus={focus}
              onRatingChange={(rating) => rateCollectedFocus(focus.id, rating)}
              ratingInteractive
            />
          )}
          selectedItem={selectedFocus}
        />
      ) : null}
      {mode === 'images' ? (
        <CardBrowser
          getKey={(image) => image.id}
          items={collectionImages}
          onSelect={(image) => setSelectedImageId(image.id)}
          renderPreview={(image) => <CompassImageCard image={image} preview />}
          renderSelected={(image) => <CompassImageCard image={image} />}
          selectedItem={selectedImage}
        />
      ) : null}
      {mode === 'sayings' ? (
        <CardBrowser
          getKey={(saying) => saying.id}
          items={collectionSayings}
          onSelect={(saying) => setSelectedSayingId(saying.id)}
          renderPreview={(saying) => <SayingPanel preview saying={saying} />}
          renderSelected={(saying) => <SayingPanel saying={saying} />}
          selectedItem={selectedSaying}
        />
      ) : null}
      <div className="editor-panel">
        <div className="editor-header">
          <h3>Focus Candidate</h3>
          <Button
            onClick={() =>
              selectedImage &&
              selectedSaying &&
              saveFocus({
                id: selectedFocus?.id ?? nextFocusId,
                image: selectedImage,
                saying: selectedSaying,
                rating: selectedFocus?.rating ?? 0,
                notes: selectedFocus?.notes ?? '',
              })
            }
          >
            Save Focus
          </Button>
        </div>
        <FocusPreviewPanel image={selectedImage} saying={selectedSaying} />
      </div>
    </section>
  );
}

function createEmptyMindset(nextId: number): Mindset {
  return {
    id: nextId,
    name: `Mindset ${nextId + 1}`,
    foci: [],
    rating: 0,
    notes: '',
  };
}

function CollectionMindsetsSection() {
  const collectionMindsets = useCompassStore((state) => state.data.collection.mindsets);
  const collectionFoci = useCompassStore((state) => state.data.collection.foci);
  const saveMindset = useCompassStore((state) => state.saveMindset);
  const [mode, setMode] = useState<MindsetBrowserMode>('mindsets');
  const [draft, setDraft] = useState<Mindset>(() => collectionMindsets[0] ?? createEmptyMindset(0));

  const nextMindsetId = collectionMindsets.reduce((max, mindset) => Math.max(max, mindset.id), 0) + 1;

  return (
    <section className="view-stack">
      <div className="editor-panel">
        <div className="editor-header">
          <input
            className="name-input"
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            value={draft.name}
          />
          <Button onClick={() => saveMindset(draft)}>Save Mindset</Button>
        </div>
        <StarRating
          interactive
          onChange={(rating) => setDraft((current) => ({ ...current, rating }))}
          rating={draft.rating}
        />
        <div className="slots-grid">
          {Array.from({ length: 5 }, (_, index) => {
            const focus = draft.foci[index];
            return (
              <button
                className="slot-tile"
                key={index}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    foci: current.foci.filter((_, focusIndex) => focusIndex !== index),
                  }))
                }
                type="button"
              >
                {focus ? <FocusCard focus={focus} preview /> : <span>Empty Slot</span>}
              </button>
            );
          })}
        </div>
      </div>
      <div className="triple-row">
        <Button active={mode === 'mindsets'} onClick={() => setMode('mindsets')}>
          Mindsets
        </Button>
        <Button active={mode === 'foci'} onClick={() => setMode('foci')}>
          Foci
        </Button>
        <Button
          onClick={() => {
            const nextDraft = createEmptyMindset(nextMindsetId);
            setDraft(nextDraft);
            setMode('foci');
          }}
        >
          +
        </Button>
      </div>
      {mode === 'mindsets' ? (
        <HorizontalBrowser
          getKey={(mindset) => mindset.id}
          items={collectionMindsets}
          onSelect={(mindset) => setDraft({ ...mindset, foci: [...mindset.foci] })}
          renderItem={(mindset) => (
            <div className="mindset-tile">
              {mindset.foci[0] ? <FocusCard focus={mindset.foci[0]} preview /> : <div className="empty-state">No Focus</div>}
              <span className="mindset-title">{mindset.name}</span>
            </div>
          )}
        />
      ) : null}
      {mode === 'foci' ? (
        <HorizontalBrowser
          getKey={(focus) => focus.id}
          items={collectionFoci}
          onSelect={(focus) =>
            setDraft((current) => ({
              ...current,
              foci: current.foci.length >= 5 ? current.foci : [...current.foci, focus],
            }))
          }
          renderItem={(focus) => <FocusCard focus={focus} preview />}
        />
      ) : null}
    </section>
  );
}

const sectionOrder: CollectionSection[] = ['images', 'sayings', 'foci', 'mindsets'];

export function CollectionView() {
  const activeCollectionSection = useCompassStore((state) => state.activeCollectionSection);
  const setActiveCollectionSection = useCompassStore((state) => state.setActiveCollectionSection);

  return (
    <section className="view-stack">
      <div className="collection-section-tabs">
        {sectionOrder.map((section) => (
          <Button
            active={section === activeCollectionSection}
            key={section}
            onClick={() => setActiveCollectionSection(section)}
          >
            {section}
          </Button>
        ))}
      </div>
      {activeCollectionSection === 'images' ? <CollectionImagesSection /> : null}
      {activeCollectionSection === 'sayings' ? <CollectionSayingsSection /> : null}
      {activeCollectionSection === 'foci' ? <CollectionFociSection /> : null}
      {activeCollectionSection === 'mindsets' ? <CollectionMindsetsSection /> : null}
    </section>
  );
}
