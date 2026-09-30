import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { WaitingRoomView } from './components/dashboard/WaitingRoomView';
import { PatientRecordsView } from './components/patients/PatientRecordsView';
import { PatientDetailModal } from './components/patients/PatientDetailModal';
import { PatientSynthesizedProfileModal } from './components/patients/PatientSynthesizedProfileModal';
import { ConsultationView } from './components/consultation/ConsultationView';
import { PrescriptionView } from './components/prescription/PrescriptionView';
import { TasksAgendaView } from './components/tasks/TasksAgendaView';
import { AdminSettingsModal } from './components/admin/AdminSettingsModal';

import { 
  DEFAULT_DOCTOR_SETTINGS,
  INITIAL_PATIENTS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_TASKS,
  DEMO_PATIENTS,
  DEMO_APPOINTMENTS,
  DEMO_TASKS
} from './data/mockData';
import { 
  Patient, 
  Appointment, 
  AppointmentStatus, 
  ClinicalTask, 
  PatientVisit,
  Prescription,
  BloodTestPrescription,
  ReferralLetterDocument,
  DoctorSettings
} from './types/medical';

export function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('waiting_room');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Doctor Settings State (persisted)
  const [doctorProfile, setDoctorProfile] = useState<DoctorSettings>(() => {
    try {
      const saved = localStorage.getItem('lumina_doctor_settings');
      return saved ? JSON.parse(saved) : DEFAULT_DOCTOR_SETTINGS;
    } catch {
      return DEFAULT_DOCTOR_SETTINGS;
    }
  });

  // Core Data States (persisted - initialized to EMPTY / Partir de zéro)
  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_patients');
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_appointments');
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [tasks, setTasks] = useState<ClinicalTask[]>(() => {
    try {
      const saved = localStorage.getItem('lumina_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Active Context States
  const [activePatient, setActivePatient] = useState<Patient | null>(() => {
    return patients.length > 0 ? patients[0] : null;
  });
  const [inspectingPatient, setInspectingPatient] = useState<Patient | null>(null);
  const [synthesizedPatient, setSynthesizedPatient] = useState<Patient | null>(null);

  // Admin Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Persist to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('lumina_doctor_settings', JSON.stringify(doctorProfile));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [doctorProfile]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_patients', JSON.stringify(patients));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [patients]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_appointments', JSON.stringify(appointments));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem('lumina_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [tasks]);

  // Appointment Status Updater
  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status: newStatus,
            waitingSince: newStatus === 'EN_ATTENTE' ? new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : a.waitingSince
          };
        }
        return a;
      })
    );

    const target = appointments.find((a) => a.id === id);
    if (target) {
      showToast(`Statut de ${target.patientName} mis à jour : ${newStatus.replace('_', ' ')}`);
    }
  };

  // Start Consultation from Appointment
  const handleStartConsultation = (appointment: Appointment) => {
    const pat = patients.find((p) => p.id === appointment.patientId);
    if (pat) {
      setActivePatient(pat);
    }
    handleUpdateAppointmentStatus(appointment.id, 'EN_CONSULTATION');
    setActiveTab('consultation');
    showToast(`Consultation ouverte pour ${appointment.patientName}`);
  };

  // Start Consultation directly from Patient record
  const handleStartConsultationForPatient = (patient: Patient) => {
    setActivePatient(patient);
    setActiveTab('consultation');
    showToast(`Consultation ouverte pour ${patient.lastName} ${patient.firstName}`);
  };

  // 1. Save new consultation visit to patient history
  const handleSaveVisit = (patientId: string, visit: PatientVisit) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            visits: [visit, ...(p.visits || [])]
          };
        }
        return p;
      })
    );

    // Update appointment status to completed if exists
    setAppointments((prev) =>
      prev.map((a) => (a.patientId === patientId && a.status === 'EN_CONSULTATION' ? { ...a, status: 'TERMINE' } : a))
    );

    showToast(`Consultation enregistrée avec succès dans le dossier`);
  };

  // 2. Save prescription (medication) to patient record
  const handleSavePrescription = (patientId: string, prescription: Prescription) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            prescriptions: [prescription, ...(p.prescriptions || [])]
          };
        }
        return p;
      })
    );
    showToast(`Ordonnance médicamenteuse archivée au dossier patient`);
  };

  // 3. Save blood test prescription to patient record
  const handleSaveBloodTest = (patientId: string, bloodTest: BloodTestPrescription) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            bloodTests: [bloodTest, ...(p.bloodTests || [])]
          };
        }
        return p;
      })
    );
    showToast(`Ordonnance de biologie médicale archivée au dossier`);
  };

  // 4. Save referral letter to patient record
  const handleSaveReferralLetter = (patientId: string, letter: ReferralLetterDocument) => {
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id === patientId) {
          return {
            ...p,
            letters: [letter, ...(p.letters || [])]
          };
        }
        return p;
      })
    );
    showToast(`Courrier confrère enregistré au dossier`);
  };

  // Add new appointment
  const handleAddAppointment = (newAppt: Omit<Appointment, 'id'>) => {
    const created: Appointment = {
      ...newAppt,
      id: `apt-${Date.now()}`
    };
    setAppointments((prev) => [...prev, created]);
    showToast(`Rendez-vous fixé à ${created.time} pour ${created.patientName}`);
  };

  // Add new patient
  const handleAddPatient = (newPat: Patient) => {
    setPatients((prev) => [newPat, ...prev]);
    setActivePatient(newPat);
    showToast(`Dossier créé pour ${newPat.lastName} ${newPat.firstName}`);
  };

  // Update existing patient (allergies, medical & surgical history, treatments)
  const handleUpdatePatient = (updated: Patient) => {
    setPatients((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    if (activePatient?.id === updated.id) {
      setActivePatient(updated);
    }
    if (inspectingPatient?.id === updated.id) {
      setInspectingPatient(updated);
    }
    showToast(`Dossier de ${updated.lastName} mis à jour`);
  };

  // Tasks actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: ClinicalTask) => {
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Tâche créée : "${newTask.title}"`);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast(`Tâche supprimée`);
  };

  // Reset all application data (partir de 0)
  const handleResetAllData = () => {
    localStorage.removeItem('lumina_patients');
    localStorage.removeItem('lumina_appointments');
    localStorage.removeItem('lumina_tasks');
    setPatients([]);
    setAppointments([]);
    setTasks([]);
    setActivePatient(null);
    setInspectingPatient(null);
    setSynthesizedPatient(null);
    showToast(`Base réinitialisée à ZÉRO avec succès`);
  };

  // Load demo data on demand
  const handleLoadDemoData = () => {
    setPatients(DEMO_PATIENTS);
    setAppointments(DEMO_APPOINTMENTS);
    setTasks(DEMO_TASKS);
    setActivePatient(DEMO_PATIENTS[0]);
    showToast(`Données de démonstration chargées`);
  };

  // Quick navigation to prescription
  const handleNavigateToPrescription = (patient: Patient) => {
    setActivePatient(patient);
    setActiveTab('prescription');
  };

  // Counters for sidebar badges
  const waitingCount = appointments.filter((a) => a.status === 'EN_ATTENTE').length;
  const activeTasksCount = tasks.filter((t) => !t.completed && t.priority === 'HAUTE').length;
  const inConsultationAppt = appointments.find((a) => a.status === 'EN_CONSULTATION');

  return (
    <div className="h-screen flex flex-col bg-[#F8F9FA] overflow-hidden select-none font-sans text-slate-800">
      {/* Lumina Header */}
      <Header
        doctorProfile={doctorProfile}
        patients={patients}
        onSelectPatient={(p) => {
          setInspectingPatient(p);
        }}
        onNewAppointmentClick={() => setActiveTab('waiting_room')}
        onNewConsultationClick={() => {
          if (activePatient) {
            setActiveTab('consultation');
          } else if (patients.length > 0) {
            setActivePatient(patients[0]);
            setActiveTab('consultation');
          } else {
            setActiveTab('patients');
            showToast(`Veuillez créer un patient avant de débuter une consultation`);
          }
        }}
        onOpenAdminSettings={() => setIsAdminModalOpen(true)}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        waitingCount={waitingCount}
      />

      {/* Main View Area with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          waitingCount={waitingCount}
          activeTasksCount={activeTasksCount}
          inConsultationPatientName={inConsultationAppt?.patientName}
          onOpenAdminSettings={() => setIsAdminModalOpen(true)}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
        />

        {/* Central Workspace Tab Content (with bottom padding on mobile for BottomNav) */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 pb-24 md:pb-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'waiting_room' && (
              <WaitingRoomView
                appointments={appointments}
                patients={patients}
                onUpdateStatus={handleUpdateAppointmentStatus}
                onStartConsultation={handleStartConsultation}
                onOpenPatientRecord={(patId) => {
                  const p = patients.find((pat) => pat.id === patId);
                  if (p) setInspectingPatient(p);
                }}
                onAddAppointment={handleAddAppointment}
              />
            )}

            {activeTab === 'patients' && (
              <PatientRecordsView
                patients={patients}
                onOpenPatientDetail={(p) => setInspectingPatient(p)}
                onOpenSynthesizedProfile={(p) => setSynthesizedPatient(p)}
                onStartConsultation={handleStartConsultationForPatient}
                onAddPatient={handleAddPatient}
              />
            )}

            {activeTab === 'consultation' && (
              <ConsultationView
                currentPatient={activePatient}
                patients={patients}
                doctorProfile={doctorProfile}
                onSelectPatient={(p) => setActivePatient(p)}
                onSaveVisit={handleSaveVisit}
                onSaveReferralLetter={handleSaveReferralLetter}
                onNavigateToPrescription={handleNavigateToPrescription}
              />
            )}

            {activeTab === 'prescription' && (
              <PrescriptionView
                currentPatient={activePatient}
                patients={patients}
                doctorProfile={doctorProfile}
                onSelectPatient={(p) => setActivePatient(p)}
                onSavePrescription={handleSavePrescription}
                onSaveBloodTest={handleSaveBloodTest}
              />
            )}

            {activeTab === 'tasks_agenda' && (
              <TasksAgendaView
                tasks={tasks}
                patients={patients}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (md:hidden) */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        waitingCount={waitingCount}
        activeTasksCount={activeTasksCount}
        inConsultation={!!inConsultationAppt}
      />

      {/* MODAL: Full Patient Detail */}
      {inspectingPatient && (
        <PatientDetailModal
          patient={inspectingPatient}
          onClose={() => setInspectingPatient(null)}
          onUpdatePatient={handleUpdatePatient}
          onStartConsultationForPatient={handleStartConsultationForPatient}
          onOpenSynthesizedProfile={(p) => {
            setInspectingPatient(null);
            setSynthesizedPatient(p);
          }}
        />
      )}

      {/* MODAL: Volet de Synthèse Médicale (VSM / Confrère) */}
      {synthesizedPatient && (
        <PatientSynthesizedProfileModal
          patient={synthesizedPatient}
          doctorProfile={doctorProfile}
          onClose={() => setSynthesizedPatient(null)}
        />
      )}

      {/* MODAL: Administration & Paramètres du Médecin */}
      {isAdminModalOpen && (
        <AdminSettingsModal
          doctorProfile={doctorProfile}
          onUpdateDoctorProfile={(updated) => {
            setDoctorProfile(updated);
            showToast(`Profil du praticien mis à jour`);
          }}
          onResetAllData={handleResetAllData}
          onLoadDemoData={handleLoadDemoData}
          onClose={() => setIsAdminModalOpen(false)}
        />
      )}

      {/* Google-style Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#1A73E8]"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
