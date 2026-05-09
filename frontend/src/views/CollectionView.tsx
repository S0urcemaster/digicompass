import { Button } from '../components/Button';
import { useCompassStore } from '../store/compassStore';
import type { CollectionSection } from '../types/domain';
import { CollectionFociSection } from './CollectionFociSection';
import { CollectionImagesSection } from './CollectionImagesSection';
import { CollectionMindsetsSection } from './CollectionMindsetsSection';
import { CollectionSayingsSection } from './CollectionSayingsSection';

const sections: Array<{ value: CollectionSection; label: string }> = [
  { value: 'images', label: 'Images' },
  { value: 'sayings', label: 'Sayings' },
  { value: 'foci', label: 'Foci' },
  { value: 'mindsets', label: 'Mindsets' },
];

export function CollectionView() {
  const { collectionSection, setCollectionSection } = useCompassStore();

  return (
    <section className="view-stack">
      <div className="main-tab collection-subnav">
        {sections.map((section) => (
          <Button
            key={section.value}
            type="button"
            active={collectionSection === section.value}
            onClick={() => setCollectionSection(section.value)}
          >
            {section.label}
          </Button>
        ))}
      </div>
      {collectionSection === 'images' && <CollectionImagesSection />}
      {collectionSection === 'sayings' && <CollectionSayingsSection />}
      {collectionSection === 'foci' && <CollectionFociSection />}
      {collectionSection === 'mindsets' && <CollectionMindsetsSection />}
    </section>
  );
}
