interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export default function SectionHeading({
  label,
  title,
  description,
  centered = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
      {label && (
        <p className="category-tag mb-2">{label}</p>
      )}
      <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink-900">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-ink-500 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
