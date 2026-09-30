import React from 'react';
import { 
  Calendar, 
  Users, 
  Sparkles, 
  Pill, 
  CheckSquare, 
  Settings
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  waitingCount: number;
  activeTasksCount: number;
  inConsultation: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  waitingCount,
  activeTasksCount,
  inConsultation
}) => {
  const items = [
    {
      id: 'waiting_room' as ActiveTab,
      label: 'Attente',
      icon: Calendar,
      badge: waitingCount > 0 ? waitingCount : undefined
    },
    {
      id: 'patients' as ActiveTab,
      label: 'Patients',
      icon: Users
    },
    {
      id: 'consultation' as ActiveTab,
      label: 'Consult.',
      icon: Sparkles,
      badgeDot: inConsultation
    },
    {
      id: 'prescription' as ActiveTab,
      label: 'Prescription',
      icon: Pill
    },
    {
      id: 'tasks_agenda' as ActiveTab,
      label: 'Tâches',
      icon: CheckSquare,
      badge: activeTasksCount > 0 ? activeTasksCount : undefined
    }
  ];

  return (
    <nav className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all cursor-pointer min-w-14 ${
              isActive
                ? 'text-[#1A73E8] font-bold'
                : 'text-slate-500 hover:text-slate-800 font-medium'
            }`}
          >
            <div className="relative">
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'bg-blue-50 scale-110' : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              </div>

              {/* Badge counter */}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 bg-amber-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white">
                  {item.badge}
                </span>
              )}

              {/* In consultation glowing dot */}
              {item.badgeDot && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-600 rounded-full animate-ping ring-2 ring-white"></span>
              )}
            </div>

            <span className="text-[10px] mt-0.5 tracking-tight leading-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
