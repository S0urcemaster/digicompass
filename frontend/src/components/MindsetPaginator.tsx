import { Button } from './Button';
import type { Mindset } from '../types/domain';

interface MindsetPaginatorProps {
  mindsets: Mindset[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function MindsetPaginator({ mindsets, selectedIndex, onSelect }: MindsetPaginatorProps) {
  return (
    <div className="mindset-paginator">
      {mindsets.map((mindset, index) => (
        <Button
          key={mindset.id}
          type="button"
          compact
          active={index === selectedIndex}
          onClick={() => onSelect(index)}
        >
          {mindset.name}
        </Button>
      ))}
    </div>
  );
}
