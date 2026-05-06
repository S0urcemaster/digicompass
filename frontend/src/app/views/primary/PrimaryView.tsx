import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import { Tabs } from '../../../components/Tabs';
import type { Focus, Mindset } from '../../../types/domain';
import { FocusTile } from '../shared/FocusTile';

type PrimaryViewProps = {
  currentFocus: Focus | undefined;
  currentMindset: Mindset | undefined;
  mindsetTabs: Array<{ label: string; value: string }>;
  onSetFocusRating: (rating: number) => void;
  selectedMindsetIndex: number;
  onSelectFocus: (index: number) => void;
  onSelectMindset: (value: string) => void;
  onUpdateMindsetNotes: (notes: string) => void;
};

const VISIBLE_MINDSET_TAB_COUNT = 4;

export function PrimaryView({
  currentFocus,
  currentMindset,
  mindsetTabs,
  onSetFocusRating,
  selectedMindsetIndex,
  onSelectFocus,
  onSelectMindset,
  onUpdateMindsetNotes,
}: PrimaryViewProps) {
  const visibleFocusIndex = currentMindset?.foci.findIndex((focus) => focus === currentFocus) ?? -1;
  const remainingFoci = currentMindset?.foci.filter((_, index) => index !== visibleFocusIndex).slice(0, 4) ?? [];
  const maxMindsetTabStart = Math.max(0, mindsetTabs.length - VISIBLE_MINDSET_TAB_COUNT);
  const [mindsetTabStart, setMindsetTabStart] = useState(() =>
    Math.min(selectedMindsetIndex, maxMindsetTabStart)
  );
  const visibleMindsetTabs = mindsetTabs.slice(mindsetTabStart, mindsetTabStart + VISIBLE_MINDSET_TAB_COUNT);

  useEffect(() => {
    setMindsetTabStart((currentStart) => {
      const clampedStart = Math.min(currentStart, maxMindsetTabStart);

      if (selectedMindsetIndex < clampedStart) {
        return selectedMindsetIndex;
      }

      if (selectedMindsetIndex >= clampedStart + VISIBLE_MINDSET_TAB_COUNT) {
        return Math.min(selectedMindsetIndex - VISIBLE_MINDSET_TAB_COUNT + 1, maxMindsetTabStart);
      }

      return clampedStart;
    });
  }, [maxMindsetTabStart, selectedMindsetIndex]);

  if (!currentMindset || !currentFocus) {
    return <p className="mt-6 text-sm text-muted">Keine Mindset-Daten verfügbar.</p>;
  }

  return (
    <section className="mt-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
          <Button
            aria-label="Vorherige Mindset-Tabs"
            disabled={mindsetTabStart === 0}
            onClick={() =>
              setMindsetTabStart((currentStart) => Math.max(0, currentStart - VISIBLE_MINDSET_TAB_COUNT))
            }
            shape="pill"
            variant="pager"
          >
            ←
          </Button>
          <Tabs
            activeValue={String(selectedMindsetIndex)}
            className="grid grid-cols-4 gap-2"
            items={visibleMindsetTabs}
            onChange={onSelectMindset}
          />
          <Button
            aria-label="Nächste Mindset-Tabs"
            disabled={mindsetTabStart >= maxMindsetTabStart}
            onClick={() =>
              setMindsetTabStart((currentStart) => Math.min(maxMindsetTabStart, currentStart + VISIBLE_MINDSET_TAB_COUNT))
            }
            shape="pill"
            variant="pager"
          >
            →
          </Button>
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <FocusTile focus={currentFocus} onSetRating={onSetFocusRating} variant="main" />

        <section className="grid gap-3 sm:grid-cols-2 sm:grid-rows-2 lg:auto-rows-[minmax(0,0.88fr)]">
          {remainingFoci.map((focus) => {
            const nextIndex = currentMindset.foci.indexOf(focus);

            return (
              <Button
                align="left"
                key={`${focus.saying.id}-${focus.image.id}`}
                className="overflow-hidden"
                onClick={() => onSelectFocus(nextIndex)}
                variant="surface"
              >
                <FocusTile focus={focus} />
              </Button>
            );
          })}
        </section>
      </section>

      <textarea
        id="mindset-notes"
        className="min-h-32 w-full border border-amber-950/10 bg-white/90 px-4 py-4 text-lg leading-7 text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
        placeholder="Noch keine Notizen zum aktuellen Mindset."
        value={currentMindset.notes}
        onChange={(event) => onUpdateMindsetNotes(event.target.value)}
      />
    </section>
  );
}
