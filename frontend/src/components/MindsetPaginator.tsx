import { Button } from './Button';
import { Paginator } from './Paginator';
import type { Mindset } from '../domain/types';

interface MindsetPaginatorProps {
  mindsets: Mindset[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export const MindsetPaginator = ({
  mindsets,
  selectedIndex,
  onSelect,
}: MindsetPaginatorProps) => (
  <Paginator className="mindset-paginator">
    {mindsets.map((mindset, index) => (
      <Button
        key={`${mindset.name}-${index}`}
        aria-pressed={selectedIndex === index}
        className={`mindset-button ${selectedIndex === index ? 'mindset-button-active' : ''}`}
        onClick={() => onSelect(index)}
      >
        {mindset.name}
      </Button>
    ))}
  </Paginator>
);
