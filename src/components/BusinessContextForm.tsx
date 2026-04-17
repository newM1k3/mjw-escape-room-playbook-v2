import { Loader2, Zap } from 'lucide-react';

export interface BusinessContext {
  businessName: string;
  location: string;
  rooms: string;
  challenge: string;
  traffic: string;
  peakSeason: string;
  competitorDistance: string;
  usp: string;
}

interface Props {
  context: BusinessContext;
  onChange: (context: BusinessContext) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const labelClass = 'block text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1.5';
const inputClass =
  'w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3.5 py-2.5 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/60 focus:border-amber-400 transition-all duration-150';
const sectionHeadingClass =
  'text-xs font-bold uppercase tracking-widest text-amber-400 mb-4 flex items-center gap-2';

export default function BusinessContextForm({ context, onChange, onGenerate, isLoading }: Props) {
  const set = (field: keyof BusinessContext) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => onChange({ ...context, [field]: e.target.value });

  const canSubmit =
    context.businessName.trim() !== '' &&
    context.location.trim() !== '' &&
    context.challenge.trim() !== '' &&
    context.usp.trim() !== '' &&
    !isLoading;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-1 space-y-8">

        {/* Section 1 */}
        <div>
          <div className={sectionHeadingClass}>
            <span className="w-5 h-px bg-amber-400 inline-block" />
            Business Identity
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Business Name <span className="text-amber-400">*</span></label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Ridgeline Escape Co."
                value={context.businessName}
                onChange={set('businessName')}
              />
            </div>
            <div>
              <label className={labelClass}>Location Description <span className="text-amber-400">*</span></label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. Rural Vermont, 45 mins from Burlington"
                value={context.location}
                onChange={set('location')}
              />
            </div>
            <div>
              <label className={labelClass}>Number of Rooms</label>
              <select className={inputClass} value={context.rooms} onChange={set('rooms')}>
                <option value="1">1 Room</option>
                <option value="2">2 Rooms</option>
                <option value="3">3 Rooms</option>
                <option value="4">4 Rooms</option>
                <option value="5+">5+ Rooms</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <div className={sectionHeadingClass}>
            <span className="w-5 h-px bg-amber-400 inline-block" />
            The Challenge
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Primary Marketing Challenge <span className="text-amber-400">*</span></label>
              <textarea
                className={`${inputClass} resize-none h-24`}
                placeholder="e.g. Competing with urban venues on Google — people search 'escape room near me' and we don't appear."
                value={context.challenge}
                onChange={set('challenge')}
              />
            </div>
            <div>
              <label className={labelClass}>Traffic Context</label>
              <select className={inputClass} value={context.traffic} onChange={set('traffic')}>
                <option value="No foot traffic / pure destination">No foot traffic / pure destination</option>
                <option value="Some passing traffic">Some passing traffic</option>
                <option value="Tourist area">Tourist area</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Peak Season</label>
              <select className={inputClass} value={context.peakSeason} onChange={set('peakSeason')}>
                <option value="Summer">Summer</option>
                <option value="Fall/Halloween">Fall / Halloween</option>
                <option value="Winter Holidays">Winter Holidays</option>
                <option value="Year-round">Year-round</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <div className={sectionHeadingClass}>
            <span className="w-5 h-px bg-amber-400 inline-block" />
            Competitive Context
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Nearest Competitor Distance</label>
              <select className={inputClass} value={context.competitorDistance} onChange={set('competitorDistance')}>
                <option value="Under 10 miles">Under 10 miles</option>
                <option value="10-30 miles">10–30 miles</option>
                <option value="30+ miles">30+ miles</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Unique Selling Point <span className="text-amber-400">*</span></label>
              <textarea
                className={`${inputClass} resize-none h-24`}
                placeholder="e.g. Only outdoor escape room in New England — set in a real 1800s farmstead."
                value={context.usp}
                onChange={set('usp')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-6 mt-6 border-t border-slate-800">
        <button
          onClick={onGenerate}
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold text-sm uppercase tracking-widest rounded-lg py-3.5 transition-all duration-200 shadow-lg shadow-amber-400/10 hover:shadow-amber-400/30 disabled:shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Generating Playbook…
            </>
          ) : (
            <>
              <Zap size={16} />
              Generate Playbook
            </>
          )}
        </button>
        <p className="text-center text-xs text-slate-600 mt-3">
          Powered by Claude 3.5 Sonnet · ~20 seconds
        </p>
      </div>
    </div>
  );
}
