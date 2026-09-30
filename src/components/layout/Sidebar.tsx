import React from 'react';
import { 
  Users, 
  Calendar, 
  FileText, 
  Pill, 
  CheckSquare, 
  Sparkles, 
  ShieldCheck, 
  CalendarCheck,
  Settings,
  ListTodo,
  X
} from 'lucide-react';

export type ActiveTab = 'waiting_room' | 'patients' | 'consultation' | 'prescription' | 'tasks_agenda';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  waitingCount: number;
  activeTasksCount: number;
  inConsultationPatientName?: string;
  onOpenAdminSettings: () => void;
  isMobileDrawerOpen?: boolean;
  onCloseMobileDrawer?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  waitingCount,
  activeTasksCount,
  inConsultationPatientName,
  onOpenAdminSettings,
  isMobileDrawerOpen = false,
  onCloseMobileDrawer
}) => {
  const navItems = [
    {
      id: 'waiting_room' as ActiveTab,
      label: "Salle d'attente & RDV",
      description: "Flux du jour & Planning",
      icon: Calendar,
      badge: waitingCount > 0 ? `${waitingCount} en attente` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'patients' as ActiveTab,
      label: 'Dossiers Patients',
      description: 'Fiches, Antécédents & VSM',
      icon: Users,
    },
    {
      id: 'consultation' as ActiveTab,
      label: 'Consultation & Notes IA',
      description: 'Constantes, Dictée & Courriers',
      icon: Sparkles,
      badge: inConsultationPatientName ? 'En cours' : undefined,
      badgeColor: 'bg-blue-100 text-[#1A73E8] border-blue-200 animate-pulse'
    },
    {
      id: 'prescription' as ActiveTab,
      label: 'Prescription & Biologie',
      description: 'Médicaments BDPM & Bilans',
      icon: Pill,
    },
    {
      id: 'tasks_agenda' as ActiveTab,
      label: 'Tâches & Google Tasks',
      description: 'Rappels de suivi & To-Do',
      icon: CheckSquare,
      badge: activeTasksCount > 0 ? `${activeTasksCount}` : undefined,
      badgeColor: 'bg-slate-200 text-slate-700'
    }
  ];

  const handleItemClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (onCloseMobileDrawer) onCloseMobileDrawer();
  };

  const content = (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-full shrink-0 select-none">
      <div className="p-3.5 space-y-1">
        {/* Mobile Drawer Header */}
        <div className="flex md:hidden items-center justify-between px-3 py-2 border-b border-slate-100 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base text-slate-900">Lumina</span>
            <span className="text-[10px] bg-blue-50 text-[#1A73E8] font-bold px-1.5 py-0.5 rounded">Pro</span>
          </div>
          {onCloseMobileDrawer && (
            <button
              onClick={onCloseMobileDrawer}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="hidden md:block px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Modules Médicaux
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full text-left px-3.5 py-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50/80 text-[#1A73E8] font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium'
              }`}
            >
              <div className={`mt-0.5 p-1.5 rounded-lg ${isActive ? 'bg-[#1A73E8] text-white shadow-2xs' : 'text-slate-500'}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm truncate">{item.label}</span>
                </div>
                <div className={`text-[11px] truncate ${isActive ? 'text-blue-700/80 font-normal' : 'text-slate-400 font-normal'}`}>
                  {item.description}
                </div>
                {item.badge && (
                  <span className={`inline-block mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}

        {/* Administration Button in Navigation */}
        <div className="pt-2">
          <button
            onClick={() => {
              onOpenAdminSettings();
              if (onCloseMobileDrawer) onCloseMobileDrawer();
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center gap-3 text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 font-medium transition-all cursor-pointer border border-transparent hover:border-slate-200"
          >
            <div className="p-1.5 rounded-lg text-slate-500">
              <Settings className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-sm block">Menu Administration</span>
              <span className="text-[11px] text-slate-400">Profil médecin & ordonnances</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Service Card / Sync indicator */}
      <div className="p-3.5 border-t border-slate-100 space-y-3 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
        <div className="p-3 bg-[#F8F9FA] rounded-xl border border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <ListTodo className="w-4 h-4 text-emerald-600" />
            <span>Google Tasks Connecté</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Création de tâches conformes RFC 5545 VTODO.
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 font-medium">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> RGPD & HDS certifié
          </span>
          <span>Lumina Mobile</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="no-print hidden md:flex h-full shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer (Visible when isMobileDrawerOpen === true) */}
      {isMobileDrawerOpen && (
        <div className="no-print fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobileDrawer}
          />
          {/* Drawer content */}
          <div className="relative z-10 h-full max-w-[280px] w-full bg-white shadow-2xl animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
