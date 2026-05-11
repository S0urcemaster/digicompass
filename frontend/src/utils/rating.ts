export function clampRating(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function toStarValue(index: number): number {
  return (index + 1) / 5;
}

export function isStarActive(rating: number, index: number): boolean {
  return rating >= toStarValue(index);
}
