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
  User,
  Menu,
  X
} from 'lucide-react';
import { DoctorSettings, Patient } from '../../types/medical';

interface HeaderProps {
  doctorProfile: DoctorSettings;
  patients: Patient[];
  onSelectPatient: (patient: Patient) => void;
  onNewAppointmentClick: () => void;
  onNewConsultationClick: () => void;
  onOpenAdminSettings: () => void;
  onOpenMobileMenu?: () => void;
  waitingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  doctorProfile,
  patients,
  onSelectPatient,
  onNewAppointmentClick,
  onNewConsultationClick,
  onOpenAdminSettings,
  onOpenMobileMenu,
  waitingCount
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('fr-FR', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
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
    <>
      <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shadow-xs">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Mobile Hamburger Button */}
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Menu de navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-linear-to-tr from-[#1A73E8] to-indigo-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight">Lumina</span>
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-[#1A73E8] border border-blue-200/60 px-1.5 py-0.5 rounded">
                  Pro
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 font-semibold italic -mt-0.5">
                Exercez ! On s'occupe du reste...
              </p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="relative w-72 lg:w-96 hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
                placeholder="Rechercher un patient (nom, NIR, tél)..."
                className="w-full bg-[#F1F3F4] hover:bg-[#E8EAED] focus:bg-white text-xs lg:text-sm text-slate-800 pl-10 pr-4 py-2 rounded-full border border-transparent focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all outline-hidden"
              />
            </div>

            {/* Desktop Search Dropdown */}
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
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Mobile Search Icon Toggle */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            title="Rechercher un patient"
          >
            <Search className="w-5 h-5 text-slate-600" />
          </button>

          {/* Quick Action: New Appointment (Desktop only) */}
          <button
            onClick={onNewAppointmentClick}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>Nouveau RDV</span>
          </button>

          {/* Quick Action: New Consultation (Desktop only) */}
          <button
            onClick={onNewConsultationClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Consultation</span>
          </button>

          {/* Notification Bell with waiting indicator */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Notifications et salle d'attente"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {waitingCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                  {waitingCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Salle d'attente</span>
                  <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {waitingCount} patient(s)
                  </span>
                </div>
                <div className="p-3 text-xs">
                  {waitingCount > 0 ? (
                    <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                      <div className="font-semibold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Patients en attente
                      </div>
                      <p className="mt-1 text-slate-600">
                        {waitingCount} patient(s) sont installés en salle d'attente.
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
            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 hover:opacity-85 transition-opacity text-left cursor-pointer"
            title="Administration & Profil médecin"
          >
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {getDoctorInitials(doctorProfile.name)}
            </div>
            <div className="hidden xl:block">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <span>{doctorProfile.name}</span>
                <Settings className="w-3 h-3 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                RPPS {doctorProfile.rpps}
              </div>
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-3 shadow-md z-40 animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rechercher nom, NIR, téléphone..."
              className="w-full bg-slate-100 text-sm pl-9 pr-8 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-[#1A73E8]"
            />
            <button
              onClick={() => {
                setIsMobileSearchOpen(false);
                setSearchQuery('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 divide-y divide-slate-100 max-h-60 overflow-y-auto">
              {searchResults.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => {
                    onSelectPatient(patient);
                    setIsMobileSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full py-2.5 text-left flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{patient.lastName} {patient.firstName}</span>
                    <span className="block text-[11px] text-slate-500">Né(e) le {patient.birthDate}</span>
                  </div>
                  <span className="text-[#1A73E8] font-semibold text-[11px]">Ouvrir</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
