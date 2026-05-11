import { CardBrowser } from '../components/CardBrowser';
import { CategoryFilter } from '../components/CategoryFilter';
import { useCompassStore } from '../store/compassStore';
import { images } from '../utils/data';

export function CollectionImagesSection() {
  const selectedImageCategory = useCompassStore((state) => state.selectedImageCategory);
  const selectedCollectionImageId = useCompassStore((state) => state.selectedCollectionImageId);
  const setSelectedImageCategory = useCompassStore((state) => state.setSelectedImageCategory);
  const selectCollectionImage = useCompassStore((state) => state.selectCollectionImage);
  const rateImage = useCompassStore((state) => state.rateImage);
  const collectedImages = useCompassStore((state) => state.data.collection.images);

  const visibleImages = images
    .filter((image) => image.category === selectedImageCategory)
    .map((image) => collectedImages.find((collected) => collected.id === image.id) ?? image);

  return (
    <section className="view-stack">
      <CategoryFilter value={selectedImageCategory} onChange={setSelectedImageCategory} />
      <CardBrowser
        items={visibleImages.map((image) => ({
          id: image.id,
          image,
          rating: image.rating,
        }))}
        selectedId={selectedCollectionImageId}
        onSelect={selectCollectionImage}
        onRate={rateImage}
      />
    </section>
  );
}
