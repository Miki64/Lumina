import { ClinicalTask, Patient } from '../types/medical';

export class GoogleTasksService {
  /**
   * Ouvre directement Google Tasks dans l'interface Google Workspace.
   */
  static openGoogleTasks(): void {
    window.open('https://tasks.google.com/', '_blank', 'noopener,noreferrer');
  }

  /**
   * Génère le lien direct pour accéder à Google Tasks / Google Calendar Tasks.
   */
  static getGoogleTasksUrl(): string {
    return 'https://calendar.google.com/calendar/u/0/r/tasks';
  }

  /**
   * Prépare le texte formaté d'une tâche médicale prêt à être collé dans Google Tasks.
   */
  static formatTaskClipboardText(task: ClinicalTask, patient?: Patient): string {
    return `[Lumina] ${task.title}${patient ? ` - ${patient.lastName} ${patient.firstName}` : ''}
Échéance : ${task.dueDate}${task.dueTime ? ` à ${task.dueTime}` : ''} | Priorité : ${task.priority} | Catégorie : ${task.category}
${patient ? `Patient : ${patient.lastName} ${patient.firstName} (NIR: ${patient.ssn} • Tél: ${patient.phone})` : ''}

Description / Consignes :
${task.description}`;
  }

  /**
   * Télécharge un fichier iCalendar conforme RFC 5545 au format VTODO.
   * Reconnu comme une vraie TÂCHE / RAPPEL par Apple Rappels (macOS/iOS),
   * Microsoft To Do, Google Agenda (tâches) et Thunderbird.
   */
  static downloadTaskVTodoIcs(task: ClinicalTask, patient?: Patient): void {
    const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const dateFormatted = task.dueDate.replace(/-/g, '');
    const dueFormatted = task.dueTime ? `${dateFormatted}T${task.dueTime.replace(':', '')}00` : `${dateFormatted}T235900`;

    const summary = `[Tâche Lumina] ${task.title}${patient ? ` - ${patient.lastName} ${patient.firstName}` : ''}`;
    const description = `${task.description}
${patient ? `Patient: ${patient.lastName} ${patient.firstName} (Tél: ${patient.phone}, NIR: ${patient.ssn})` : ''}
Priorité: ${task.priority}
Catégorie: ${task.category}`.replace(/\n/g, '\\n');

    // RFC 5545 VTODO component for Tasks
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lumina Santé//Gestion Tâches Médicales//FR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTODO',
      `UID:lumina-task-${task.id}-${Date.now()}@lumina-sante.fr`,
      `DTSTAMP:${now}`,
      `DUE:${dueFormatted}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `PRIORITY:${task.priority === 'HAUTE' ? '1' : task.priority === 'MOYENNE' ? '5' : '9'}`,
      `STATUS:${task.completed ? 'COMPLETED' : 'NEEDS-ACTION'}`,
      'CLASS:PUBLIC',
      'END:VTODO',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tache-${task.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// Alias de rétrocompatibilité
export const GoogleCalendarService = {
  generateGoogleCalendarUrl: (task: ClinicalTask, patient?: Patient) => {
    return GoogleTasksService.getGoogleTasksUrl();
  },
  downloadIcsFile: (task: ClinicalTask, patient?: Patient) => {
    GoogleTasksService.downloadTaskVTodoIcs(task, patient);
  }
};
