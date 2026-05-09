import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { FocusSlot } from '../components/FocusSlot';
import { HorizontalBrowser } from '../components/HorizontalBrowser';
import { MindsetTile } from '../components/MindsetTile';
import { StarRating } from '../components/StarRating';
import { useCompassStore } from '../store/compassStore';
import type { Focus, Mindset } from '../types/domain';

type LowerMode = 'mindsets' | 'foci';

const createMindsetDraft = (): Mindset => ({
  id: `mindset-${Date.now()}`,
  name: '',
  foci: [],
  rating: 0.6,
  notes: '',
});

export function CollectionMindsetsSection() {
  const { data, saveCollectionMindset } = useCompassStore();
  const [lowerMode, setLowerMode] = useState<LowerMode>('mindsets');
  const [activeSlot, setActiveSlot] = useState(0);
  const [draft, setDraft] = useState<Mindset>(data.collection.mindsets[0] ?? createMindsetDraft());

  const focusSlots = useMemo(
    () => Array.from({ length: 5 }, (_, index) => draft.foci[index]),
    [draft.foci],
  );

  const assignFocus = (focus: Focus) => {
    setDraft((current) => {
      const nextFoci = current.foci.slice(0, 5);
      nextFoci[activeSlot] = focus;
      return {
        ...current,
        foci: nextFoci.filter(Boolean),
      };
    });
  };

  if (data.collection.foci.length === 0) {
    return (
      <section className="empty-panel">
        <h3>Mindsets</h3>
        <p>Create collected foci before building a mindset.</p>
      </section>
    );
  }

  return (
    <section className="view-stack">
      <section className="mindset-editor">
        <label className="username-field">
          <span>Name</span>
          <input
            value={draft.name}
            onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
            placeholder="Mindset name"
          />
        </label>
        <StarRating
          rating={draft.rating}
          onChange={(rating) => setDraft((current) => ({ ...current, rating }))}
        />
        <div className="focus-slot-grid">
          {focusSlots.map((focus, index) => (
            <FocusSlot
              key={`${draft.id}-${index}`}
              index={index}
              focus={focus}
              active={activeSlot === index}
              onSelect={() => setActiveSlot(index)}
            />
          ))}
        </div>
        <label className="notes-field">
          <span>Notes</span>
          <textarea
            rows={4}
            value={draft.notes}
            onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
          />
        </label>
        <div className="editor-actions">
          <Button type="button" onClick={() => setDraft(createMindsetDraft())}>
            +
          </Button>
          <Button type="button" onClick={() => saveCollectionMindset(draft, draft.rating || 0.6)}>
            Save mindset
          </Button>
          <Button type="button" onClick={() => saveCollectionMindset(draft, 0)}>
            Remove
          </Button>
        </div>
      </section>
      <div className="main-tab collection-subnav two-column-tabs">
        <Button type="button" active={lowerMode === 'mindsets'} onClick={() => setLowerMode('mindsets')}>
          Mindsets
        </Button>
        <Button type="button" active={lowerMode === 'foci'} onClick={() => setLowerMode('foci')}>
          Foci
        </Button>
      </div>
      {lowerMode === 'mindsets' && (
        <HorizontalBrowser
          items={data.collection.mindsets}
          renderItem={(mindset) => (
            <MindsetTile
              key={mindset.id}
              mindset={mindset}
              active={mindset.id === draft.id}
              onSelect={() => setDraft(mindset)}
            />
          )}
        />
      )}
      {lowerMode === 'foci' && (
        <HorizontalBrowser
          items={data.collection.foci}
          renderItem={(focus) => (
            <button
              key={focus.id}
              type="button"
              className="browser-tile-button"
              onClick={() => assignFocus(focus)}
            >
              <div className="browser-tile">
                <strong>{focus.image.category}</strong>
                <span>{focus.saying.text}</span>
              </div>
            </button>
          )}
        />
      )}
    </section>
  );
}
