import type { CSSProperties } from 'react';
import type { Rating, Saying } from '../../../types/domain';
import { StarRating } from '../shared/StarRating';

type CollectionSayingPanelProps = {
  panelClassName?: string;
  onSetRating: (rating: Rating) => void;
  saying: Saying;
  showSayingId?: boolean;
};

const getSayingFontSize = (fontSize: number): CSSProperties => ({
  fontSize: `clamp(1.85rem, ${fontSize / 14}vw, ${fontSize * 1.12}px)`,
  lineHeight: 1.08,
});

export function CollectionSayingPanel({
  panelClassName,
  onSetRating,
  saying,
  showSayingId = false,
}: CollectionSayingPanelProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-[28px] border border-amber-950/10 bg-[linear-gradient(145deg,#fff8ef_0%,#f6ead8_48%,#ead5b1_100%)] shadow-[0_30px_90px_rgba(32,26,24,0.18)] ${panelClassName ?? ''}`}
    >
      <div className="flex min-h-[26rem] flex-col px-6 pb-6 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
        <div className="flex items-start justify-between gap-4">
          <p className="inline-flex rounded-full bg-[#fff7ed]/92 px-3 py-2 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[#1f1712] shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
            {saying.categories[0]?.text ?? 'Unsortiert'}
          </p>
          {showSayingId ? (
            <div className="shrink-0 rounded-full border border-[#fff7ed]/16 bg-[#fff7ed]/92 px-5 py-2 text-3xl font-semibold text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
              {saying.id}
            </div>
          ) : null}
        </div>

        <div className="flex flex-1 items-center justify-center py-12 text-center">
          <p className="max-w-[12ch] font-semibold tracking-[-0.04em] text-[#1f1712]" style={getSayingFontSize(saying.fontSize)}>
            {saying.text}
          </p>
        </div>

        <div className="ml-auto max-w-[26rem]">
          <StarRating
            className="w-full justify-between rounded-full bg-[#fff7ed]/92 px-2 py-2 text-[#1f1712] shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
            buttonClassName="flex-1 text-center"
            rating={saying.rating}
            starClassName="text-[3.25rem]"
            tone="dark"
            onChange={onSetRating}
          />
        </div>
      </div>
    </article>
  );
}
