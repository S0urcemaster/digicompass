import { CollectionView } from './views/collection/CollectionView';
import { FocusEditorView } from './views/focusEditor/FocusEditorView';
import { PrimaryView } from './views/primary/PrimaryView';
import { Tabs } from '../components/Tabs';
import { useCompassStore } from '../store/compassStore';

const VIEW_LABELS = {
  primary: 'Start',
  'focus-editor': 'Fokus-Editor',
  collection: 'Sammlung',
} as const;

const VIEW_TABS = Object.entries(VIEW_LABELS).map(([value, label]) => ({
  label,
  value: value as keyof typeof VIEW_LABELS,
}));

export function App() {
  const {
    activeView,
    addCollectionImage,
    addCollectionSaying,
    data,
    selectedFocusIndex,
    selectedMindsetIndex,
    setCollectionImageRating,
    setCollectionSayingRating,
    setActiveView,
    setUsername,
    selectFocus,
    selectMindset,
  } = useCompassStore();
  const currentMindset = data.mindsets[selectedMindsetIndex];
  const currentFocus = currentMindset?.foci[selectedFocusIndex] ?? currentMindset?.foci[0];
  const mindsetTabs = data.mindsets.map((mindset, index) => ({
    label: mindset.name,
    value: String(index),
  }));

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
        <PrimaryView
          currentFocus={currentFocus}
          currentMindset={currentMindset}
          mindsetTabs={mindsetTabs}
          selectedMindsetIndex={selectedMindsetIndex}
          onSelectFocus={selectFocus}
          onSelectMindset={(value) => selectMindset(Number(value))}
        />
      ) : activeView === 'collection' ? (
        <CollectionView
          addCollectionImage={addCollectionImage}
          addCollectionSaying={addCollectionSaying}
          collectionImages={data.collection.images}
          collectionSayings={data.collection.sayings}
          setCollectionImageRating={setCollectionImageRating}
          setCollectionSayingRating={setCollectionSayingRating}
        />
      ) : (
        <FocusEditorView label={VIEW_LABELS[activeView]} />
      )}
    </main>
  );
}
