import type { Mindset } from '../types/domain';

interface MindsetListProps {
  mindsets: Mindset[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function MindsetList({ mindsets, selectedIndex, onSelect }: MindsetListProps) {
  if (mindsets.length === 0) {
    return <p className="text-sm text-muted">No mindsets yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {mindsets.map((mindset, index) => (
        <li key={`${mindset.name}-${index}`}>
          <button
            className={`w-full rounded-md border px-3 py-2 text-left transition ${
              selectedIndex === index
                ? 'border-accent bg-accent/10'
                : 'border-slate-300 hover:border-accent/40'
            }`}
            onClick={() => onSelect(index)}
            type="button"
          >
            <p className="font-medium">{mindset.name}</p>
            <p className="text-xs text-muted">{mindset.foci.length} foci</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
