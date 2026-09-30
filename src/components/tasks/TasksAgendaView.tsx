import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Download, 
  Clock, 
  AlertCircle, 
  Filter, 
  Check, 
  Users,
  Copy,
  ListTodo
} from 'lucide-react';
import { ClinicalTask, Patient } from '../../types/medical';
import { GoogleTasksService } from '../../services/googleTasksService';

interface TasksAgendaViewProps {
  tasks: ClinicalTask[];
  patients: Patient[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: ClinicalTask) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TasksAgendaView: React.FC<TasksAgendaViewProps> = ({
  tasks,
  patients,
  onToggleTask,
  onAddTask,
  onDeleteTask
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'HAUTE' | 'MOYENNE' | 'BASSE'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedTaskId, setCopiedTaskId] = useState<string | null>(null);

  // New task form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [patientId, setPatientId] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('14:00');
  const [priority, setPriority] = useState<'HAUTE' | 'MOYENNE' | 'BASSE'>('MOYENNE');
  const [category, setCategory] = useState<'SUIVI_BIOLOGIQUE' | 'COURRIER' | 'APPEL_PATIENT' | 'RENOUVELLEMENT' | 'AUTRE'>('SUIVI_BIOLOGIQUE');

  const filteredTasks = tasks.filter((t) => {
    if (priorityFilter !== 'ALL' && t.priority !== priorityFilter) return false;
    return true;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const targetPatient = patients.find((p) => p.id === patientId);

    const newTask: ClinicalTask = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      patientId: targetPatient?.id,
      patientName: targetPatient ? `${targetPatient.firstName} ${targetPatient.lastName}` : undefined,
      dueDate,
      dueTime,
      priority,
      completed: false,
      category,
      googleCalendarSynced: true
    };

    onAddTask(newTask);
    setIsAddModalOpen(false);
    // Reset form
    setTitle('');
    setDescription('');
    setPatientId('');
  };

  const handleOpenGoogleTasks = () => {
    GoogleTasksService.openGoogleTasks();
  };

  const handleCopyForGoogleTasks = (task: ClinicalTask, patient?: Patient) => {
    const text = GoogleTasksService.formatTaskClipboardText(task, patient);
    navigator.clipboard.writeText(text);
    setCopiedTaskId(task.id);
    setTimeout(() => setCopiedTaskId(null), 2500);
  };

  const handleDownloadTaskIcs = (task: ClinicalTask) => {
    const targetPatient = patients.find((p) => p.id === task.patientId);
    GoogleTasksService.downloadTaskVTodoIcs(task, targetPatient);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-[#1A73E8]" />
              Tâches Cliniques & Rappels de Suivi
            </h1>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Google Tasks Connecté
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronisation Google Tasks & exports RFC 5545 VTODO • {tasks.filter(t => !t.completed).length} tâche(s) en attente
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenGoogleTasks}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            title="Ouvrir l'application Google Tasks"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ouvrir Google Tasks</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une tâche de suivi</span>
          </button>
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-4 bg-linear-to-r from-blue-50/70 to-indigo-50/40 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 text-[#1A73E8] flex items-center justify-center shrink-0">
            <ListTodo className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900">
              Gestionnaire de Tâches & To-Do List Médicale
            </div>
            <p className="text-slate-600 mt-0.5">
              Chaque tâche de suivi patient est générée en tant que <strong>VTODO (Tâche / Rappel)</strong> compatible Google Tasks, Apple Rappels et Microsoft To Do.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Priorité :
          </span>
          {(['ALL', 'HAUTE', 'MOYENNE', 'BASSE'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-3 py-1 rounded-lg font-bold text-xs transition-colors cursor-pointer ${
                priorityFilter === p
                  ? 'bg-[#1A73E8] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {p === 'ALL' ? 'Toutes' : p}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          {filteredTasks.length} tâche(s) affichée(s) • {tasks.filter((t) => t.completed).length} terminée(s)
        </span>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
          <CheckSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">Aucune tâche en attente</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Vous n'avez aucun rappel clinique programmé. Cliquez sur "Créer une tâche de suivi" pour planifier un contrôle biologique, un appel ou un courrier.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une première tâche</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const targetPatient = patients.find((p) => p.id === task.patientId);

            return (
              <div
                key={task.id}
                className={`p-4 bg-white rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs ${
                  task.completed ? 'border-slate-200 opacity-60 bg-slate-50/50' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    className="mt-1 w-4 h-4 rounded text-[#1A73E8] focus:ring-[#1A73E8] cursor-pointer"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </span>

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        task.priority === 'HAUTE'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : task.priority === 'MOYENNE'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        Priorité {task.priority}
                      </span>

                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200">
                        {task.category.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      {task.patientName && (
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {task.patientName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Échéance : <strong>{task.dueDate}</strong> {task.dueTime ? `à ${task.dueTime}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleCopyForGoogleTasks(task, targetPatient)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#1A73E8] bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200 cursor-pointer"
                    title="Copier le texte prêt pour Google Tasks"
                  >
                    {copiedTaskId === task.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copié !</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copier pour Google Tasks</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDownloadTaskIcs(task)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Télécharger fichier Tâche iCal (.ics / VTODO)"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Supprimer la tâche"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: AJOUT NOUVELLE TACHE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Créer une tâche de suivi
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Intitulé de la tâche *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Contrôler DFG et ionogramme de M. Dupont"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Patient associé (optionnel)
                </label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                >
                  <option value="">Aucun patient lié</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.lastName} {p.firstName} (Né(e) le {p.birthDate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date d'échéance *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Heure de rappel</label>
                  <input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priorité</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  >
                    <option value="HAUTE">Haute (Urgent)</option>
                    <option value="MOYENNE">Moyenne</option>
                    <option value="BASSE">Basse</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  >
                    <option value="SUIVI_BIOLOGIQUE">Suivi biologique</option>
                    <option value="COURRIER">Courrier confrère</option>
                    <option value="APPEL_PATIENT">Appel patient</option>
                    <option value="RENOUVELLEMENT">Renouvellement ALD</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description / Consignes
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Détails, examens attendus, précisions pour l'action..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  Créer la tâche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
