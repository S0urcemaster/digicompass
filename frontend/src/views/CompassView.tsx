import { CardBrowser } from '../components/CardBrowser';
import { MindsetPaginator } from '../components/MindsetPaginator';
import { useActiveMindset, useCompassStore } from '../store/compassStore';

export function CompassView() {
  const activeMindset = useActiveMindset();
  const mindsets = useCompassStore((state) => state.data.mindsets);
  const selectedMindsetIndex = useCompassStore((state) => state.selectedMindsetIndex);
  const selectedFocusIndex = useCompassStore((state) => state.selectedFocusIndex);
  const setSelectedMindsetIndex = useCompassStore((state) => state.setSelectedMindsetIndex);
  const setSelectedFocusIndex = useCompassStore((state) => state.setSelectedFocusIndex);
  const updateActiveMindsetNotes = useCompassStore((state) => state.updateActiveMindsetNotes);
  const rateFocus = useCompassStore((state) => state.rateFocus);

  if (!activeMindset) {
    return <section className="empty-state">No mindset available.</section>;
  }

  const activeFocus = activeMindset.foci[selectedFocusIndex] ?? activeMindset.foci[0] ?? null;

  return (
    <section className="view-stack">
      <MindsetPaginator
        mindsets={mindsets}
        selectedIndex={selectedMindsetIndex}
        onSelect={setSelectedMindsetIndex}
      />
      <CardBrowser
        items={activeMindset.foci.map((focus) => ({
          id: focus.id,
          image: focus.image,
          saying: focus.saying,
          rating: focus.rating,
        }))}
        selectedId={activeFocus?.id ?? null}
        onSelect={(focusId) => {
          const nextIndex = activeMindset.foci.findIndex((focus) => focus.id === focusId);
          if (nextIndex >= 0) {
            setSelectedFocusIndex(nextIndex);
          }
        }}
        onRate={rateFocus}
      />
      <textarea
        className="notes-area"
        value={activeMindset.notes}
        onChange={(event) => updateActiveMindsetNotes(event.target.value)}
      />
    </section>
  );
}
