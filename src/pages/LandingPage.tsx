```tsx
import {
  ShieldCheck,
  Upload,
  Search,
  ListChecks,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Users,
  TrendingUp,
  FileWarning,
} from 'lucide-react';

interface LandingPageProps {
  onTry: () => void;
  onLogin: () => void;
}

export function LandingPage({ onTry, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-bold text-gray-900">Recoverly</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogin}
              className="btn-ghost hidden sm:inline-flex"
            >
              Log in
            </button>

            <button onClick={onTry} className="btn-primary">
              Start Free Trial
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 to-white" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Works with the Excel and CSV files you already use
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Stop losing money in your spreadsheet.
            </h1>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
              Recoverly analyzes your existing Excel or CSV data and shows you
              the unpaid invoices, unanswered quotations, customer follow-ups,
              and sales opportunities that need attention.
            </p>

            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-gray-800">
              Keep using your Excel. Recoverly shows you what needs action.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={onTry}
                className="btn-primary w-full sm:w-auto"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </button>

              <a
                href="#how-it-works"
                className="btn-secondary w-full sm:w-auto"
              >
                See how it works
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              No credit card required to start.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">
                  Recoverly Dashboard
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Money needing attention
                  </p>
                  <p className="mt-1 text-xl font-bold text-red-600">
                    GH₵18,500
                  </p>
                  <p className="text-xs text-gray-400">
                    3 records · Potentially overdue
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">
                    Sales opportunities
                  </p>
                  <p className="mt-1 text-xl font-bold text-orange-600">
                    GH₵32,000
                  </p>
                  <p className="text-xs text-gray-400">
                    5 records · Awaiting response
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Follow-ups</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">7</p>
                  <p className="text-xs text-gray-400">
                    Customers needing attention
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">High priority</p>
                  <p className="mt-1 text-xl font-bold text-red-600">4</p>
                  <p className="text-xs text-gray-400">
                    Actions recommended today
                  </p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
                    High
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    ABC Construction Ltd
                  </span>

                  <span className="hidden text-sm text-gray-500 sm:inline">
                    Invoice INV-1042 · GH₵12,000 · Due 24 days ago
                  </span>

                  <span className="ml-auto text-xs text-gray-400">
                    Follow up regarding payment
                  </span>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700">
                    Medium
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    Accra Digital Services
                  </span>

                  <span className="hidden text-sm text-gray-500 sm:inline">
                    Quotation QT-220 · GH₵8,000 · No response for 9 days
                  </span>

                  <span className="ml-auto text-xs text-gray-400">
                    Follow up on quotation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-gray-100 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            Your data already contains the answers
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
            Your spreadsheet has the information.
            <br />
            Recoverly finds what needs attention.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-600">
            Businesses often have unpaid invoices, pending quotations and
            customers waiting for follow-up hidden inside everyday records.
            Recoverly turns those records into a clear action list.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="bg-gray-50 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Simple workflow
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              From spreadsheet to action in minutes.
            </h2>

            <p className="mt-4 text-gray-600">
              You don't need to replace your existing system.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Upload size={24} />,
                title: 'Upload',
                desc: 'Upload your existing Excel or CSV file.',
              },
              {
                icon: <Search size={24} />,
                title: 'Analyze',
                desc: 'Recoverly examines your business records.',
              },
              {
                icon: <ListChecks size={24} />,
                title: 'Prioritize',
                desc: 'See which records need attention first.',
              },
              {
                icon: <MessageSquare size={24} />,
                title: 'Act',
                desc: 'Use the information to follow up and take action.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
                  {step.icon}
                </div>

                <p className="mt-4 text-sm font-semibold text-brand-600">
                  Step {i + 1}
                </p>

                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Recoverly Finds */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Find opportunities
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              What Recoverly finds
            </h2>

            <p className="mt-4 text-gray-600">
              Turn scattered records into a prioritized list of things your
              business can act on.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <AlertCircle size={20} />,
                text: 'Overdue invoices',
                color: 'text-red-600 bg-red-50',
              },
              {
                icon: <Clock size={20} />,
                text: 'Unanswered quotations',
                color: 'text-orange-600 bg-orange-50',
              },
              {
                icon: <Users size={20} />,
                text: 'Customers needing follow-up',
                color: 'text-orange-600 bg-orange-50',
              },
              {
                icon: <Clock size={20} />,
                text: 'Upcoming payment deadlines',
                color: 'text-yellow-600 bg-yellow-50',
              },
              {
                icon: <Users size={20} />,
                text: 'Inactive customers',
                color: 'text-gray-600 bg-gray-100',
              },
              {
                icon: <TrendingUp size={20} />,
                text: 'High-value opportunities',
                color: 'text-green-600 bg-green-50',
              },
              {
                icon: <FileWarning size={20} />,
                text: 'Missing or incomplete information',
                color: 'text-gray-600 bg-gray-100',
              },
              {
                icon: <CheckCircle2 size={20} />,
                text: 'Healthy records with no action needed',
                color: 'text-green-600 bg-green-50',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}
                >
                  {item.icon}
                </div>

                <span className="text-sm font-medium text-gray-700">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Built for growing businesses
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              If your business follows up on money or customers, Recoverly is
              for you.
            </h2>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              'Construction companies',
              'Real-estate businesses',
              'Agencies',
              'Wholesalers',
              'Distributors',
              'Suppliers',
              'Service businesses',
              'Other SMEs',
            ].map((business, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3"
              >
                <CheckCircle2
                  size={18}
                  className="shrink-0 text-brand-600"
                />
                <span className="text-sm font-medium text-gray-700">
                  {business}
                </span>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-brand-100 bg-brand-50 p-6 text-center">
            <p className="text-lg font-semibold text-gray-900">
              Keep using your Excel.
            </p>

            <p className="mt-2 text-gray-600">
              Recoverly doesn't ask you to replace your existing workflow. It
              helps you understand what deserves attention inside the data you
              already have.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              Simple pricing
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Start small. Recover more.
            </h2>

            <p className="mt-4 text-gray-600">
              Choose the plan that fits the amount of business data you need
              to analyze.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* Starter */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Starter
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                For small businesses getting started.
              </p>

              <div className="mt-6">
                <span className="text-3xl font-bold text-gray-900">
                  GH₵150
                </span>
                <span className="text-sm text-gray-500"> / month</span>
              </div>

              <p className="mt-2 text-sm font-medium text-brand-600">
                20 analyses
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'Excel and CSV uploads',
                  'Money needing attention',
                  'Sales opportunities',
                  'Customer follow-ups',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-brand-600"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={onTry}
                className="btn-secondary mt-8 w-full"
              >
                Start Free Trial
              </button>
            </div>

            {/* Business */}
            <div className="relative rounded-2xl border-2 border-brand-600 bg-white p-6 shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                Most Popular
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                Business
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                For growing teams with more records.
              </p>

              <div className="mt-6">
                <span className="text-3xl font-bold text-gray-900">
                  GH₵300
                </span>
                <span className="text-sm text-gray-500"> / month</span>
              </div>

              <p className="mt-2 text-sm font-medium text-brand-600">
                50 analyses
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'Excel and CSV uploads',
                  'Money needing attention',
                  'Sales opportunities',
                  'Customer follow-ups',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-brand-600"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={onTry}
                className="btn-primary mt-8 w-full"
              >
                Start Free Trial
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Pro</h3>

              <p className="mt-2 text-sm text-gray-500">
                For businesses handling larger volumes.
              </p>

              <div className="mt-6">
                <span className="text-3xl font-bold text-gray-900">
                  GH₵600
                </span>
                <span className="text-sm text-gray-500"> / month</span>
              </div>

              <p className="mt-2 text-sm font-medium text-brand-600">
                200 analyses
              </p>

              <ul className="mt-6 space-y-3">
                {[
                  'Excel and CSV uploads',
                  'Money needing attention',
                  'Sales opportunities',
                  'Customer follow-ups',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-brand-600"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <button
                onClick={onTry}
                className="btn-secondary mt-8 w-full"
              >
                Start Free Trial
              </button>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Start with the free trial and choose a paid plan when you're ready.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gray-900 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Your next recovered payment could already be in your spreadsheet.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
            Upload your existing business data, find what needs attention, and
            take action.
          </p>

          <button
            onClick={onTry}
            className="btn-primary mt-8"
          >
            Start Free Trial
            <ArrowRight size={18} />
          </button>

          <p className="mt-4 text-sm text-gray-400">
            No credit card required to start.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ShieldCheck size={16} />
            </div>

            <span className="font-semibold text-gray-700">Recoverly</span>
          </div>

          <p className="text-sm text-gray-400">
            Find what your business needs to act on.
          </p>
        </div>
      </footer>
    </div>
  );
}
```
