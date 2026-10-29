import { useState } from 'react';
import { Calendar, Plus, X, Clock, User, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SPECIALTIES, DEMO_PROVIDERS, TIME_SLOTS } from '../data/seed';
import type { Appointment } from '../types';

export function Appointments() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    purpose: '',
    specialty: SPECIALTIES[0],
    provider: DEMO_PROVIDERS[SPECIALTIES[0]][0],
    date: '',
    time: TIME_SLOTS[0],
    notes: '',
  });

  const filtered = state.appointments.filter((a) =>
    filter === 'all' ? true : a.status === filter
  );

  const openCreate = () => {
    setEditing(null);
    setFormError('');
    setForm({
      purpose: '',
      specialty: SPECIALTIES[0],
      provider: DEMO_PROVIDERS[SPECIALTIES[0]][0],
      date: '',
      time: TIME_SLOTS[0],
      notes: '',
    });
    setShowForm(true);
  };

  const openEdit = (apt: Appointment) => {
    setEditing(apt);
    setFormError('');
    setForm({
      purpose: apt.purpose,
      specialty: apt.specialty,
      provider: apt.provider,
      date: apt.date,
      time: apt.time,
      notes: apt.notes,
    });
    setShowForm(true);
  };

  const handleSpecialtyChange = (spec: string) => {
    setForm((f) => ({
      ...f,
      specialty: spec,
      provider: DEMO_PROVIDERS[spec][0],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.purpose.trim() || !form.date) {
      setFormError('Please fill in purpose and date.');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    if (form.date < today) {
      setFormError('Please select a future date.');
      return;
    }
    // Prevent duplicate slot
    const conflict = state.appointments.find(
      (a) =>
        a.status === 'upcoming' &&
        a.date === form.date &&
        a.time === form.time &&
        a.provider === form.provider &&
        a.id !== editing?.id
    );
    if (conflict) {
      setFormError('That demo time slot is already booked for this provider.');
      return;
    }

    if (editing) {
      dispatch({
        type: 'UPDATE_APPOINTMENT',
        appointment: {
          ...editing,
          ...form,
          status: 'upcoming',
        },
      });
    } else {
      dispatch({
        type: 'ADD_APPOINTMENT',
        appointment: {
          id: `apt-${Date.now()}`,
          ...form,
          status: 'upcoming',
          createdAt: new Date().toISOString(),
        },
      });
    }
    setShowForm(false);
  };

  const cancelApt = (id: string) => {
    if (confirm('Cancel this demo appointment?')) {
      dispatch({ type: 'CANCEL_APPOINTMENT', id });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">Appointments</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Demo appointment records only — not real bookings with healthcare providers.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus size={18} />
          Book Demo Appointment
        </button>
      </div>

      <div className="flex items-start gap-2.5 text-sm text-[#64748B] bg-blue-50/50 rounded-lg p-3.5 border border-blue-100">
        <AlertCircle size={16} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-blue-950 text-xs sm:text-sm">
          Creating a demo appointment does not book a real medical consultation. Contact your
          healthcare provider directly for actual appointments.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'upcoming', 'completed', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold capitalize transition-all
              ${filter === f
                ? 'bg-[#0F172A] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:border-blue-500 hover:text-blue-600'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center text-[#64748B] text-sm">
            No {filter === 'all' ? '' : filter} demo appointments found.
          </div>
        )}
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1.5">
                <div className="font-semibold text-[#0F172A]">{apt.purpose}</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#64748B]">
                  <span className="inline-flex items-center gap-1">
                    <User size={14} className="text-blue-600" /> {apt.provider}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={14} className="text-blue-600" /> {apt.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock size={14} className="text-blue-600" /> {apt.time}
                  </span>
                </div>
                <div className="text-xs text-[#64748B]">{apt.specialty}</div>
                {apt.notes && <div className="text-sm text-[#64748B] mt-1">{apt.notes}</div>}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize
                    ${apt.status === 'upcoming'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : apt.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                >
                  {apt.status}
                </span>
                {apt.status === 'upcoming' && (
                  <>
                    <button
                      onClick={() => openEdit(apt)}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      Reschedule
                    </button>
                    <button
                      onClick={() => cancelApt(apt.id)}
                      className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <h2 className="font-semibold text-[#0F172A]">
                {editing ? 'Reschedule Demo Appointment' : 'Book Demo Appointment'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-[#F1F5F9]" aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">Purpose *</label>
                <input
                  required
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  placeholder="e.g. Annual check-up"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">Specialty</label>
                <select
                  value={form.specialty}
                  onChange={(e) => handleSpecialtyChange(e.target.value)}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  {SPECIALTIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">Provider (Demo)</label>
                <select
                  value={form.provider}
                  onChange={(e) => setForm({ ...form, provider: e.target.value })}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                >
                  {DEMO_PROVIDERS[form.specialty].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={form.date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1">Time</label>
                  <select
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#0F172A] mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-[#E2E8F0] px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] text-sm font-medium hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-xs"
                >
                  {editing ? 'Save Changes' : 'Create Demo Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
