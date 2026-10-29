import { useState } from 'react';
import { Search, Bookmark, BookmarkCheck, Clock, X, ExternalLink } from 'lucide-react';
import { ARTICLES } from '../data/articles';
import { useApp } from '../context/AppContext';
import type { Article } from '../types';

const CATEGORIES = [
  'All',
  'General Health',
  'Nutrition and Hydration',
  'Sleep and Wellbeing',
  'Preventive Care',
  'Common Symptoms',
  'Understanding Medical Terms',
  'Preparing for Medical Appointments',
];

export function HealthLibrary() {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selected, setSelected] = useState<Article | null>(null);
  const [showSaved, setShowSaved] = useState(false);

  const filtered = ARTICLES.filter((a) => {
    const matchesCat = category === 'All' || a.category === category;
    const q = query.toLowerCase();
    const matchesQ =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q);
    const matchesSaved = !showSaved || state.savedArticleIds.includes(a.id);
    return matchesCat && matchesQ && matchesSaved;
  });

  const toggleSave = (id: string) => {
    dispatch({ type: 'TOGGLE_SAVED_ARTICLE', id });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Health Library</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Curated educational articles for general health literacy. Not a substitute for professional advice.
        </p>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>
        <button
          onClick={() => setShowSaved(!showSaved)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
            showSaved
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:border-blue-500 hover:text-blue-600'
          }`}
        >
          {showSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          Saved ({state.savedArticleIds.length})
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              category === c
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-blue-500 hover:text-blue-600'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-[#E2E8F0] p-8 text-center text-[#64748B] text-sm">
            No articles match your search.
          </div>
        )}
        {filtered.map((article) => {
          const saved = state.savedArticleIds.includes(article.id);
          return (
            <div
              key={article.id}
              className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-blue-500/40 hover:shadow-sm transition-all flex flex-col"
            >
              <div className="text-xs font-semibold text-blue-600 mb-1">{article.category}</div>
              <h3 className="font-bold text-[#0F172A] leading-snug">{article.title}</h3>
              <p className="mt-2 text-sm text-[#64748B] line-clamp-2 flex-1">{article.summary}</p>
              <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-[#F1F5F9]">
                <span className="inline-flex items-center gap-1 text-xs text-[#64748B]">
                  <Clock size={13} className="text-blue-600" /> {article.readingTime} min read
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSave(article.id)}
                    className="p-1.5 rounded-md hover:bg-blue-50 text-[#64748B] transition-colors"
                    aria-label={saved ? 'Unsave' : 'Save'}
                  >
                    {saved ? (
                      <BookmarkCheck size={18} className="text-blue-600" />
                    ) : (
                      <Bookmark size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => setSelected(article)}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    Open Article
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Article detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div className="text-xs font-semibold text-blue-600">{selected.category}</div>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-[#F1F5F9]" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 sm:p-6">
              <h2 className="text-xl font-bold text-[#0F172A]">{selected.title}</h2>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                <span className="inline-flex items-center gap-1">
                  <Clock size={13} className="text-blue-600" /> {selected.readingTime} min
                </span>
                <span>{selected.source}</span>
              </div>
              <div className="mt-5 text-sm text-[#0F172A] leading-relaxed whitespace-pre-wrap">
                {selected.content}
              </div>
              {selected.sourceUrl && (
                <a
                  href={selected.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View external source <ExternalLink size={14} />
                </a>
              )}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => toggleSave(selected.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
                >
                  {state.savedArticleIds.includes(selected.id) ? (
                    <>
                      <BookmarkCheck size={16} className="text-blue-600" /> Saved
                    </>
                  ) : (
                    <>
                      <Bookmark size={16} /> Save Article
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-lg bg-[#0F172A] text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
