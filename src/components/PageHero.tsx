interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHero({ title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="bg-navy-900 text-white">
      <div className="container-wide py-16 md:py-20">
        {breadcrumb && (
          <p className="text-navy-300 text-sm mb-3 tracking-wide uppercase">
            {breadcrumb}
          </p>
        )}
        <h1 className="text-3xl md:text-4.5xl font-bold max-w-3xl">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-lg text-navy-200 max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
