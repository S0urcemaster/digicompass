import type { ReactNode } from 'react';
import { Button } from '../../../components/Button';

type SelectableTileGridProps<T> = {
  desktopColumns?: 2 | 4;
  getKey: (item: T) => string | number;
  isSelected?: (item: T) => boolean;
  items: T[];
  onSelect: (item: T) => void;
  renderTile: (item: T) => ReactNode;
  variant: 'four' | 'eight';
};

export function SelectableTileGrid<T>({
  desktopColumns,
  getKey,
  isSelected,
  items,
  onSelect,
  renderTile,
  variant,
}: SelectableTileGridProps<T>) {
  const resolvedDesktopColumns = desktopColumns ?? (variant === 'eight' ? 4 : 2);
  const desktopGridClassName =
    resolvedDesktopColumns === 4 ? 'min-[900px]:grid-cols-4' : 'min-[900px]:grid-cols-2';

  return (
    <div className={`grid grid-cols-2 gap-0 ${desktopGridClassName}`}>
      {items.map((item) => (
        <Button
          align="left"
          key={getKey(item)}
          className="group relative overflow-hidden"
          onClick={() => onSelect(item)}
          selected={isSelected?.(item) ?? false}
          variant="surface"
        >
          {renderTile(item)}
        </Button>
      ))}
    </div>
  );
}
