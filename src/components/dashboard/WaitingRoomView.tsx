import React, { useState } from 'react';
import { 
  Clock, 
  UserCheck, 
  Calendar as CalendarIcon, 
  Play, 
  Check, 
  ArrowRight, 
  Plus, 
  Phone, 
  Video, 
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users
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

export const WaitingRoomView: React.FC<WaitingRoomViewProps> = ({
  appointments,
  patients,
  onUpdateStatus,
  onStartConsultation,
  onOpenPatientRecord,
  onAddAppointment
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);
  const [calendarViewMode, setCalendarViewMode] = useState<'LIST' | 'SLOTS'>('LIST');

  // Form states for new appointment
  const [formPatientId, setFormPatientId] = useState<string>(patients[0]?.id || '');
  const [formTime, setFormTime] = useState<string>('12:00');
  const [formDuration, setFormDuration] = useState<number>(25);
  const [formType, setFormType] = useState<AppointmentType>('PRESENTIEL');
  const [formReason, setFormReason] = useState<string>('');

  // Sort appointments by time
  const sortedAppointments = [...appointments].sort((a, b) => a.time.localeCompare(b.time));

  // Filtered
  const filteredAppointments = sortedAppointments.filter((appt) => {
    if (filterStatus === 'ALL') return true;
    return appt.status === filterStatus;
  });

  // Calculate statistics
  const countWaiting = appointments.filter((a) => a.status === 'EN_ATTENTE').length;
  const countInConsultation = appointments.filter((a) => a.status === 'EN_CONSULTATION').length;
  const countCompleted = appointments.filter((a) => a.status === 'TERMINE').length;
  const countUpcoming = appointments.filter((a) => a.status === 'A_VENIR').length;

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find((p) => p.id === formPatientId);
    if (!pat) return;

    // Calculate age
    const birthYear = new Date(pat.birthDate).getFullYear();
    const age = new Date().getFullYear() - birthYear;

    onAddAppointment({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      patientGender: pat.gender,
      patientAge: age,
      patientPhone: pat.phone,
      time: formTime,
      date: selectedDate,
      durationMinutes: Number(formDuration),
      type: formType,
      status: 'A_VENIR',
      reason: formReason || 'Consultation de médecine générale',
      notes: ''
    });

    setIsNewModalOpen(false);
    setFormReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Summary Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Planning & Salle d'attente
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Samedi 26 Septembre 2026 • Cabinet Médical du Parc
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCalendarViewMode('LIST')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                calendarViewMode === 'LIST'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Liste chronologique
            </button>
            <button
              onClick={() => setCalendarViewMode('SLOTS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                calendarViewMode === 'SLOTS'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Créneaux de la journée
            </button>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un RDV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Google style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div 
          onClick={() => setFilterStatus('EN_ATTENTE')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            filterStatus === 'EN_ATTENTE' 
              ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">En attente</span>
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{countWaiting}</span>
            <span className="text-xs text-amber-700 font-medium">en salle</span>
          </div>
        </div>

        <div 
          onClick={() => setFilterStatus('EN_CONSULTATION')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            filterStatus === 'EN_CONSULTATION' 
              ? 'bg-blue-50/70 border-blue-300 ring-2 ring-blue-400/20' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1A73E8]">En consultation</span>
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-[#1A73E8] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{countInConsultation}</span>
            <span className="text-xs text-blue-600 font-medium">au cabinet</span>
          </div>
        </div>

        <div 
          onClick={() => setFilterStatus('A_VENIR')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            filterStatus === 'A_VENIR' 
              ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/20' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">À venir</span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{countUpcoming}</span>
            <span className="text-xs text-slate-500 font-medium">prévus</span>
          </div>
        </div>

        <div 
          onClick={() => setFilterStatus('TERMINE')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all ${
            filterStatus === 'TERMINE' 
              ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-400/20' 
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Terminés</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{countCompleted}</span>
            <span className="text-xs text-emerald-700 font-medium">réalisés</span>
          </div>
        </div>
      </div>

      {/* Main Content: Chronological List or Interactive Slots View */}
      {calendarViewMode === 'LIST' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Filter Bar */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">Filtrer par statut :</span>
              <div className="flex items-center gap-1.5">
                {[
                  { id: 'ALL', label: 'Tous les RDV' },
                  { id: 'EN_ATTENTE', label: 'En attente' },
                  { id: 'EN_CONSULTATION', label: 'En consultation' },
                  { id: 'A_VENIR', label: 'À venir' },
                  { id: 'TERMINE', label: 'Terminés' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterStatus(tab.id)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      filterStatus === tab.id
                        ? 'bg-[#1A73E8] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              {filteredAppointments.length} rendez-vous affiché(s)
            </div>
          </div>

          {/* Appointments Table / Cards */}
          <div className="divide-y divide-slate-100">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                Aucun rendez-vous ne correspond à ce filtre pour aujourd'hui.
              </div>
            ) : (
              filteredAppointments.map((appt) => {
                const isWaiting = appt.status === 'EN_ATTENTE';
                const isInConsult = appt.status === 'EN_CONSULTATION';
                const isDone = appt.status === 'TERMINE';

                return (
                  <div
                    key={appt.id}
                    className={`p-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                      isInConsult
                        ? 'bg-blue-50/40 border-l-4 border-l-[#1A73E8]'
                        : isWaiting
                        ? 'bg-amber-50/20 border-l-4 border-l-amber-400'
                        : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                    }`}
                  >
                    {/* Time & Patient Info */}
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Time Block */}
                      <div className="flex flex-col items-center justify-center w-16 h-14 rounded-xl bg-slate-100 border border-slate-200 shrink-0">
                        <span className="text-base font-extrabold text-slate-800">{appt.time}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">{appt.durationMinutes} min</span>
                      </div>

                      {/* Patient Details */}
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenPatientRecord(appt.patientId)}
                            className="text-base font-bold text-slate-900 hover:text-[#1A73E8] transition-colors"
                          >
                            {appt.patientName}
                          </button>
                          <span className="text-xs text-slate-400 font-medium">
                            • {appt.patientAge} ans ({appt.patientGender})
                          </span>
                          {appt.type === 'TELECONSULTATION' && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md">
                              <Video className="w-3 h-3" /> Téléconsultation
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
                          <span className="font-medium text-slate-700">Motif : {appt.reason}</span>
                          <span className="text-slate-400 hidden sm:inline">•</span>
                          <span className="text-slate-500 hidden sm:flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {appt.patientPhone}
                          </span>
                        </div>

                        {/* Waiting room timer / Consultation timer */}
                        {isWaiting && appt.waitingSince && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-700 bg-amber-100/70 border border-amber-200/80 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3" />
                            <span>Arrivé à {appt.waitingSince} (en salle depuis ~15 min)</span>
                          </div>
                        )}
                        {isInConsult && (
                          <div className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1A73E8] bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-[#1A73E8] animate-ping"></span>
                            <span>En cours avec Dr Martin</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions & Status Pill */}
                    <div className="flex items-center gap-3 self-end md:self-center">
                      {/* Status Selector Dropdown */}
                      <select
                        value={appt.status}
                        onChange={(e) => onUpdateStatus(appt.id, e.target.value as AppointmentStatus)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-hidden transition-all cursor-pointer ${
                          isWaiting
                            ? 'bg-amber-100/90 text-amber-800 border-amber-300'
                            : isInConsult
                            ? 'bg-blue-100/90 text-blue-800 border-blue-300 font-bold'
                            : isDone
                            ? 'bg-emerald-100/90 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="A_VENIR">À venir</option>
                        <option value="EN_ATTENTE">En attente (salle)</option>
                        <option value="EN_CONSULTATION">En consultation</option>
                        <option value="TERMINE">Terminé</option>
                        <option value="ANNULE">Annulé</option>
                      </select>

                      {/* Primary Action Button */}
                      {isInConsult ? (
                        <button
                          onClick={() => onStartConsultation(appt)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-lg shadow-2xs transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Poursuivre</span>
                        </button>
                      ) : isWaiting ? (
                        <button
                          onClick={() => {
                            onUpdateStatus(appt.id, 'EN_CONSULTATION');
                            onStartConsultation(appt);
                          }}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-lg shadow-2xs transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Faire entrer</span>
                        </button>
                      ) : isDone ? (
                        <button
                          onClick={() => onOpenPatientRecord(appt.patientId)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Dossier</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(appt.id, 'EN_ATTENTE')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 border border-slate-200 rounded-lg transition-colors"
                          title="Patient arrivé en salle"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Marquer arrivé</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Slots Timeline View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Grille des créneaux (30 min)</h3>
            <span className="text-xs text-slate-500">Heures ouvrées : 08:00 - 18:30</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              '08:30', '09:15', '10:00', '10:45', '11:30', 
              '14:00', '14:45', '15:15', '16:00', '16:30', '17:15', '18:00'
            ].map((slotTime) => {
              const matchedAppt = appointments.find((a) => a.time === slotTime);

              return (
                <div
                  key={slotTime}
                  className={`p-3.5 rounded-xl border transition-all ${
                    matchedAppt
                      ? matchedAppt.status === 'EN_CONSULTATION'
                        ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                        : matchedAppt.status === 'EN_ATTENTE'
                        ? 'bg-amber-50/80 border-amber-300 shadow-2xs'
                        : matchedAppt.status === 'TERMINE'
                        ? 'bg-emerald-50/60 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                      : 'bg-white border-dashed border-slate-300 hover:border-[#1A73E8] hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {slotTime}
                    </span>
                    {matchedAppt ? (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        matchedAppt.status === 'EN_ATTENTE'
                          ? 'bg-amber-200 text-amber-900'
                          : matchedAppt.status === 'EN_CONSULTATION'
                          ? 'bg-blue-200 text-blue-900'
                          : matchedAppt.status === 'TERMINE'
                          ? 'bg-emerald-200 text-emerald-900'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {matchedAppt.status.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-medium">Disponible</span>
                    )}
                  </div>

                  {matchedAppt ? (
                    <div className="mt-2">
                      <div className="text-sm font-bold text-slate-900 truncate">
                        {matchedAppt.patientName}
                      </div>
                      <div className="text-xs text-slate-500 truncate mt-0.5">
                        {matchedAppt.reason}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setFormTime(slotTime);
                        setIsNewModalOpen(true);
                      }}
                      className="mt-3 w-full py-1 text-xs font-semibold text-[#1A73E8] hover:bg-blue-100/50 rounded-lg flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Réserver créneau
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: New Appointment */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Planifier un nouveau rendez-vous</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sélectionner le patient</label>
                <select
                  value={formPatientId}
                  onChange={(e) => setFormPatientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:ring-2 focus:ring-[#1A73E8]/20 focus:border-[#1A73E8] outline-hidden font-medium"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.lastName} {p.firstName} (Né(e) en {p.birthDate.slice(0, 4)}) - NIR: {p.ssn.slice(0, 8)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Heure du créneau</label>
                  <input
                    type="time"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden focus:border-[#1A73E8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Durée (minutes)</label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-hidden"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={20}>20 minutes</option>
                    <option value={25}>25 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Type de consultation</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('PRESENTIEL')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      formType === 'PRESENTIEL'
                        ? 'bg-blue-50 border-[#1A73E8] text-[#1A73E8]'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    🏢 Présentiel (Cabinet)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('TELECONSULTATION')}
                    className={`p-2.5 rounded-xl border text-center font-semibold transition-all ${
                      formType === 'TELECONSULTATION'
                        ? 'bg-purple-50 border-purple-500 text-purple-700'
                        : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    📹 Téléconsultation
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif de consultation</label>
                <input
                  type="text"
                  placeholder="Ex : Douleurs abdominales, Renouvellement ALD, Certificat..."
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-hidden focus:border-[#1A73E8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold rounded-xl shadow-2xs transition-colors"
                >
                  Confirmer le RDV
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
