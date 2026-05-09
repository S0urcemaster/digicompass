import { useMemo, useState } from 'react';
import categoriesData from '../data/categories.json';
import sayingsData from '../data/sayings.json';
import { CategoryFilter } from '../components/CategoryFilter';
import { SayingsBrowser } from '../components/SayingsBrowser';
import { useCompassStore } from '../store/compassStore';

export function CollectionSayingsSection() {
  const [category, setCategory] = useState(categoriesData[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, rateCollectionSaying } = useCompassStore();

  const filteredSayings = useMemo(
    () => sayingsData.filter((saying) => saying.categories.includes(category)),
    [category],
  );

  const collectionRatings = new Map(data.collection.sayings.map((saying) => [saying.id, saying.rating]));
  const effectiveSayings = filteredSayings.map((saying) => ({
    ...saying,
    rating: collectionRatings.get(saying.id) ?? saying.rating,
  }));

  return (
    <section className="view-stack">
      <CategoryFilter categories={categoriesData} value={category} onChange={(next) => {
        setCategory(next);
        setSelectedIndex(0);
      }} />
      <SayingsBrowser
        sayings={effectiveSayings}
        selectedIndex={Math.min(selectedIndex, Math.max(0, effectiveSayings.length - 1))}
        onSelect={setSelectedIndex}
        onRate={rateCollectionSaying}
      />
    </section>
  );
}
