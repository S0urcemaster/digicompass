import { useEffect } from 'react';
import { CollectionView } from './views/collection/CollectionView';
import { PrimaryView } from './views/primary/PrimaryView';
import { Tabs } from '../components/Tabs';
import { useCompassStore } from '../store/compassStore';

const VIEW_LABELS = {
  primary: 'Kompass',
  collection: 'Sammlung',
} as const;

const VIEW_TABS = Object.entries(VIEW_LABELS).map(([value, label]) => ({
  label,
  value: value as keyof typeof VIEW_LABELS,
}));

export function App() {
  const {
    addMindset,
    addCollectionFocus,
    activeView,
    addCollectionImage,
    addCollectionSaying,
    data,
    removeMindset,
    removeCollectionFocus,
    selectedFocusIndex,
    selectedMindsetIndex,
    setCollectionFocusRating,
    setCollectionImageRating,
    setCollectionSayingRating,
    setActiveView,
    setMindsetRating,
    updateMindset,
    selectFocus,
    selectMindset,
  } = useCompassStore();
  const currentMindset = data.mindsets[selectedMindsetIndex];
  const currentFocus = currentMindset?.foci[selectedFocusIndex] ?? currentMindset?.foci[0];
  const currentFocusKey = currentFocus ? `${currentFocus.saying.id}:${currentFocus.image.id}` : null;
  const mindsetTabs = data.mindsets.map((mindset, index) => ({
    label: mindset.name,
    value: String(index),
  }));

  useEffect(() => {
    if (activeView === 'focus-editor') {
      setActiveView('collection');
    }
  }, [activeView, setActiveView]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex flex-col gap-5 border-b border-amber-950/10 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Digi Compass</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Mindsets für reale Situationen</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Wähle ein Mindset, fokussiere dich auf einen visuellen Spruch und halte den Rest des Sets direkt griffbereit.
          </p>
        </div>

        <Tabs
          activeValue={activeView}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2"
          items={VIEW_TABS}
          onChange={setActiveView}
          variant="nav"
        />
      </header>

      {activeView === 'primary' ? (
        <PrimaryView
          currentFocus={currentFocus}
          currentMindset={currentMindset}
          mindsetTabs={mindsetTabs}
          onSetFocusRating={(rating) => {
            if (!currentFocusKey) {
              return;
            }

            setCollectionFocusRating(currentFocusKey, rating);
          }}
          selectedMindsetIndex={selectedMindsetIndex}
          onSelectFocus={selectFocus}
          onSelectMindset={(value) => selectMindset(Number(value))}
          onUpdateMindsetNotes={(notes) => updateMindset(selectedMindsetIndex, { notes })}
        />
      ) : activeView === 'collection' ? (
        <CollectionView
          addMindset={addMindset}
          addCollectionFocus={addCollectionFocus}
          addCollectionImage={addCollectionImage}
          addCollectionSaying={addCollectionSaying}
          collectionFoci={data.collection.foci}
          collectionImages={data.collection.images}
          collectionMindsets={data.collection.mindsets}
          collectionSayings={data.collection.sayings}
          removeCollectionFocus={removeCollectionFocus}
          removeMindset={removeMindset}
          setCollectionFocusRating={setCollectionFocusRating}
          setCollectionImageRating={setCollectionImageRating}
          setCollectionSayingRating={setCollectionSayingRating}
          setMindsetRating={setMindsetRating}
          updateMindset={updateMindset}
        />
      ) : (
        <CollectionView
          addMindset={addMindset}
          addCollectionFocus={addCollectionFocus}
          addCollectionImage={addCollectionImage}
          addCollectionSaying={addCollectionSaying}
          collectionFoci={data.collection.foci}
          collectionImages={data.collection.images}
          collectionMindsets={data.collection.mindsets}
          collectionSayings={data.collection.sayings}
          removeCollectionFocus={removeCollectionFocus}
          removeMindset={removeMindset}
          setCollectionFocusRating={setCollectionFocusRating}
          setCollectionImageRating={setCollectionImageRating}
          setCollectionSayingRating={setCollectionSayingRating}
          setMindsetRating={setMindsetRating}
          updateMindset={updateMindset}
        />
      )}
    </main>
  );
}
