import { MindsetList } from '../components/MindsetList';
import { useCompassStore } from '../store/compassStore';

export function App() {
  const { data, selectedMindsetIndex, setUsername, selectMindset } = useCompassStore();
  const currentMindset = data.mindsets[selectedMindsetIndex];

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-8">
      <header className="mb-8 rounded-xl bg-panel p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-ink">Digi Compass</h1>
        <p className="mt-2 text-sm text-muted">Compose and rate mindset anchors from sayings and AI images.</p>
        <label className="mt-4 block text-sm font-medium text-ink" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          className="mt-1 w-full max-w-sm rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          value={data.username}
          onChange={(event) => setUsername(event.target.value)}
        />
      </header>

      <section className="grid gap-6 md:grid-cols-[280px_1fr]">
        <aside className="rounded-xl bg-panel p-4 shadow-sm">
          <h2 className="mb-3 text-lg font-medium text-ink">Mindsets</h2>
          <MindsetList mindsets={data.mindsets} selectedIndex={selectedMindsetIndex} onSelect={selectMindset} />
        </aside>

        <article className="rounded-xl bg-panel p-6 shadow-sm">
          <h2 className="text-lg font-medium text-ink">Current Mindset</h2>
          {currentMindset ? (
            <div className="mt-3 space-y-2 text-sm text-ink">
              <p>Name: {currentMindset.name}</p>
              <p>Anchors: {currentMindset.anchors.length}</p>
              <p>Rating: {currentMindset.rating.toFixed(2)}</p>
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted">Create a mindset to start editing.</p>
          )}
        </article>
      </section>
    </main>
  );
}
