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
        <p className="text-sm font-semibold text-accent-600 tracking-wide uppercase mb-2">
          {label}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900">{title}</h2>
      {description && (
        <p className="mt-3 text-gray-600 leading-relaxed">{description}</p>
      )}
    </div>
  );
}
