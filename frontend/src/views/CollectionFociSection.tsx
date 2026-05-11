import { Button } from '../components/Button';
import { CardBrowser } from '../components/CardBrowser';
import { SayingsBrowser } from '../components/SayingsBrowser';
import { useCompassStore } from '../store/compassStore';

export function CollectionFociSection() {
  const activeMode = useCompassStore((state) => state.activeFociBrowserMode);
  const setActiveMode = useCompassStore((state) => state.setActiveFociBrowserMode);
  const collection = useCompassStore((state) => state.data.collection);
  const selectedCollectionFocusId = useCompassStore((state) => state.selectedCollectionFocusId);
  const selectedCollectionImageId = useCompassStore((state) => state.selectedCollectionImageId);
  const selectedCollectionSayingId = useCompassStore((state) => state.selectedCollectionSayingId);
  const selectCollectionFocus = useCompassStore((state) => state.selectCollectionFocus);
  const selectCollectionImage = useCompassStore((state) => state.selectCollectionImage);
  const selectCollectionSaying = useCompassStore((state) => state.selectCollectionSaying);
  const rateFocus = useCompassStore((state) => state.rateFocus);
  const rateImage = useCompassStore((state) => state.rateImage);
  const rateSaying = useCompassStore((state) => state.rateSaying);

  return (
    <section className="view-stack">
      <div className="mode-row">
        <Button active={activeMode === 'foci'} onClick={() => setActiveMode('foci')}>
          Foci
        </Button>
        <Button active={activeMode === 'images'} onClick={() => setActiveMode('images')}>
          Images
        </Button>
        <Button active={activeMode === 'sayings'} onClick={() => setActiveMode('sayings')}>
          Sayings
        </Button>
      </div>
      {activeMode === 'foci' ? (
        <CardBrowser
          items={collection.foci.map((focus) => ({
            id: focus.id,
            image: focus.image,
            saying: focus.saying,
            rating: focus.rating,
          }))}
          selectedId={selectedCollectionFocusId}
          onSelect={selectCollectionFocus}
          onRate={rateFocus}
        />
      ) : null}
      {activeMode === 'images' ? (
        <CardBrowser
          items={collection.images.map((image) => ({
            id: image.id,
            image,
            rating: image.rating,
          }))}
          selectedId={selectedCollectionImageId}
          onSelect={selectCollectionImage}
          onRate={rateImage}
        />
      ) : null}
      {activeMode === 'sayings' ? (
        <SayingsBrowser
          items={collection.sayings}
          selectedId={selectedCollectionSayingId}
          onSelect={selectCollectionSaying}
          onRate={rateSaying}
        />
      ) : null}
    </section>
  );
}
