interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="border-b border-ink-100">
      <div className="container-wide py-12 md:py-16">
        {breadcrumb && (
          <p className="category-tag mb-3">{breadcrumb}</p>
        )}
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-ink-900 max-w-3xl leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-ink-500 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
