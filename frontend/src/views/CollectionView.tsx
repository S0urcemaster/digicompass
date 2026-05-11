import { Button } from '../components/Button';
import { useCompassStore } from '../store/compassStore';
import { CollectionFociSection } from './CollectionFociSection';
import { CollectionImagesSection } from './CollectionImagesSection';
import { CollectionMindsetsSection } from './CollectionMindsetsSection';
import { CollectionSayingsSection } from './CollectionSayingsSection';

export function CollectionView() {
  const activeSection = useCompassStore((state) => state.activeCollectionSection);
  const setActiveSection = useCompassStore((state) => state.setActiveCollectionSection);

  return (
    <section className="view-stack">
      <div className="main-tab">
        <Button active={activeSection === 'images'} onClick={() => setActiveSection('images')}>
          Images
        </Button>
        <Button active={activeSection === 'sayings'} onClick={() => setActiveSection('sayings')}>
          Sayings
        </Button>
        <Button active={activeSection === 'foci'} onClick={() => setActiveSection('foci')}>
          Foci
        </Button>
        <Button active={activeSection === 'mindsets'} onClick={() => setActiveSection('mindsets')}>
          Mindsets
        </Button>
      </div>
      {activeSection === 'images' ? <CollectionImagesSection /> : null}
      {activeSection === 'sayings' ? <CollectionSayingsSection /> : null}
      {activeSection === 'foci' ? <CollectionFociSection /> : null}
      {activeSection === 'mindsets' ? <CollectionMindsetsSection /> : null}
    </section>
  );
}
