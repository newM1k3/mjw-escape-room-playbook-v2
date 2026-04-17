import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, Copy, Download, FileText, Sparkles } from 'lucide-react';

interface Props {
  playbook: string | null;
  isLoading: boolean;
  businessName?: string;
}

function SkeletonLine({ w }: { w: string }) {
  return <div className={`h-3 rounded-full bg-slate-800 animate-pulse ${w}`} />;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 p-8">
      <div className="space-y-3">
        <SkeletonLine w="w-2/3" />
        <SkeletonLine w="w-1/2" />
      </div>
      <div className="space-y-3 pt-2">
        <SkeletonLine w="w-1/3" />
        <SkeletonLine w="w-full" />
        <SkeletonLine w="w-5/6" />
        <SkeletonLine w="w-4/5" />
      </div>
      <div className="space-y-3 pt-2">
        <SkeletonLine w="w-2/5" />
        <SkeletonLine w="w-full" />
        <SkeletonLine w="w-11/12" />
        <SkeletonLine w="w-3/4" />
        <SkeletonLine w="w-full" />
        <SkeletonLine w="w-4/5" />
      </div>
      <div className="space-y-3 pt-2">
        <SkeletonLine w="w-1/3" />
        <SkeletonLine w="w-full" />
        <SkeletonLine w="w-5/6" />
        <SkeletonLine w="w-2/3" />
      </div>
      <div className="space-y-3 pt-2">
        <SkeletonLine w="w-2/5" />
        <SkeletonLine w="w-full" />
        <SkeletonLine w="w-11/12" />
        <SkeletonLine w="w-3/4" />
      </div>
      <div className="flex items-center gap-3 pt-4">
        <div className="w-5 h-5 rounded-full bg-amber-400/20 animate-pulse flex-shrink-0" />
        <SkeletonLine w="w-64" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-16 select-none">
      <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-6 shadow-inner">
        <FileText size={36} className="text-slate-600" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">Your Playbook Appears Here</h3>
      <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
        Fill in your venue details on the left and click <span className="text-amber-400 font-medium">Generate Playbook</span> to receive a tailored marketing strategy.
      </p>
      <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-sm">
        {['Brand Positioning', 'Target Personas', 'SEO Quick Wins', 'Stop/Start List', 'Seasonal Plan', 'Website Copy'].map((item) => (
          <div key={item} className="bg-slate-800/60 border border-slate-700/60 rounded-lg px-2.5 py-2 text-center">
            <span className="text-xs text-slate-500">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PlaybookOutput({ playbook, isLoading, businessName }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!playbook) return;
    await navigator.clipboard.writeText(playbook);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!playbook) return;
    const slug = (businessName || 'playbook').toLowerCase().replace(/\s+/g, '-');
    const blob = new Blob([playbook], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${slug}-marketing-playbook.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Sparkles size={14} className="text-amber-400" />
          </div>
          <div>
            <span className="text-sm font-semibold text-slate-200">
              {businessName && playbook ? `${businessName} Playbook` : 'Marketing Playbook'}
            </span>
            {playbook && !isLoading && (
              <span className="ml-2 text-xs text-emerald-400 font-medium">Ready</span>
            )}
            {isLoading && (
              <span className="ml-2 text-xs text-amber-400 font-medium animate-pulse">Generating…</span>
            )}
          </div>
        </div>
        {playbook && !isLoading && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-md px-3 py-1.5 transition-all duration-150"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-md px-3 py-1.5 transition-all duration-150"
            >
              <Download size={12} />
              Download .md
            </button>
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <LoadingSkeleton />
        ) : playbook ? (
          <div className="px-8 py-8">
            <article className="prose prose-invert prose-amber max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-2xl prose-h1:text-amber-300 prose-h1:border-b prose-h1:border-amber-400/20 prose-h1:pb-3
              prose-h2:text-lg prose-h2:text-amber-400 prose-h2:mt-8 prose-h2:mb-3
              prose-h3:text-base prose-h3:text-slate-200 prose-h3:mt-5 prose-h3:mb-2
              prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-sm
              prose-strong:text-amber-300 prose-strong:font-semibold
              prose-li:text-slate-300 prose-li:text-sm prose-li:leading-relaxed
              prose-ul:space-y-1 prose-ol:space-y-1
              prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
              prose-code:text-amber-300 prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
              prose-blockquote:border-amber-400 prose-blockquote:bg-amber-400/5 prose-blockquote:rounded-r-lg prose-blockquote:py-1
              prose-table:text-sm
              prose-th:text-amber-400 prose-th:font-semibold prose-th:bg-slate-800/80 prose-th:p-3
              prose-td:text-slate-300 prose-td:p-3 prose-td:border-slate-700
              prose-thead:border-slate-700
              prose-tbody:divide-slate-700
              prose-hr:border-slate-700
            ">
              <ReactMarkdown>{playbook}</ReactMarkdown>
            </article>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
