type FocusEditorViewProps = {
  label: string;
};

export function FocusEditorView({ label }: FocusEditorViewProps) {
  return (
    <section className="mt-6 rounded-[24px] border border-dashed border-amber-950/15 bg-[#fbf6ec] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">{label}</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Im Store vorbereitet, aber noch nicht gestaltet</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
        Der Fokus-Editor ist der nächste Screen nach den Sammlungsbildern. Sein Zustand existiert bereits, aber
        seine UI ist bewusst noch ausstehend.
      </p>
    </section>
  );
}
