import { CardBrowser } from '../components/reusable/CardBrowser';
import { MindsetPaginator } from '../components/reusable/MindsetPaginator';
import { FocusCard } from '../components/content/FocusCard';
import { useCompassStore } from '../store/compassStore';

export function CompassView() {
  const mindsets = useCompassStore((state) => state.data.mindsets);
  const selectedMindsetIndex = useCompassStore((state) => state.selectedMindsetIndex);
  const selectedFocusIndex = useCompassStore((state) => state.selectedFocusIndex);
  const setSelectedMindsetIndex = useCompassStore((state) => state.setSelectedMindsetIndex);
  const setSelectedFocusIndex = useCompassStore((state) => state.setSelectedFocusIndex);
  const setActiveMindsetNotes = useCompassStore((state) => state.setActiveMindsetNotes);

  const activeMindset = mindsets[selectedMindsetIndex] ?? mindsets[0];
  const activeFocus = activeMindset?.foci[selectedFocusIndex] ?? activeMindset?.foci[0] ?? null;

  return (
    <section className="view-stack">
      <MindsetPaginator
        mindsets={mindsets}
        onSelect={setSelectedMindsetIndex}
        selectedIndex={selectedMindsetIndex}
      />
      <CardBrowser
        getKey={(focus) => focus.id}
        items={activeMindset?.foci ?? []}
        onSelect={(focus) => {
          const nextIndex = activeMindset.foci.findIndex((item) => item.id === focus.id);
          setSelectedFocusIndex(nextIndex);
        }}
        renderPreview={(focus) => <FocusCard focus={focus} preview />}
        renderSelected={(focus) => <FocusCard focus={focus} />}
        selectedItem={activeFocus}
      />
      <textarea
        className="notes-area"
        onChange={(event) => setActiveMindsetNotes(event.target.value)}
        placeholder="Mindset notes"
        value={activeMindset?.notes ?? ''}
      />
    </section>
  );
}
