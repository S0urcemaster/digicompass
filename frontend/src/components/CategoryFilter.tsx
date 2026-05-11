import { Button } from './Button';
import { categories } from '../utils/data';

interface CategoryFilterProps {
  value: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const currentIndex = Math.max(categories.indexOf(value), 0);
  const previousCategory = categories[(currentIndex - 1 + categories.length) % categories.length];
  const nextCategory = categories[(currentIndex + 1) % categories.length];

  return (
    <div className="category-filter">
      <Button onClick={() => onChange(previousCategory)}>{'<-'}</Button>
      <Button active>{value}</Button>
      <Button onClick={() => onChange(nextCategory)}>{'->'}</Button>
    </div>
  );
}
