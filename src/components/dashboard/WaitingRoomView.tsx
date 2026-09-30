import React, { useState, useMemo } from 'react';
import {
  Clock,
  UserCheck,
  Calendar as CalendarIcon,
  Play,
  Check,
  Plus,
  Phone,
  Video,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
  X
} from 'lucide-react';
import { Appointment, AppointmentStatus, AppointmentType, Patient } from '../../types/medical';

interface WaitingRoomViewProps {
  appointments: Appointment[];
  patients: Patient[];
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onStartConsultation: (appointment: Appointment) => void;
  onOpenPatientRecord: (patientId: string) => void;
  onAddAppointment: (newAppt: Omit<Appointment, 'id'>) => void;
}

type PeriodMode = 'DAY' | 'WEEK' | 'MONTH';
type ViewMode = 'LIST' | 'SLOTS';

// Helper: format a Date as YYYY-MM-DD
const toISODate = (d: Date) => d.toISOString().split('T')[0];

// Helper: start of week (Monday)
const startOfWeek = (d: Date) => {
  const day = d.getDay(); // 0 = Sunday
  const diff = (day === 0 ? -6 : 1 - day);
  const m = new Date(d);
  m.setDate(m.getDate() + diff);
  m.setHours(0, 0, 0, 0);
  return m;
};

// Build all 7 days of a week from Monday
const weekDates = (monday: Date): Date[] =>
  Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });

// Build all days of a month
const monthDates = (year: number, month: number): Date[] => {
  const days: Date[] = [];
  const total = new Date(year, month + 1, 0).getDate();
  for (let i = 1; i <= total; i++) days.push(new Date(year, month, i));
  return days;
};

// Time slots for the day (08:00 – 19:30, every 15 min)
const ALL_SLOTS: string[] = (() => {
  const slots: string[] = [];
  for (let h = 8; h < 20; h++) {
    for (let m = 0; m < 60; m += 15) {
      slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
    }
  }
  return slots;
})();

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  EN_ATTENTE: 'En attente',
  EN_CONSULTATION: 'En cours',
  TERMINE: 'Terminé',
  A_VENIR: 'À venir',
  ANNULE: 'Annulé'
};

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  EN_ATTENTE:     'bg-amber-50 border-amber-300 text-amber-900',
  EN_CONSULTATION:'bg-blue-50 border-blue-300 text-blue-900',
  TERMINE:        'bg-emerald-50 border-emerald-200 text-emerald-900',
  A_VENIR:        'bg-slate-50 border-slate-200 text-slate-700',
  ANNULE:         'bg-red-50 border-red-200 text-red-700'
};

const PILL_COLORS: Record<AppointmentStatus, string> = {
  EN_ATTENTE:     'bg-amber-200 text-amber-900',
  EN_CONSULTATION:'bg-blue-200 text-blue-900',
  TERMINE:        'bg-emerald-200 text-emerald-900',
  A_VENIR:        'bg-slate-200 text-slate-700',
  ANNULE:         'bg-red-200 text-red-800'
};

