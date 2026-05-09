import { FocusCard } from '../components/FocusCard';
import { CardBrowser } from '../components/CardBrowser';
import { MindsetPaginator } from '../components/MindsetPaginator';
import { useCompassStore } from '../store/compassStore';

export function CompassView() {
  const {
    data,
    selectedMindsetIndex,
    selectedFocusIndex,
    setSelectedMindsetIndex,
    setSelectedFocusIndex,
    updateMindsetNotes,
  } = useCompassStore();

  const activeMindset = data.mindsets[selectedMindsetIndex];

  if (!activeMindset) {
    return <section className="empty-panel">No mindset available.</section>;
  }

  return (
    <section className="view-stack">
      <MindsetPaginator
        mindsets={data.mindsets}
        selectedIndex={selectedMindsetIndex}
        onSelect={setSelectedMindsetIndex}
      />
      <CardBrowser
        items={activeMindset.foci}
        selectedIndex={selectedFocusIndex}
        onSelect={setSelectedFocusIndex}
        renderSelected={(focus) => <FocusCard focus={focus} />}
        renderPreview={(focus) => <FocusCard focus={focus} size="preview" />}
      />
      <label className="notes-field">
        <span>Mindset Notes</span>
        <textarea
          value={activeMindset.notes}
          onChange={(event) => updateMindsetNotes(event.target.value)}
          rows={6}
        />
      </label>
    </section>
  );
}
