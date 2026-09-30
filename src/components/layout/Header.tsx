import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  Calendar as CalendarIcon, 
  Bell, 
  CheckCircle2, 
  Plus, 
  Clock, 
  Settings,
  User
} from 'lucide-react';
import { DoctorSettings, Patient } from '../../types/medical';

interface HeaderProps {
  doctorProfile: DoctorSettings;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewAppointmentClick: () => void;
  onNewConsultationClick: () => void;
  onOpenAdminSettings: () => void;
  waitingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  doctorProfile,
  patients,
  onSelectPatient,
  onNewAppointmentClick,
  onNewConsultationClick,
  onOpenAdminSettings,
  waitingCount
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      const filtered = patients.filter(
        (p) =>
          p.firstName.toLowerCase().includes(q.toLowerCase()) ||
          p.lastName.toLowerCase().includes(q.toLowerCase()) ||
          p.ssn.includes(q) ||
          p.phone.includes(q)
      );
      setSearchResults(filtered);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  const getDoctorInitials = (name: string) => {
    const cleaned = name.replace('Dr ', '').trim();
    const parts = cleaned.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return cleaned.slice(0, 2).toUpperCase() || 'DR';
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-xs">
      {/* Brand: Lumina, Exercez ! On s'occupe du reste... */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-[#1A73E8] to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-slate-900 tracking-tight">Lumina</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1A73E8] border border-blue-200/60 px-1.5 py-0.5 rounded">
                Cabinet Connecté
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium -mt-0.5 flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold italic">Exercez ! On s'occupe du reste...</span>
            </div>
          </div>
        </div>

        {/* Global search bar */}
        <div className="relative w-80 lg:w-96 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
              placeholder="Rechercher un patient (nom, NIR, tél)..."
              className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white text-sm text-slate-800 pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all outline-hidden"
            />
          </div>

          {/* Search Dropdown */}
          {isSearchOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Patients trouvés ({searchResults.length})
              </div>
              {searchResults.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    onSelectPatient(patient);
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full px-3.5 py-2 hover:bg-slate-50 text-left flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1A73E8] flex items-center justify-center font-bold text-xs">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {patient.lastName} {patient.firstName}
                      </div>
                      <div className="text-xs text-slate-500">
                        Né(e) le {patient.birthDate} • NIR: {patient.ssn.slice(0, 10)}...
                      </div>
                    </div>
                  </div>
                  {patient.allergies.length > 0 && (
                    <span className="text-[11px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-medium">
                      {patient.allergies.length} allergie(s)
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Date/Time, Quick Actions & Doctor Profile */}
      <div className="flex items-center gap-3">
        {/* Live Clock */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="capitalize">{currentTime}</span>
        </div>

        {/* Quick Action: New Appointment */}
        <button
          onClick={onNewAppointmentClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Nouveau RDV</span>
        </button>

        {/* Quick Action: New Consultation */}
        <button
          onClick={onNewConsultationClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle consultation</span>
        </button>

        {/* Notification Bell with waiting indicator */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Notifications et alertes"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {waitingCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                {waitingCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
              <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Salle d'attente</span>
                <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {waitingCount} patient(s)
                </span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                {waitingCount > 0 ? (
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                    <div className="font-semibold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      Patients en attente
                    </div>
                    <p className="mt-1 text-slate-600">
                      Vous avez {waitingCount} patient(s) actuellement en salle d'attente.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-3 text-slate-400">
                    Aucun patient en attente.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Menu / Doctor Profile Button */}
        <button
          onClick={onOpenAdminSettings}
          className="flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-85 transition-opacity text-left cursor-pointer"
          title="Ouvrir le menu Administration et Paramètres du Médecin"
        >
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
            {getDoctorInitials(doctorProfile.name)}
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>{doctorProfile.name}</span>
              <Settings className="w-3 h-3 text-slate-400" />
            </div>
            <div className="text-[11px] text-slate-500 font-medium">
              RPPS : {doctorProfile.rpps} • Admin
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
