import type { CSSProperties } from 'react';
import { Button } from './Button';

type TabsVariant = 'nav' | 'default';

type TabItem<T extends string> = {
  disabled?: boolean;
  label: string;
  value: T;
};

type TabsProps<T extends string> = {
  activeValue: T;
  className?: string;
  items: TabItem<T>[];
  onChange?: (value: T) => void;
  style?: CSSProperties;
  variant?: TabsVariant;
};

export function Tabs<T extends string>({ activeValue, className, items, onChange, style, variant = 'default' }: TabsProps<T>) {
  return (
    <div className={className} style={style}>
      {items.map((item) => (
        <Button
          active={activeValue === item.value}
          key={item.value}
          disabled={item.disabled}
          fullWidth
          onClick={() => onChange?.(item.value)}
          shape="pill"
          variant={variant === 'nav' ? 'nav-tab' : 'tab'}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
