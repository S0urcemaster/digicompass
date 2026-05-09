import { Button } from './Button';

interface CategoryFilterProps {
  categories: string[];
  value: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ categories, value, onChange }: CategoryFilterProps) {
  const currentIndex = categories.indexOf(value);
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const previous = categories[(safeIndex - 1 + categories.length) % categories.length];
  const next = categories[(safeIndex + 1) % categories.length];

  return (
    <div className="category-filter">
      <Button compact type="button" onClick={() => onChange(previous)}>
        &lt;-
      </Button>
      <Button type="button" className="category-pill" onClick={() => onChange(value)}>
        {value}
      </Button>
      <Button compact type="button" onClick={() => onChange(next)}>
        -&gt;
      </Button>
    </div>
  );
}
