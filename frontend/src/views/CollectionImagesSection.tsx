import { useMemo, useState } from 'react';
import categoriesData from '../data/categories.json';
import imagesData from '../data/images.json';
import { CardBrowser } from '../components/CardBrowser';
import { CategoryFilter } from '../components/CategoryFilter';
import { ImageCard } from '../components/ImageCard';
import { useCompassStore } from '../store/compassStore';

export function CollectionImagesSection() {
  const [category, setCategory] = useState(categoriesData[0]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data, rateCollectionImage } = useCompassStore();

  const filteredImages = useMemo(
    () => imagesData.filter((image) => image.category === category),
    [category],
  );

  const selectedImageId = filteredImages[selectedIndex]?.id;
  const collectionRatings = new Map(data.collection.images.map((image) => [image.id, image.rating]));

  return (
    <section className="view-stack">
      <CategoryFilter categories={categoriesData} value={category} onChange={(next) => {
        setCategory(next);
        setSelectedIndex(0);
      }} />
      <CardBrowser
        items={filteredImages}
        selectedIndex={Math.min(selectedIndex, Math.max(0, filteredImages.length - 1))}
        onSelect={setSelectedIndex}
        renderSelected={(image) => (
          <ImageCard
            image={image}
            rating={collectionRatings.get(image.id) ?? image.rating}
            onRate={(rating) => rateCollectionImage(image.id, rating)}
          />
        )}
        renderPreview={(image) => (
          <ImageCard image={image} rating={collectionRatings.get(image.id) ?? image.rating} size="preview" />
        )}
      />
      <div className="meta-note">
        Selected image id: {selectedImageId ?? 'none'}
      </div>
    </section>
  );
}
