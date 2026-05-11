import { Button } from './Button';

interface CategoryFilterProps {
  categories: string[];
  categoryIndex: number;
  enabled: boolean;
  onPrevious: () => void;
  onToggle: () => void;
  onNext: () => void;
}

export function CategoryFilter({
  categories,
  categoryIndex,
  enabled,
  onPrevious,
  onToggle,
  onNext,
}: CategoryFilterProps) {
  const currentCategory = categories[categoryIndex] ?? categories[0] ?? 'Category';

  return (
    <div className="triple-row">
      <Button onClick={onPrevious}>{'<'}</Button>
      <Button active={enabled} onClick={onToggle}>
        {currentCategory}
      </Button>
      <Button onClick={onNext}>{'>'}</Button>
    </div>
  );
}
