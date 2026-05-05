import { useEffect, useState } from 'react';
import { Button } from '../../../components/Button';
import { Tabs } from '../../../components/Tabs';
import type { Focus, Mindset } from '../../../types/domain';
import { FocusTile } from '../shared/FocusTile';

type PrimaryViewProps = {
  currentFocus: Focus | undefined;
  currentMindset: Mindset | undefined;
  mindsetTabs: Array<{ label: string; value: string }>;
  selectedMindsetIndex: number;
  onSelectFocus: (index: number) => void;
  onSelectMindset: (value: string) => void;
};

const VISIBLE_MINDSET_TAB_COUNT = 4;

export function PrimaryView({
  currentFocus,
  currentMindset,
  mindsetTabs,
  selectedMindsetIndex,
  onSelectFocus,
  onSelectMindset,
}: PrimaryViewProps) {
  if (!currentMindset || !currentFocus) {
    return <p className="mt-6 text-sm text-muted">Keine Mindset-Daten verfügbar.</p>;
  }

  const visibleFocusIndex = currentMindset.foci.findIndex((focus) => focus === currentFocus);
  const remainingFoci = currentMindset.foci.filter((_, index) => index !== visibleFocusIndex).slice(0, 4);
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

  return (
    <section className="mt-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Aktuelles Mindset</p>
            <p className="mt-1 text-2xl font-semibold text-ink">{currentMindset.name}</p>
          </div>
          <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
            Bewertung {currentMindset.rating.toFixed(2)}
          </div>
        </div>

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
        <article className="overflow-hidden rounded-[24px] bg-[#201a18] text-white shadow-[0_30px_80px_rgba(32,26,24,0.32)]">
          <FocusTile focus={currentFocus} variant="main" />
        </article>

        <section className="grid gap-3 sm:grid-cols-2 sm:grid-rows-2 lg:auto-rows-[minmax(0,0.88fr)]">
          {remainingFoci.map((focus) => {
            const nextIndex = currentMindset.foci.indexOf(focus);

            return (
              <Button
                align="left"
                key={`${focus.saying.id}-${focus.image.id}`}
                className="overflow-hidden rounded-[20px]"
                onClick={() => onSelectFocus(nextIndex)}
                variant="surface"
              >
                <FocusTile focus={focus} />
              </Button>
            );
          })}
        </section>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[20px] bg-[#f4e8d5] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Fokus-Bewertung</p>
          <p className="mt-2 text-2xl font-semibold text-ink">{currentFocus.rating.toFixed(2)}</p>
        </div>
        <div className="rounded-[20px] bg-[#e8efe8] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Kategorien</p>
          <p className="mt-2 text-sm leading-6 text-ink">
            {currentFocus.saying.categories.map((category) => category.text).join(' / ')}
          </p>
        </div>
        <div className="rounded-[20px] bg-[#e4ebf1] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Notizen</p>
          <p className="mt-2 text-sm leading-6 text-ink">{currentFocus.notes || 'Noch keine Notizen.'}</p>
        </div>
      </section>
    </section>
  );
}
