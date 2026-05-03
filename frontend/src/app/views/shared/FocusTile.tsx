type FocusTileProps = {
  focus: {
    saying: {
      categories: Array<{
        text: string;
      }>;
      text: string;
      fontSize: number;
    };
    image: {
      url: string;
    };
  };
  variant?: 'main' | 'preview';
};

export function FocusTile({ focus, variant = 'preview' }: FocusTileProps) {
  const isMain = variant === 'main';
  const previewCategory = focus.saying.categories[0]?.text ?? 'Unsortiert';

  return (
    <div
      className={`relative overflow-hidden bg-[#201a18] text-white ${
        isMain ? 'aspect-[733/1024] rounded-[24px]' : 'aspect-[733/1024] rounded-[20px]'
      }`}
    >
      <img
        alt={focus.saying.text}
        className="absolute inset-0 h-full w-full object-cover"
        decoding="async"
        fetchPriority={isMain ? 'high' : 'low'}
        loading={isMain ? 'eager' : 'lazy'}
        src={focus.image.url}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/65" />
      <div
        className={`absolute left-1/2 top-[8%] z-10 w-[88%] -translate-x-1/2 text-center font-serif leading-[1.08] drop-shadow-[0_6px_12px_rgba(0,0,0,0.48)] ${
          isMain ? '' : 'px-2'
        }`}
        style={{
          color: '#0e0601',
          fontSize: isMain
            ? `clamp(3.3rem, ${focus.saying.fontSize / 9}vw, ${focus.saying.fontSize * 2}px)`
            : `clamp(1.425rem, ${focus.saying.fontSize / 18.67}vw, ${Math.max(30, focus.saying.fontSize * 0.72)}px)`,
        }}
      >
        {focus.saying.text}
      </div>
      {!isMain ? (
        <div className="absolute left-2 top-2 z-10">
          <p className="inline-flex rounded-full bg-[#fff7ed]/92 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f1712] shadow-[0_6px_18px_rgba(0,0,0,0.16)]">
            {previewCategory}
          </p>
        </div>
      ) : null}
    </div>
  );
}
