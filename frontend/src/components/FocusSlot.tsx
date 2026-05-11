interface FocusSlotProps {
  label: string;
  onClick?: () => void;
}

export function FocusSlot({ label, onClick }: FocusSlotProps) {
  return (
    <button type="button" className="focus-slot" onClick={onClick}>
      {label}
    </button>
  );
}
