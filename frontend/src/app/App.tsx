import { useCompassStore } from '../store/compassStore';

const VIEW_LABELS = {
  primary: 'Primary',
  'focus-editor': 'Focus Editor',
  collection: 'Collection',
} as const;

const getPreviewUrl = (url: string) => url.replace('/images/', '/images/preview/');

export function App() {
  const {
    activeView,
    data,
    selectedFocusIndex,
    selectedMindsetIndex,
    setActiveView,
    setUsername,
    selectFocus,
    selectMindset,
  } = useCompassStore();
  const currentMindset = data.mindsets[selectedMindsetIndex];
  const currentFocus = currentMindset?.foci[selectedFocusIndex] ?? currentMindset?.foci[0];
  const visibleFocusIndex = currentMindset?.foci.findIndex((focus) => focus === currentFocus) ?? 0;
  const remainingFoci =
    currentMindset?.foci.filter((_, index) => index !== visibleFocusIndex).slice(0, 4) ?? [];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
      <section className="rounded-[28px] border border-white/60 bg-panel/95 p-4 shadow-[0_20px_60px_rgba(56,45,24,0.12)] backdrop-blur sm:p-6">
        <header className="flex flex-col gap-5 border-b border-amber-950/10 pb-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Digi Compass</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">Mindsets for real situations</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Pick a mindset, focus on one visual saying, and keep the rest of the set one tap away.
              </p>
            </div>

            <label className="block sm:min-w-[220px]" htmlFor="username">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.24em] text-muted">Username</span>
              <input
                id="username"
                className="w-full rounded-full border border-amber-950/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
                value={data.username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(VIEW_LABELS).map(([view, label]) => {
              const selected = activeView === view;

              return (
                <button
                  key={view}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selected
                      ? 'bg-ink text-white shadow-[0_10px_25px_rgba(30,31,28,0.18)]'
                      : 'bg-white/80 text-muted ring-1 ring-amber-950/10 hover:bg-white hover:text-ink'
                  }`}
                  onClick={() => setActiveView(view as keyof typeof VIEW_LABELS)}
                  type="button"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </header>

        {activeView === 'primary' ? (
          currentMindset && currentFocus ? (
            <section className="mt-6 space-y-4 sm:space-y-6">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">Current mindset</p>
                    <p className="mt-1 text-2xl font-semibold text-ink">{currentMindset.name}</p>
                  </div>
                  <div className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    Rating {currentMindset.rating.toFixed(2)}
                  </div>
                </div>

                <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                  {data.mindsets.map((mindset, index) => {
                    const selected = index === selectedMindsetIndex;

                    return (
                      <button
                        key={`${mindset.name}-${index}`}
                        className={`min-w-fit rounded-full px-4 py-2 text-sm transition ${
                          selected
                            ? 'bg-[#b85042] text-white shadow-[0_14px_28px_rgba(184,80,66,0.28)]'
                            : 'bg-[#efe2cc] text-ink hover:bg-[#e8d5b6]'
                        }`}
                        onClick={() => selectMindset(index)}
                        type="button"
                      >
                        {mindset.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <article className="overflow-hidden rounded-[24px] bg-[#201a18] text-white shadow-[0_30px_80px_rgba(32,26,24,0.32)]">
                <div className="relative min-h-[420px] w-full sm:min-h-[560px]">
                  <img
                    alt={currentFocus.saying.text}
                    className="absolute inset-0 h-full w-full object-cover"
                    src={currentFocus.image.url}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/10 to-black/70" />
                  <div
                    className="absolute left-1/2 z-10 w-[88%] -translate-x-1/2 text-center font-serif leading-[1.08] text-white drop-shadow-[0_6px_12px_rgba(0,0,0,0.48)]"
                    style={{
                      fontSize: `clamp(1.65rem, ${currentFocus.saying.fontSize / 18}vw, ${currentFocus.saying.fontSize}px)`,
                      top: `${currentFocus.saying.top}%`,
                    }}
                  >
                    {currentFocus.saying.text}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
                    <div className="rounded-[22px] border border-white/15 bg-black/30 p-3 backdrop-blur-md sm:p-4">
                      <div className="mb-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
                        <span>Other foci</span>
                        <span>{remainingFoci.length} previews</span>
                      </div>

                      <div className="space-y-2">
                        {remainingFoci.map((focus) => {
                          const nextIndex = currentMindset.foci.indexOf(focus);

                          return (
                            <button
                              key={`${focus.saying.id}-${focus.image.id}`}
                              className="flex w-full items-center gap-3 rounded-[18px] bg-white/10 p-2 text-left transition hover:bg-white/18"
                              onClick={() => selectFocus(nextIndex)}
                              type="button"
                            >
                              <img
                                alt={focus.saying.text}
                                className="h-16 w-16 rounded-[14px] object-cover sm:h-20 sm:w-20"
                                src={getPreviewUrl(focus.image.url)}
                              />
                              <div className="min-w-0 flex-1">
                                <p className="line-clamp-3 text-sm leading-5 text-white/95">{focus.saying.text}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/60">
                                  Focus rating {focus.rating.toFixed(2)}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <section className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[20px] bg-[#f4e8d5] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Focus rating</p>
                  <p className="mt-2 text-2xl font-semibold text-ink">{currentFocus.rating.toFixed(2)}</p>
                </div>
                <div className="rounded-[20px] bg-[#e8efe8] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Categories</p>
                  <p className="mt-2 text-sm leading-6 text-ink">
                    {currentFocus.saying.categories.map((category) => category.text).join(' / ')}
                  </p>
                </div>
                <div className="rounded-[20px] bg-[#e4ebf1] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Notes</p>
                  <p className="mt-2 text-sm leading-6 text-ink">{currentFocus.notes || 'No notes yet.'}</p>
                </div>
              </section>
            </section>
          ) : (
            <p className="mt-6 text-sm text-muted">No mindset data available.</p>
          )
        ) : (
          <section className="mt-6 rounded-[24px] border border-dashed border-amber-950/15 bg-[#fbf6ec] p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{VIEW_LABELS[activeView]}</p>
            <h2 className="mt-2 text-2xl font-semibold text-ink">Prepared in store, not designed yet</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              The store already supports view switching and focus editing state. This screen is intentionally left as
              the next implementation step while the primary mobile view is now aligned with the spec.
            </p>
          </section>
        )}
      </section>
    </main>
  );
}
