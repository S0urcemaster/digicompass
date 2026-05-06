import type { CSSProperties } from 'react';
import type { Rating, Saying } from '../../../types/domain';
import { StarRating } from '../shared/StarRating';

type CollectionSayingPanelProps = {
  onSelect?: () => void;
  panelClassName?: string;
  onSetRating: (rating: Rating) => void;
  saying: Saying;
  selected?: boolean;
  showSayingId?: boolean;
  variant?: 'main' | 'preview';
};

const getSayingFontSize = (fontSize: number, variant: 'main' | 'preview'): CSSProperties =>
  variant === 'main'
    ? {
        fontSize: `clamp(1.85rem, ${fontSize / 14}vw, ${fontSize * 1.12}px)`,
        lineHeight: 1.08,
      }
    : {
        fontSize: `clamp(1rem, ${fontSize / 20}vw, ${Math.max(20, fontSize * 0.56)}px)`,
        lineHeight: 1.1,
      };

export function CollectionSayingPanel({
  onSelect,
  panelClassName,
  onSetRating,
  saying,
  selected = false,
  showSayingId = false,
  variant = 'main',
}: CollectionSayingPanelProps) {
  const isMain = variant === 'main';

  return (
    <article
      className={`relative overflow-hidden border border-amber-950/10 bg-[linear-gradient(145deg,#fff8ef_0%,#f6ead8_48%,#ead5b1_100%)] shadow-[0_30px_90px_rgba(32,26,24,0.18)] ${
        selected ? 'ring-2 ring-accent/40' : ''
      } ${panelClassName ?? ''}`}
    >
      {onSelect ? (
        <button
          aria-label={`Spruch ${saying.id} auswählen`}
          className="absolute inset-0 z-0"
          onClick={onSelect}
          type="button"
        />
      ) : null}
      <div className={`flex flex-col ${isMain ? 'min-h-[26rem] px-6 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7' : 'min-h-[11.75rem] px-4 py-4'}`}>
        <div className="flex items-start justify-between gap-4">
          <p className={`inline-flex bg-[#fff7ed]/92 font-semibold uppercase tracking-[0.16em] text-[#1f1712] shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${isMain ? 'px-3 py-2 text-[0.8rem]' : 'px-2.5 py-1 text-[0.68rem]'}`}>
            {saying.categories[0]?.text ?? 'Unsortiert'}
          </p>
          {showSayingId ? (
            <div className={`shrink-0 border border-[#fff7ed]/16 bg-[#fff7ed]/92 font-semibold text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.12)] ${isMain ? 'px-5 py-2 text-3xl' : 'px-3 py-1 text-lg'}`}>
              {saying.id}
            </div>
          ) : null}
        </div>

        <div className={`flex flex-1 items-center justify-center text-center ${isMain ? 'py-12' : 'py-6'}`}>
          <p className={`font-semibold tracking-[-0.04em] text-[#1f1712] ${isMain ? 'max-w-[12ch]' : 'max-w-[16ch]'}`} style={getSayingFontSize(saying.fontSize, variant)}>
            {saying.text}
          </p>
        </div>

        <div className={`ml-auto ${isMain ? 'max-w-[26rem]' : 'w-full'}`}>
          <StarRating
            rating={saying.rating}
            tone="dark"
            variant={isMain ? 'saying-main' : 'saying-preview'}
            onChange={onSetRating}
          />
        </div>
      </div>
    </article>
  );
}
