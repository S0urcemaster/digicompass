interface CollectionPlaceholderSectionProps {
  title: string;
  description: string;
}

export function CollectionPlaceholderSection({
  title,
  description,
}: CollectionPlaceholderSectionProps) {
  return (
    <section className="empty-panel">
      <h3>{title}</h3>
      <p>{description}</p>
    </section>
  );
}
