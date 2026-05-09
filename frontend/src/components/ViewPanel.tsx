import type { PropsWithChildren } from 'react';

interface ViewPanelProps extends PropsWithChildren {
  title: string;
  text: string;
}

export const ViewPanel = ({ children, title, text }: ViewPanelProps) => (
  <section className="view-panel">
    <div className="view-panel-copy">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
    {children}
  </section>
);
