import { Button } from './Button';
import { useCompassStore } from '../store/compassStore';
import type { ViewName } from '../types/domain';

const tabs: ViewName[] = ['navigator', 'compass', 'collection'];

export function MainTab() {
  const activeView = useCompassStore((state) => state.activeView);
  const setActiveView = useCompassStore((state) => state.setActiveView);

  return (
    <div className="main-tab">
      {tabs.map((tab) => (
        <Button key={tab} active={tab === activeView} onClick={() => setActiveView(tab)}>
          {tab[0].toUpperCase()}
          {tab.slice(1)}
        </Button>
      ))}
    </div>
  );
}
