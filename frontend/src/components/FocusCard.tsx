import { Card } from './Card';
import type { Focus } from '../types/domain';

interface FocusCardProps {
  focus: Focus;
  onRate: (rating: number) => void;
  size?: 'selected' | 'preview';
}

export function FocusCard({ focus, onRate, size = 'selected' }: FocusCardProps) {
  return <Card image={focus.image} saying={focus.saying} rating={focus.rating} onRate={onRate} size={size} />;
}
