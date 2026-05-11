import { Button } from './Button';

interface StarButtonProps {
  active: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export function StarButton({ active, disabled = false, onSelect }: StarButtonProps) {
  return (
    <Button
      aria-label={active ? 'Active star' : 'Inactive star'}
      className={`star-button ${active ? 'star-button-active' : ''}`}
      compact
      disabled={disabled}
      onClick={onSelect}
    >
      ★
    </Button>
  );
}
