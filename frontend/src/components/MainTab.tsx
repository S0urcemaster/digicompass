import { Button } from './Button';
import type { ViewName } from '../domain/types';

interface MainTabProps {
  active: boolean;
  label: string;
  onClick: () => void;
  view: ViewName;
}

export const MainTab = ({ active, label, onClick, view }: MainTabProps) => (
  <Button
    aria-pressed={active}
    className={`main-tab ${active ? 'main-tab-active' : ''}`}
    data-view={view}
    onClick={onClick}
  >
    {label}
  </Button>
);