const FR_DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const FR_MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const WaitingRoomView: React.FC<WaitingRoomViewProps> = ({
  appointments,
  patients,
  onUpdateStatus,
  onStartConsultation,
  onOpenPatientRecord,
  onAddAppointment
}) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ──────────────────────────────────────────────────────────────────────
  // Period / View navigation state
  // ──────────────────────────────────────────────────────────────────────
  const [periodMode, setPeriodMode] = useState<PeriodMode>('DAY');
  const [viewMode, setViewMode] = useState<ViewMode>('LIST');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Pivot dates
  const [dayPivot, setDayPivot] = useState<Date>(new Date(today));
  const [weekPivot, setWeekPivot] = useState<Date>(startOfWeek(today));
  const [monthPivot, setMonthPivot] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));

  // ──────────────────────────────────────────────────────────────────────
  // New appointment form
  // ──────────────────────────────────────────────────────────────────────
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [formPatientId, setFormPatientId] = useState(patients[0]?.id || '');
  const [formDate, setFormDate] = useState(toISODate(today));
  const [formTime, setFormTime] = useState('09:00');
  const [formDuration, setFormDuration] = useState(20);
  const [formType, setFormType] = useState<AppointmentType>('PRESENTIEL');
  const [formReason, setFormReason] = useState('');

  // ──────────────────────────────────────────────────────────────────────
  // Compute the set of dates shown in current period
  // ──────────────────────────────────────────────────────────────────────
  const periodDates: string[] = useMemo(() => {
    if (periodMode === 'DAY') return [toISODate(dayPivot)];
    if (periodMode === 'WEEK') return weekDates(weekPivot).map(toISODate);
    // MONTH
    return monthDates(monthPivot.getFullYear(), monthPivot.getMonth()).map(toISODate);
  }, [periodMode, dayPivot, weekPivot, monthPivot]);

  // ──────────────────────────────────────────────────────────────────────
  // Filtered appointments for current period
  // ──────────────────────────────────────────────────────────────────────
  const periodAppointments = useMemo(() =>
    [...appointments]
      .filter(a => periodDates.includes(a.date))
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      }),
    [appointments, periodDates]
  );

  const filteredAppointments = useMemo(() => {
    if (filterStatus === 'ALL') return periodAppointments;
    return periodAppointments.filter(a => a.status === filterStatus);
  }, [periodAppointments, filterStatus]);

  // ──────────────────────────────────────────────────────────────────────
  // KPI stats (always across the full period, not filtered)
  // ──────────────────────────────────────────────────────────────────────
  const countWaiting       = periodAppointments.filter(a => a.status === 'EN_ATTENTE').length;
  const countInConsultation= periodAppointments.filter(a => a.status === 'EN_CONSULTATION').length;
  const countCompleted     = periodAppointments.filter(a => a.status === 'TERMINE').length;
  const countUpcoming      = periodAppointments.filter(a => a.status === 'A_VENIR').length;

  // ──────────────────────────────────────────────────────────────────────
  // Navigation helpers
  // ──────────────────────────────────────────────────────────────────────
  const navigate = (dir: -1 | 1) => {
    if (periodMode === 'DAY') {
      const d = new Date(dayPivot);
      d.setDate(d.getDate() + dir);
      setDayPivot(d);
      setFormDate(toISODate(d));
    } else if (periodMode === 'WEEK') {
      const d = new Date(weekPivot);
      d.setDate(d.getDate() + dir * 7);
      setWeekPivot(d);
    } else {
      const d = new Date(monthPivot);
      d.setMonth(d.getMonth() + dir);
      setMonthPivot(d);
    }
  };

  const goToToday = () => {
    setDayPivot(new Date(today));
    setWeekPivot(startOfWeek(today));
    setMonthPivot(new Date(today.getFullYear(), today.getMonth(), 1));
    setFormDate(toISODate(today));
  };

  // ──────────────────────────────────────────────────────────────────────
  // Period label
  // ──────────────────────────────────────────────────────────────────────
  const periodLabel = (() => {
    if (periodMode === 'DAY') {
      const isToday = toISODate(dayPivot) === toISODate(today);
      return dayPivot.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
        + (isToday ? ' · Aujourd\'hui' : '');
    }
    if (periodMode === 'WEEK') {
      const end = weekDates(weekPivot)[6];
      return `Semaine du ${weekPivot.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`;
    }
    return `${FR_MONTHS[monthPivot.getMonth()]} ${monthPivot.getFullYear()}`;
  })();

  // ──────────────────────────────────────────────────────────────────────
  // Create appointment
  // ──────────────────────────────────────────────────────────────────────
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === formPatientId);
    if (!pat) return;
    const age = new Date().getFullYear() - new Date(pat.birthDate).getFullYear();
    onAddAppointment({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      patientGender: pat.gender,
      patientAge: age,
      patientPhone: pat.phone,
      time: formTime,
      date: formDate,
      durationMinutes: formDuration,
      type: formType,
      status: 'A_VENIR',
      reason: formReason || 'Consultation de médecine générale',
      notes: ''
    });
    setIsNewModalOpen(false);
    setFormReason('');
  };

  // ──────────────────────────────────────────────────────────────────────
  // SLOTS VIEW — day-by-day
  // Used for DAY (single column) and WEEK/MONTH (multi-column mini-calendar)
  // ──────────────────────────────────────────────────────────────────────
  const openSlotModal = (date: string, time: string) => {
    setFormDate(date);
    setFormTime(time);
    setIsNewModalOpen(true);
  };

  // ──────────────────────────────────────────────────────────────────────
  // RENDER
  // ──────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Header bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#1A73E8]" />
            Planning &amp; Salle d'attente
          </h1>
          <p className="text-sm text-slate-500 mt-0.5 capitalize">{periodLabel}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Period tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['DAY', 'WEEK', 'MONTH'] as PeriodMode[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriodMode(p)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  periodMode === p ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === 'DAY' ? 'Jour' : p === 'WEEK' ? 'Semaine' : 'Mois'}
              </button>
            ))}
          </div>

          {/* View tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['LIST', 'SLOTS'] as ViewMode[]).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === v ? 'bg-white text-slate-800 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {v === 'LIST' ? 'Liste' : 'Créneaux'}
              </button>
            ))}
          </div>

          <button
            onClick={() => { setFormDate(toISODate(periodMode === 'DAY' ? dayPivot : today)); setIsNewModalOpen(true); }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau RDV</span>
          </button>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { key: 'EN_ATTENTE', label: 'En attente', count: countWaiting, color: 'amber', icon: <Clock className="w-4 h-4" /> },
          { key: 'EN_CONSULTATION', label: 'En consultation', count: countInConsultation, color: 'blue', icon: <UserCheck className="w-4 h-4" /> },
          { key: 'A_VENIR', label: 'À venir', count: countUpcoming, color: 'slate', icon: <CalendarIcon className="w-4 h-4" /> },
          { key: 'TERMINE', label: 'Terminés', count: countCompleted, color: 'emerald', icon: <Check className="w-4 h-4" /> },
        ].map(({ key, label, count, color, icon }) => (
          <div
            key={key}
            onClick={() => setFilterStatus(f => f === key ? 'ALL' : key)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all ${
              filterStatus === key
                ? `bg-${color}-50/70 border-${color}-300 ring-2 ring-${color}-400/20`
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-semibold uppercase tracking-wider text-${color}-700`}>{label}</span>
              <div className={`w-7 h-7 rounded-lg bg-${color}-100 text-${color}-700 flex items-center justify-center`}>{icon}</div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">{count}</span>
              <span className={`text-xs text-${color}-600 font-medium`}>
                {periodMode === 'DAY' ? 'aujourd\'hui' : periodMode === 'WEEK' ? 'cette semaine' : 'ce mois'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Navigation (prev / today / next) ── */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goToToday}
          className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 bg-white hover:bg-blue-50 hover:text-[#1A73E8] text-slate-700 transition-colors cursor-pointer shadow-2xs"
        >
          Aujourd'hui
        </button>
        <button
          onClick={() => navigate(1)}
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-2xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="ml-2 text-sm font-semibold text-slate-700 capitalize">{periodLabel}</span>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          VIEW: LIST
      ══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'LIST' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Filter bar */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">Statut :</span>
              {[
                { id: 'ALL', label: 'Tous' },
                { id: 'EN_ATTENTE', label: 'En attente' },
                { id: 'EN_CONSULTATION', label: 'En cours' },
                { id: 'A_VENIR', label: 'À venir' },
                { id: 'TERMINE', label: 'Terminés' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                    filterStatus === tab.id ? 'bg-[#1A73E8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500">{filteredAppointments.length} rdv</span>
          </div>

          {/* Appointment rows */}
          <div className="divide-y divide-slate-100">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-14 text-slate-400 text-sm space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto opacity-40" />
                <p>Aucun rendez-vous sur cette période.</p>
                <button
                  onClick={() => setIsNewModalOpen(true)}
                  className="text-[#1A73E8] text-xs font-semibold hover:underline cursor-pointer"
                >
                  + Ajouter un rendez-vous
                </button>
              </div>
            ) : (
              filteredAppointments.map(appt => {
                const isWaiting  = appt.status === 'EN_ATTENTE';
                const isInConsult= appt.status === 'EN_CONSULTATION';
                const isDone     = appt.status === 'TERMINE';
                const isToday    = appt.date === toISODate(today);

                return (
                  <div
                    key={appt.id}
                    className={`p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                      isInConsult ? 'bg-blue-50/40 border-l-4 border-l-[#1A73E8]'
                      : isWaiting  ? 'bg-amber-50/20 border-l-4 border-l-amber-400'
                      : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Time block */}
                      <div className="flex flex-col items-center justify-center w-16 shrink-0">
                        {/* Date badge (shown in week/month) */}
                        {periodMode !== 'DAY' && (
                          <span className={`text-[10px] font-bold mb-0.5 px-2 rounded-full ${
                            isToday ? 'bg-[#1A73E8] text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {new Date(appt.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </span>
                        )}
                        <div className="w-full flex flex-col items-center justify-center h-12 rounded-xl bg-slate-100 border border-slate-200">
                          <span className="text-sm font-extrabold text-slate-800">{appt.time}</span>
                          <span className="text-[10px] text-slate-500 font-semibold">{appt.durationMinutes} min</span>
                        </div>
                      </div>

                      {/* Patient info */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => onOpenPatientRecord(appt.patientId)}
                            className="text-base font-bold text-slate-900 hover:text-[#1A73E8] transition-colors cursor-pointer"
                          >
                            {appt.patientName}
                          </button>
                          <span className="text-xs text-slate-400 font-medium">
                            · {appt.patientAge} ans ({appt.patientGender})
                          </span>
                          {appt.type === 'TELECONSULTATION' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md">
                              <Video className="w-3 h-3" /> Télé
                            </span>
                          )}
                          {appt.type === 'URGENCE' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-md">
                              🚨 Urgence
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
                          <span className="font-medium text-slate-700 truncate max-w-[240px]">{appt.reason}</span>
                          <span className="text-slate-400 hidden sm:inline">·</span>
                          <span className="text-slate-500 hidden sm:flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {appt.patientPhone}
                          </span>
                        </div>
                        {isWaiting && appt.waitingSince && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-100/70 border border-amber-200/80 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            Arrivé à {appt.waitingSince}
                          </div>
                        )}
                        {isInConsult && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1A73E8] bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-ping" />
                            En cours
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <select
                        value={appt.status}
                        onChange={e => onUpdateStatus(appt.id, e.target.value as AppointmentStatus)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border outline-hidden cursor-pointer transition-all ${
                          isWaiting    ? 'bg-amber-100/90 text-amber-800 border-amber-300'
                          : isInConsult? 'bg-blue-100/90 text-blue-800 border-blue-300'
                          : isDone     ? 'bg-emerald-100/90 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="A_VENIR">À venir</option>
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="EN_CONSULTATION">En consultation</option>
                        <option value="TERMINE">Terminé</option>
                        <option value="ANNULE">Annulé</option>
                      </select>

                      {isInConsult ? (
                        <button
                          onClick={() => onStartConsultation(appt)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Poursuivre
                        </button>
                      ) : isWaiting ? (
                        <button
                          onClick={() => { onUpdateStatus(appt.id, 'EN_CONSULTATION'); onStartConsultation(appt); }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Faire entrer
                        </button>
                      ) : isDone ? (
                        <button
                          onClick={() => onOpenPatientRecord(appt.patientId)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" /> Dossier
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(appt.id, 'EN_ATTENTE')}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                        >
                          <UserCheck className="w-3.5 h-3.5" /> Arrivé
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          VIEW: SLOTS
      ══════════════════════════════════════════════════════════════════ */}
      {viewMode === 'SLOTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">

          {/* ── DAY: single timeline column ── */}
          {periodMode === 'DAY' && (
            <div>
              <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Grille du {dayPivot.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
                <span className="text-xs text-slate-400">
                  {appointments.filter(a => a.date === toISODate(dayPivot)).length} rdv ·{' '}
                  {ALL_SLOTS.length - appointments.filter(a => a.date === toISODate(dayPivot)).length} créneaux libres
                </span>
              </div>
              <div className="p-4 space-y-1 max-h-[60vh] overflow-y-auto">
                {ALL_SLOTS.map(slot => {
                  const appt = appointments.find(a => a.date === toISODate(dayPivot) && a.time === slot);
                  const isPast = toISODate(dayPivot) < toISODate(today) ||
                    (toISODate(dayPivot) === toISODate(today) && slot < new Date().toTimeString().slice(0, 5));
                  const isLunch = slot >= '12:30' && slot <= '13:45';

                  return (
                    <div key={slot} className="flex items-center gap-3">
                      <span className="w-12 text-[11px] font-mono text-slate-400 text-right shrink-0">{slot}</span>
                      {isLunch && !appt ? (
                        <div className="flex-1 h-9 rounded-lg bg-slate-50 border border-dashed border-slate-200 flex items-center px-3">
                          <span className="text-[11px] text-slate-400 italic">Pause déjeuner</span>
                        </div>
                      ) : appt ? (
                        <div className={`flex-1 h-9 rounded-lg border px-3 flex items-center justify-between gap-2 ${STATUS_COLORS[appt.status]}`}>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-bold truncate">{appt.patientName}</span>
                            <span className="text-[11px] text-slate-500 hidden sm:inline truncate">{appt.reason}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${PILL_COLORS[appt.status]}`}>
                              {STATUS_LABELS[appt.status]}
                            </span>
                            {(appt.status === 'EN_ATTENTE' || appt.status === 'A_VENIR') && (
                              <button
                                onClick={() => onStartConsultation(appt)}
                                className="w-6 h-6 rounded-md bg-[#1A73E8] text-white flex items-center justify-center hover:bg-[#1557B0] transition-colors cursor-pointer"
                              >
                                <Play className="w-3 h-3 fill-current" />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => openSlotModal(toISODate(dayPivot), slot)}
                          disabled={isPast}
                          className={`flex-1 h-9 rounded-lg border flex items-center px-3 transition-all text-left ${
                            isPast
                              ? 'border-dashed border-slate-100 bg-slate-50/50 cursor-not-allowed'
                              : 'border-dashed border-slate-200 hover:border-[#1A73E8] hover:bg-blue-50/30 cursor-pointer'
                          }`}
                        >
                          {!isPast && (
                            <span className="text-[11px] text-slate-400 hover:text-[#1A73E8] flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Disponible — cliquer pour réserver
                            </span>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── WEEK: 7 mini-columns ── */}
          {periodMode === 'WEEK' && (
            <div>
              <div className="px-5 py-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">Vue semaine — créneaux 08h–20h</span>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[700px]">
                  {/* Day headers */}
                  <div className="grid grid-cols-8 border-b border-slate-100">
                    <div className="py-2 text-center" />
                    {weekDates(weekPivot).map((d, i) => {
                      const iso = toISODate(d);
                      const isToday_ = iso === toISODate(today);
                      return (
                        <div key={i} className={`py-2 text-center border-l border-slate-100 ${isToday_ ? 'bg-blue-50' : ''}`}>
                          <div className="text-[10px] font-semibold text-slate-500 uppercase">{FR_DAYS[i]}</div>
                          <div className={`text-sm font-bold mt-0.5 w-7 h-7 rounded-full flex items-center justify-center mx-auto ${
                            isToday_ ? 'bg-[#1A73E8] text-white' : 'text-slate-800'
                          }`}>
                            {d.getDate()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Slots grid */}
                  <div className="max-h-[55vh] overflow-y-auto">
                    {ALL_SLOTS.map(slot => {
                      const isLunch = slot >= '12:30' && slot <= '13:45';
                      return (
                        <div key={slot} className="grid grid-cols-8 border-b border-slate-50 min-h-[36px]">
                          <div className="flex items-center justify-end pr-3 py-1">
                            <span className="text-[10px] font-mono text-slate-400">{slot}</span>
                          </div>
                          {weekDates(weekPivot).map((d, di) => {
                            const iso = toISODate(d);
                            const appt = appointments.find(a => a.date === iso && a.time === slot);
                            const isToday_ = iso === toISODate(today);
                            const isPast = iso < toISODate(today) ||
                              (iso === toISODate(today) && slot < new Date().toTimeString().slice(0, 5));

                            return (
                              <div key={di} className={`border-l border-slate-100 py-0.5 px-1 ${isToday_ ? 'bg-blue-50/30' : ''}`}>
                                {isLunch && !appt ? (
                                  <div className="h-full flex items-center justify-center">
                                    <span className="text-[9px] text-slate-300">—</span>
                                  </div>
                                ) : appt ? (
                                  <div className={`text-[10px] font-semibold px-1.5 py-1 rounded-md border leading-tight ${STATUS_COLORS[appt.status]}`}>
                                    <div className="truncate">{appt.patientName.split(' ')[0]}</div>
                                    <div className={`text-[9px] font-bold px-1 rounded-full inline-block mt-0.5 ${PILL_COLORS[appt.status]}`}>
                                      {STATUS_LABELS[appt.status]}
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => !isPast && openSlotModal(iso, slot)}
                                    disabled={isPast}
                                    className={`w-full h-full min-h-[30px] rounded-md transition-colors ${
                                      isPast ? 'cursor-default' : 'hover:bg-blue-50/60 cursor-pointer group'
                                    }`}
                                  >
                                    {!isPast && (
                                      <Plus className="w-3 h-3 text-slate-300 group-hover:text-[#1A73E8] mx-auto hidden group-hover:block" />
                                    )}
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── MONTH: calendar grid ── */}
          {periodMode === 'MONTH' && (() => {
            const year = monthPivot.getFullYear();
            const month = monthPivot.getMonth();
            const days = monthDates(year, month);
            // Pad to start on Monday
            const firstDow = (days[0].getDay() + 6) % 7; // 0=Mon
            const padded: (Date | null)[] = [...Array(firstDow).fill(null), ...days];
            while (padded.length % 7 !== 0) padded.push(null);

            return (
              <div>
                <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {FR_MONTHS[month]} {year}
                  </span>
                  <span className="text-xs text-slate-400">
                    {periodAppointments.length} rdv ce mois
                  </span>
                </div>
                {/* Day-of-week header */}
                <div className="grid grid-cols-7 border-b border-slate-100">
                  {FR_DAYS.map(d => (
                    <div key={d} className="py-2 text-center text-[11px] font-semibold text-slate-400 uppercase">{d}</div>
                  ))}
                </div>
                {/* Calendar cells */}
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
                  {padded.map((d, idx) => {
                    if (!d) return <div key={idx} className="min-h-[80px] bg-slate-50/50" />;
                    const iso = toISODate(d);
                    const isToday_ = iso === toISODate(today);
                    const dayAppts = appointments.filter(a => a.date === iso);

                    return (
                      <div
                        key={idx}
                        className={`min-h-[80px] p-1.5 flex flex-col gap-1 ${
                          isToday_ ? 'bg-blue-50/40' : 'hover:bg-slate-50 cursor-pointer'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-0.5 ${
                          isToday_ ? 'bg-[#1A73E8] text-white' : 'text-slate-600'
                        }`}>
                          {d.getDate()}
                        </div>
                        {dayAppts.slice(0, 3).map(appt => (
                          <div
                            key={appt.id}
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border truncate ${STATUS_COLORS[appt.status]}`}
                            title={`${appt.time} · ${appt.patientName} · ${appt.reason}`}
                          >
                            {appt.time} {appt.patientName.split(' ')[0]}
                          </div>
                        ))}
                        {dayAppts.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-medium">+{dayAppts.length - 3} rdv</span>
                        )}
                        {dayAppts.length === 0 && (
                          <button
                            onClick={() => openSlotModal(iso, '09:00')}
                            className="text-[10px] text-slate-300 hover:text-[#1A73E8] flex items-center gap-0.5 cursor-pointer mt-auto"
                          >
                            <Plus className="w-3 h-3" /> Rdv
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          MODAL: New Appointment
      ══════════════════════════════════════════════════════════════════ */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Nouveau rendez-vous</h3>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {patients.length === 0 ? (
              <div className="py-10 text-center text-slate-500 text-sm">
                Aucun patient dans la base. Créez d'abord un dossier patient.
              </div>
            ) : (
              <form onSubmit={handleCreateAppointment} className="space-y-4 mt-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient *</label>
                  <select
                    value={formPatientId}
                    onChange={e => setFormPatientId(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] outline-hidden font-medium"
                  >
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.lastName} {p.firstName} — né(e) {p.birthDate.slice(0, 4)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      value={formDate}
                      onChange={e => setFormDate(e.target.value)}
                      required
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-[#1A73E8]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Heure *</label>
                    <input
                      type="time"
                      value={formTime}
                      onChange={e => setFormTime(e.target.value)}
                      required
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden focus:border-[#1A73E8]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Durée</label>
                    <select
                      value={formDuration}
                      onChange={e => setFormDuration(Number(e.target.value))}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-hidden"
                    >
                      {[10, 15, 20, 25, 30, 45, 60].map(d => (
                        <option key={d} value={d}>{d} min</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { v: 'PRESENTIEL', label: '🏢 Présentiel' },
                      { v: 'TELECONSULTATION', label: '📹 Téléconsultation' },
                      { v: 'URGENCE', label: '🚨 Urgence' },
                      { v: 'CONTROLE', label: '🔁 Contrôle' },
                    ].map(({ v, label }) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setFormType(v as AppointmentType)}
                        className={`p-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                          formType === v ? 'bg-blue-50 border-[#1A73E8] text-[#1A73E8]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Motif *</label>
                  <input
                    type="text"
                    placeholder="Ex : Douleurs abdominales, Renouvellement ALD…"
                    value={formReason}
                    onChange={e => setFormReason(e.target.value)}
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-[#1A73E8]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                  >
                    Confirmer le RDV
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
