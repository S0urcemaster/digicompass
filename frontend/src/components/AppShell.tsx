import { Header } from './Header';
import type { PropsWithChildren } from 'react';
import type { ViewName } from '../domain/types';

interface AppShellProps extends PropsWithChildren {
  activeView: ViewName;
  onChangeView: (view: ViewName) => void;
}

export const AppShell = ({ activeView, children, onChangeView }: AppShellProps) => (
  <div className="app-frame">
    <Header activeView={activeView} onChangeView={onChangeView} />
    <main className="app-main">{children}</main>
  </div>
);
