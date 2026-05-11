import type { Mindset } from '../../types/domain';
import { Button } from './Button';

interface MindsetPaginatorProps {
  mindsets: Mindset[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function MindsetPaginator({ mindsets, selectedIndex, onSelect }: MindsetPaginatorProps) {
  return (
    <div className="pills-row">
      {mindsets.map((mindset, index) => (
        <Button active={index === selectedIndex} key={mindset.id} onClick={() => onSelect(index)}>
          {mindset.name}
        </Button>
      ))}
    </div>
  );
}
