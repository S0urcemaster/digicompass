import { Button } from './Button';
import type { ActiveView } from '../types/domain';

interface MainTabProps {
  activeView: ActiveView;
  onChange: (view: ActiveView) => void;
}

const tabs: Array<{ label: string; value: ActiveView }> = [
  { label: 'Navigator', value: 'navigator' },
  { label: 'Compass', value: 'compass' },
  { label: 'Collection', value: 'collection' },
];

export function MainTab({ activeView, onChange }: MainTabProps) {
  return (
    <div className="main-tab">
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          active={activeView === tab.value}
          onClick={() => onChange(tab.value)}
          type="button"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
