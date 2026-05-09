import { Button } from './Button';
import { FocusCard } from './FocusCard';
import type { Focus } from '../domain/types';

interface PreviewFocusButtonProps {
  focus: Focus;
  onClick: () => void;
}

export const PreviewFocusButton = ({ focus, onClick }: PreviewFocusButtonProps) => (
  <Button className="preview-focus-button" onClick={onClick}>
    <FocusCard focus={focus} preview />
  </Button>
);
