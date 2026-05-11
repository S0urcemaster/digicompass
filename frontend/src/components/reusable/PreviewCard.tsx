import type { PropsWithChildren, ReactNode } from 'react';
import { Card } from './Card';

interface PreviewCardProps extends PropsWithChildren {
  categories?: string[];
  rating: number;
  ratingInteractive?: boolean;
  onRatingChange?: (rating: number) => void;
  footerContent?: ReactNode;
  tone?: string;
}

export function PreviewCard(props: PreviewCardProps) {
  return <Card {...props} preview />;
}
