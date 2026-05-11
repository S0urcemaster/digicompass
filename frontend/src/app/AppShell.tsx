import { Button } from '../components/reusable/Button';
import { useCompassStore } from '../store/compassStore';
import { CollectionView } from '../views/CollectionView';
import { CompassView } from '../views/CompassView';
import { NavigatorView } from '../views/NavigatorView';
import type { ActiveView } from '../types/domain';

const tabs: ActiveView[] = ['navigator', 'compass', 'collection'];

export function AppShell() {
  const activeView = useCompassStore((state) => state.activeView);
  const setActiveView = useCompassStore((state) => state.setActiveView);

  return (
    <main className="app-frame">
      <div className="app-shell">
        <header className="app-header">
          <p className="eyebrow">Digi Compass</p>
          <h1>Mindsets for real situations</h1>
          <div className="pills-row">
            {tabs.map((tab) => (
              <Button active={tab === activeView} key={tab} onClick={() => setActiveView(tab)}>
                {tab}
              </Button>
            ))}
          </div>
        </header>
        <section className="app-content">
          {activeView === 'navigator' ? <NavigatorView /> : null}
          {activeView === 'compass' ? <CompassView /> : null}
          {activeView === 'collection' ? <CollectionView /> : null}
        </section>
      </div>
    </main>
  );
}
