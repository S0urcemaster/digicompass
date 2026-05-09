import { MainTab } from './MainTab';
import type { ViewName } from '../domain/types';

interface HeaderProps {
  activeView: ViewName;
  onChangeView: (view: ViewName) => void;
}

const tabs: Array<{ label: string; view: ViewName }> = [
  { label: 'Navigator', view: 'navigator' },
  { label: 'Compass', view: 'compass' },
  { label: 'Collection', view: 'collection' },
];

export const Header = ({ activeView, onChangeView }: HeaderProps) => (
  <header className="app-header">
    <div className="app-brand">
      <h1>Digi Compass</h1>
      <p>Mindsets for real situations</p>
    </div>
    <nav className="main-tab-row" aria-label="Primary">
      {tabs.map((tab) => (
        <MainTab
          key={tab.view}
          active={tab.view === activeView}
          label={tab.label}
          onClick={() => onChangeView(tab.view)}
          view={tab.view}
        />
      ))}
    </nav>
  </header>
);
