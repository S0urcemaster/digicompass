import { CategoryFilter } from '../components/CategoryFilter';
import { SayingsBrowser } from '../components/SayingsBrowser';
import { useCompassStore } from '../store/compassStore';
import { sayings } from '../utils/data';

export function CollectionSayingsSection() {
  const selectedSayingCategory = useCompassStore((state) => state.selectedSayingCategory);
  const selectedCollectionSayingId = useCompassStore((state) => state.selectedCollectionSayingId);
  const setSelectedSayingCategory = useCompassStore((state) => state.setSelectedSayingCategory);
  const selectCollectionSaying = useCompassStore((state) => state.selectCollectionSaying);
  const rateSaying = useCompassStore((state) => state.rateSaying);
  const collectedSayings = useCompassStore((state) => state.data.collection.sayings);

  const visibleSayings = sayings
    .filter((saying) => saying.categories.includes(selectedSayingCategory))
    .map((saying) => collectedSayings.find((collected) => collected.id === saying.id) ?? saying);

  return (
    <section className="view-stack">
      <CategoryFilter value={selectedSayingCategory} onChange={setSelectedSayingCategory} />
      <SayingsBrowser
        items={visibleSayings}
        selectedId={selectedCollectionSayingId}
        onSelect={selectCollectionSaying}
        onRate={rateSaying}
      />
    </section>
  );
}
