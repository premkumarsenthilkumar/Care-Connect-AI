import { useState } from 'react';
import { ChevronDown, ClipboardList, Printer, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { VisitChecklist } from '../types';

const FAQS = [
  {
    q: 'How do I prepare for a doctor visit?',
    a: 'Write down your main concerns, symptom timeline, current medications, allergies, and questions. Bring relevant records. Be ready to describe symptoms clearly (onset, location, duration, character, what makes them better or worse). Use the Prepare My Doctor Visit tool below.',
  },
  {
    q: 'What should I bring to an appointment?',
    a: 'Photo ID if required, insurance or payment information if applicable, list of current medications and supplements, allergy list, recent test results or records, and a written list of questions and symptoms.',
  },
  {
    q: 'How can I describe my symptoms clearly?',
    a: 'Cover onset, location, duration, character of the symptom, aggravating and alleviating factors, whether it radiates, timing/pattern, and severity. Mention associated symptoms and impact on daily life.',
  },
  {
    q: 'What questions should I ask about a new medication?',
    a: 'What is it for? How and when do I take it? What side effects should I watch for? Any interactions with my other medicines or foods? What if I miss a dose? How long will I need it?',
  },
  {
    q: 'How can I request a copy of my medical records?',
    a: 'Contact the medical records or health information department of the clinic or hospital where you received care. Policies and forms vary by facility and region. You generally have a right to access your own records, subject to local regulations.',
  },
  {
    q: 'What should I do if my symptoms get worse?',
    a: 'Contact your clinician or clinic promptly. For severe or emergency symptoms (difficulty breathing, chest pain, signs of stroke, loss of consciousness, severe bleeding), call local emergency services immediately (112 in India or your local number).',
  },
];

export function PatientSupport() {
  const { state, dispatch } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);
  const [savedToast, setSavedToast] = useState(false);
  const [form, setForm] = useState<Omit<VisitChecklist, 'id' | 'updatedAt'>>({
    mainConcern: state.checklist?.mainConcern ?? '',
    symptomOnset: state.checklist?.symptomOnset ?? '',
    changesOverTime: state.checklist?.changesOverTime ?? '',
    currentMedications: state.checklist?.currentMedications ?? '',
    knownAllergies: state.checklist?.knownAllergies ?? '',
    questionsForClinician: state.checklist?.questionsForClinician ?? '',
  });

  const saveChecklist = () => {
    dispatch({
      type: 'SET_CHECKLIST',
      checklist: {
        id: state.checklist?.id ?? `chk-${Date.now()}`,
        ...form,
        updatedAt: new Date().toISOString(),
      },
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Patient Support</h1>
        <p className="text-sm text-[#64748B] mt-1">
          Non-emergency guidance to help you prepare for care and communicate effectively.
        </p>
      </div>

      {/* Prepare checklist */}
      <section className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList size={20} className="text-blue-600" />
          <h2 className="font-semibold text-[#0F172A]">Prepare My Doctor Visit</h2>
        </div>
        <p className="text-sm text-[#64748B] mb-4">
          Build a personal checklist to take to your appointment. This is a preparation aid only—not
          a clinical record.
        </p>
        {!showChecklist ? (
          <button
            onClick={() => setShowChecklist(true)}
            className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs"
          >
            Open Checklist
          </button>
        ) : (
          <div className="space-y-4 print:block">
            {(
              [
                ['mainConcern', 'Main concern'],
                ['symptomOnset', 'Symptom onset and duration'],
                ['changesOverTime', 'Relevant changes over time'],
                ['currentMedications', 'Current medications to discuss'],
                ['knownAllergies', 'Known allergies to mention'],
                ['questionsForClinician', 'Questions for the clinician'],
              ] as const
            ).map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">{label}</label>
                <textarea
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
            ))}
            <div className="flex flex-wrap items-center gap-3 pt-2 print:hidden">
              <button
                onClick={saveChecklist}
                className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-xs"
              >
                Save Checklist
              </button>
              {savedToast && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-md">
                  ✓ Checklist saved locally
                </span>
              )}
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
              >
                <Printer size={16} /> Print
              </button>
              <button
                onClick={() => setShowChecklist(false)}
                className="px-4 py-2.5 rounded-lg text-sm text-[#64748B] hover:text-[#0F172A] hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>

      {/* FAQs */}
      <section>
        <h2 className="text-lg font-bold text-[#0F172A] mb-4">Frequently Asked Questions</h2>
        <div className="space-y-2">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
              >
                <span className="font-semibold text-[#0F172A] text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 text-[#64748B] transition-transform ${openFaq === i ? 'rotate-180 text-blue-600' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-[#64748B] leading-relaxed border-t border-[#E2E8F0] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-start gap-2.5 text-sm text-[#64748B] bg-blue-50/50 rounded-xl p-4 border border-blue-100">
        <AlertCircle size={17} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-xs sm:text-sm text-blue-950">
          For acute or life-threatening symptoms, call emergency services immediately (112 in India). This assistant cannot dispatch emergency care.
        </p>
      </div>
    </div>
  );
}
