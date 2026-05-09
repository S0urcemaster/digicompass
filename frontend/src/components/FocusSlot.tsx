import { Button } from './Button';
import type { Focus } from '../types/domain';

interface FocusSlotProps {
  index: number;
  focus?: Focus;
  active?: boolean;
  onSelect: () => void;
}

export function FocusSlot({ index, focus, active = false, onSelect }: FocusSlotProps) {
  return (
    <Button type="button" active={active} className="focus-slot" onClick={onSelect}>
      <span className="focus-slot-label">Slot {index + 1}</span>
      <span className="focus-slot-value">{focus ? focus.saying.text : 'Assign focus'}</span>
    </Button>
  );
}
