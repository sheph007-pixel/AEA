import { Metadata } from 'next';
import Link from 'next/link';
import PageHero from '@/components/PageHero';

export const metadata: Metadata = {
  title: 'AI-Powered Employer Tools',
  description: 'Free AI tools for employers: HR advisor, compliance checker, policy reviewer, and document generator.',
};

const tools = [
  {
    title: 'HR & Compliance Advisor',
    description: 'Ask any HR or compliance question and get instant, practical guidance. Like having an HR advisor on demand.',
    href: '/tools/advisor',
    examples: ['Do I need to provide FMLA leave?', 'How do I handle an ADA accommodation request?', 'What are my overtime obligations?'],
  },
  {
    title: 'Compliance Checker',
    description: 'Enter your state, employee count, and industry to get a personalized compliance checklist.',
    href: '/tools/compliance-checker',
    examples: ['Federal requirements for your size', 'State-specific obligations', 'Industry-specific regulations'],
  },
  {
    title: 'Policy & Document Reviewer',
    description: 'Paste a job description, policy, or handbook section and get an AI-powered review for legal risks and missing language.',
    href: '/tools/policy-reviewer',
    examples: ['Job description compliance', 'Handbook policy gaps', 'ADA/FMLA language checks'],
  },
  {
    title: 'Document Generator',
    description: 'Generate customized employer documents: offer letters, job descriptions, handbook sections, termination letters, and more.',
    href: '/tools/document-generator',
    examples: ['Offer letters', 'Job descriptions', 'PIP templates', 'Termination letters'],
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        title="AI-Powered Employer Tools"
        subtitle="Practical AI tools built specifically for employers. Get instant HR guidance, compliance checklists, policy reviews, and custom documents."
        breadcrumb="AI Tools"
      />

      <section className="section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                className="block border border-ink-100 rounded p-8 hover:border-ink-300 hover:shadow-lg transition-all duration-200 group"
              >
                <h2 className="font-serif text-xl font-bold text-ink-900 group-hover:text-brand-red transition-colors">
                  {tool.title}
                </h2>
                <p className="mt-2 text-ink-500 leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400 mb-2">
                    Use it for
                  </p>
                  <ul className="space-y-1">
                    {tool.examples.map((ex) => (
                      <li key={ex} className="text-sm text-ink-600 flex items-center gap-2">
                        <span className="w-1 h-1 bg-brand-red rounded-full shrink-0" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <span className="text-sm font-semibold text-brand-red group-hover:text-brand-red-dark">
                    Try it free &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-50 section-padding">
        <div className="container-narrow text-center">
          <h2 className="font-serif text-2xl font-bold text-ink-900 mb-3">
            AI tools built for real employer needs
          </h2>
          <p className="text-ink-500 leading-relaxed max-w-xl mx-auto mb-6">
            These tools are powered by AI and designed specifically for employers
            with 2-500 employees. Try them free, then join AEA for unlimited access
            plus compliance alerts, resources, and cost-saving programs.
          </p>
          <Link href="/membership" className="btn-primary">
            Become a Member
          </Link>
        </div>
      </section>
    </>
  );
}
