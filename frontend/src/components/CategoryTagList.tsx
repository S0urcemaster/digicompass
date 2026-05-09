interface CategoryTagListProps {
  categories: string[];
}

export const CategoryTagList = ({ categories }: CategoryTagListProps) => (
  <div className="category-tag-list">
    {categories.map((category) => (
      <span key={category} className="category-tag">
        {category}
      </span>
    ))}
  </div>
);
