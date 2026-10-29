import { useState } from 'react';
import { Search, X, AlertCircle, MessageCircle } from 'lucide-react';
import { MEDICATIONS } from '../data/medications';
import type { Medication } from '../types';

export function Medications() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Medication | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);

  const filtered = MEDICATIONS.filter(
    (m) =>
      !query ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Medication Information</h1>
        <p className="text-sm text-[#64748B] mt-1">
          General educational information for medication literacy. Not prescribing advice.
        </p>
      </div>

      <div className="flex items-start gap-2.5 text-sm text-[#64748B] bg-blue-50/50 rounded-lg p-3.5 border border-blue-100">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-blue-950 text-xs sm:text-sm">
          This module does not recommend medications for your symptoms, provide dosages, or check
          interactions. Always consult a qualified clinician or pharmacist before starting, stopping,
          or changing any medication.
        </p>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search medications…"
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-[#E2E8F0] p-8 text-center text-[#64748B] text-sm">
            No medications match your search.
          </div>
        )}
        {filtered.map((med) => (
          <button
            key={med.id}
            onClick={() => {
              setSelected(med);
              setShowQuestions(false);
            }}
            className="text-left bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs hover:border-blue-500/40 hover:shadow-sm transition-all"
          >
            <div className="text-xs font-semibold text-blue-600 mb-1">{med.category}</div>
            <h3 className="font-bold text-[#0F172A]">{med.name}</h3>
            <p className="mt-2 text-sm text-[#64748B] line-clamp-2">{med.commonUses}</p>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div className="text-xs font-semibold text-blue-600">{selected.category}</div>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-[#F1F5F9]" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <h2 className="text-xl font-bold text-[#0F172A]">{selected.name}</h2>

              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">Common educational uses</h3>
                <p className="mt-1 text-sm text-[#64748B] leading-relaxed">{selected.commonUses}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#0F172A]">General precautions</h3>
                <p className="mt-1 text-sm text-[#64748B] leading-relaxed">{selected.generalPrecautions}</p>
              </div>

              <div className="text-xs text-[#64748B]">{selected.source}</div>

              {showQuestions ? (
                <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-2 flex items-center gap-1.5">
                    <MessageCircle size={16} className="text-blue-600" /> Questions to ask your pharmacist
                  </h3>
                  <ul className="space-y-2">
                    {selected.questionsForPharmacist.map((q, i) => (
                      <li key={i} className="text-sm text-[#64748B] flex gap-2">
                        <span className="text-blue-600 font-bold">{i + 1}.</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <button
                  onClick={() => setShowQuestions(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E2E8F0] text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <MessageCircle size={16} />
                  Questions to Ask Your Pharmacist
                </button>
              )}

              <button
                onClick={() => setSelected(null)}
                className="w-full py-2.5 rounded-lg bg-[#0F172A] text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
