import { Button } from './Button';

interface StarButtonProps {
  active: boolean;
  onClick: () => void;
}

export function StarButton({ active, onClick }: StarButtonProps) {
  return (
    <Button className="star-button" active={active} onClick={onClick} aria-label={active ? 'Active star' : 'Inactive star'}>
      ★
    </Button>
  );
}
