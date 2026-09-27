import { ShieldCheck, Upload, Search, ListChecks, MessageSquare, ArrowRight, CheckCircle2, AlertCircle, Clock, Users, TrendingUp, FileWarning } from 'lucide-react';

interface LandingPageProps {
  onTry: () => void;
  onLogin: () => void;
}

export function LandingPage({ onTry, onLogin }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <ShieldCheck size={20} />
            </div>
            <span className="text-lg font-bold text-gray-900">Recoverly</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onLogin} className="btn-ghost hidden sm:inline-flex">Log in</button>
            <button onClick={onTry} className="btn-primary">Try Recoverly</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 to-white" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              Your data stays in your browser — no upload to any server
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Find what your business needs to act on.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Upload your existing Excel or CSV data and Recoverly identifies overdue payments, unanswered quotations, customers needing follow-up and other business actions that deserve attention.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button onClick={onTry} className="btn-primary w-full sm:w-auto">
                Try Recoverly
                <ArrowRight size={18} />
              </button>
              <a href="#how-it-works" className="btn-secondary w-full sm:w-auto">See how it works</a>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl sm:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-2 text-xs text-gray-400">Recoverly Dashboard</span>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Money needing attention</p>
                  <p className="mt-1 text-xl font-bold text-red-600">GH₵18,500</p>
                  <p className="text-xs text-gray-400">3 records · Potentially overdue</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Sales opportunities</p>
                  <p className="mt-1 text-xl font-bold text-orange-600">GH₵32,000</p>
                  <p className="text-xs text-gray-400">5 records · Awaiting response</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">Follow-ups</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">7</p>
                  <p className="text-xs text-gray-400">Customers needing attention</p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs text-gray-500">High priority</p>
                  <p className="mt-1 text-xl font-bold text-red-600">4</p>
                  <p className="text-xs text-gray-400">Actions recommended today</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">High</span>
                  <span className="text-sm font-medium text-gray-900">ABC Construction Ltd</span>
                  <span className="hidden text-sm text-gray-500 sm:inline">Invoice INV-1042 · GH₵12,000 · Due 24 days ago</span>
                  <span className="ml-auto text-xs text-gray-400">Follow up regarding payment</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700">Medium</span>
                  <span className="text-sm font-medium text-gray-900">Accra Digital Services</span>
                  <span className="hidden text-sm text-gray-500 sm:inline">Quotation QT-220 · GH₵8,000 · No response for 9 days</span>
                  <span className="ml-auto text-xs text-gray-400">Follow up on quotation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-gray-100 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Upload size={24} />, title: 'Upload', desc: 'Upload your existing Excel or CSV.' },
              { icon: <Search size={24} />, title: 'Analyze', desc: 'Recoverly identifies important records and patterns.' },
              { icon: <ListChecks size={24} />, title: 'Prioritize', desc: 'See what needs attention today.' },
              { icon: <MessageSquare size={24} />, title: 'Act', desc: 'Generate a ready-to-edit follow-up message.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">{step.icon}</div>
                <p className="mt-4 text-sm font-semibold text-brand-600">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Recoverly finds */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">What Recoverly finds</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <AlertCircle size={20} />, text: 'Overdue invoices', color: 'text-red-600 bg-red-50' },
              { icon: <Clock size={20} />, text: 'Unanswered quotations', color: 'text-orange-600 bg-orange-50' },
              { icon: <Users size={20} />, text: 'Customers needing follow-up', color: 'text-orange-600 bg-orange-50' },
              { icon: <Clock size={20} />, text: 'Upcoming payment deadlines', color: 'text-yellow-600 bg-yellow-50' },
              { icon: <Users size={20} />, text: 'Inactive customers', color: 'text-gray-600 bg-gray-100' },
              { icon: <TrendingUp size={20} />, text: 'High-value opportunities', color: 'text-green-600 bg-green-50' },
              { icon: <FileWarning size={20} />, text: 'Missing or incomplete information', color: 'text-gray-600 bg-gray-100' },
              { icon: <CheckCircle2 size={20} />, text: 'Healthy records (no action needed)', color: 'text-green-600 bg-green-50' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>{item.icon}</div>
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Turn your business data into today's action list.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">No backend required. No data leaves your browser. Start with demo data in seconds.</p>
          <button onClick={onTry} className="btn-primary mt-8">
            Try Recoverly
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
              <ShieldCheck size={16} />
            </div>
            <span className="font-semibold text-gray-700">Recoverly</span>
          </div>
          <p className="text-sm text-gray-400">Find what your business needs to act on.</p>
        </div>
      </footer>
    </div>
  );
}
