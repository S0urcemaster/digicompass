import { Button } from '../components/Button';
import { FocusSlot } from '../components/FocusSlot';
import { HorizontalBrowser } from '../components/HorizontalBrowser';
import { StarRating } from '../components/StarRating';
import { useCompassStore } from '../store/compassStore';

export function CollectionMindsetsSection() {
  const collection = useCompassStore((state) => state.data.collection);
  const activeMode = useCompassStore((state) => state.activeMindsetsBrowserMode);
  const selectedCollectionMindsetId = useCompassStore((state) => state.selectedCollectionMindsetId);
  const setActiveMode = useCompassStore((state) => state.setActiveMindsetsBrowserMode);
  const selectCollectionMindset = useCompassStore((state) => state.selectCollectionMindset);
  const createMindsetDraft = useCompassStore((state) => state.createMindsetDraft);
  const assignFocusToSelectedMindset = useCompassStore((state) => state.assignFocusToSelectedMindset);
  const updateSelectedMindsetName = useCompassStore((state) => state.updateSelectedMindsetName);
  const rateMindset = useCompassStore((state) => state.rateMindset);

  const activeMindset =
    collection.mindsets.find((mindset) => mindset.id === selectedCollectionMindsetId) ?? collection.mindsets[0] ?? null;

  const mindsetItems = [
    {
      id: 'new',
      content: (
        <button type="button" className="browser-tile browser-tile--plus" onClick={createMindsetDraft}>
          +
        </button>
      ),
    },
    ...collection.mindsets.map((mindset) => ({
      id: mindset.id,
      content: (
        <button type="button" className="browser-tile" onClick={() => selectCollectionMindset(mindset.id)}>
          <strong>{mindset.name}</strong>
          <span>{mindset.foci[0]?.saying.text.slice(0, 42) ?? 'Kein Fokus'}</span>
        </button>
      ),
    })),
  ];

  const focusItems = collection.foci.map((focus, index) => ({
    id: focus.id,
    content: (
      <button type="button" className="browser-tile" onClick={() => assignFocusToSelectedMindset(index % 5, focus.id)}>
        <strong>{focus.image.category}</strong>
        <span>{focus.saying.text.slice(0, 42)}</span>
      </button>
    ),
  }));

  return (
    <section className="view-stack">
      {activeMindset ? (
        <div className="mindset-editor">
          <input
            className="mindset-editor__name"
            value={activeMindset.name}
            onChange={(event) => updateSelectedMindsetName(event.target.value)}
          />
          <StarRating value={activeMindset.rating} onChange={(rating) => rateMindset(activeMindset.id, rating)} />
          <div className="focus-slot-grid">
            {Array.from({ length: 5 }, (_, index) => (
              <FocusSlot
                key={index}
                label={activeMindset.foci[index]?.saying.text.slice(0, 26) ?? `Slot ${index + 1}`}
              />
            ))}
          </div>
        </div>
      ) : null}
      <div className="mode-row">
        <Button active={activeMode === 'mindsets'} onClick={() => setActiveMode('mindsets')}>
          Mindsets
        </Button>
        <Button active={activeMode === 'foci'} onClick={() => setActiveMode('foci')}>
          Foci
        </Button>
      </div>
      {activeMode === 'mindsets' ? <HorizontalBrowser items={mindsetItems} /> : null}
      {activeMode === 'foci' ? <HorizontalBrowser items={focusItems} /> : null}
    </section>
  );
}
