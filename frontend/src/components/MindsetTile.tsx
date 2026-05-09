import { Button } from './Button';
import type { Mindset } from '../types/domain';

interface MindsetTileProps {
  mindset: Mindset;
  active?: boolean;
  onSelect: () => void;
}

export function MindsetTile({ mindset, active = false, onSelect }: MindsetTileProps) {
  return (
    <Button type="button" active={active} className="mindset-tile" onClick={onSelect}>
      <span className="mindset-tile-title">{mindset.name || 'Untitled mindset'}</span>
      <span className="mindset-tile-meta">{mindset.foci.length} foci</span>
    </Button>
  );
}
