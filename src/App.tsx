import { useState } from 'react';
import { Lock, MapPin } from 'lucide-react';
import BusinessContextForm, { BusinessContext } from './components/BusinessContextForm';
import PlaybookOutput from './components/PlaybookOutput';

const defaultContext: BusinessContext = {
  businessName: '',
  location: '',
  rooms: '2',
  challenge: '',
  traffic: 'No foot traffic / pure destination',
  peakSeason: 'Fall/Halloween',
  competitorDistance: '10-30 miles',
  usp: '',
};

export default function App() {
  const [context, setContext] = useState<BusinessContext>(defaultContext);
  const [playbook, setPlaybook] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setPlaybook(null);

    try {
      const res = await fetch('/.netlify/functions/generate-playbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setPlaybook(data.playbook);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Top nav */}
      <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/20">
              <Lock size={14} className="text-slate-950" strokeWidth={2.5} />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-100 tracking-tight">EscapePlaybook</span>
              <span className="hidden sm:inline text-xs text-slate-500 font-medium">Marketing & SEO Generator</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <MapPin size={12} />
            <span>Destination Venue Intelligence</span>
          </div>
        </div>
      </header>

      {/* Main two-panel layout */}
      <main className="flex-1 flex overflow-hidden max-w-screen-2xl w-full mx-auto">

        {/* Left panel — Form (40%) */}
        <aside className="w-2/5 flex-shrink-0 border-r border-slate-800 bg-slate-900/40 flex flex-col overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b border-slate-800/60">
            <h2 className="text-base font-bold text-slate-100">Venue Context</h2>
            <p className="text-xs text-slate-500 mt-0.5">The more specific you are, the sharper the playbook.</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <BusinessContextForm
              context={context}
              onChange={setContext}
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>
        </aside>

        {/* Right panel — Output (60%) */}
        <section className="flex-1 flex flex-col overflow-hidden bg-slate-950">
          {error && (
            <div className="mx-6 mt-4 bg-red-950/60 border border-red-800/60 rounded-lg px-4 py-3 text-sm text-red-300 flex-shrink-0">
              <span className="font-semibold">Error: </span>{error}
            </div>
          )}
          <PlaybookOutput
            playbook={playbook}
            isLoading={isLoading}
            businessName={context.businessName}
          />
        </section>
      </main>
    </div>
  );
}
