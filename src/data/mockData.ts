import { Patient, Appointment, ClinicalTask, DoctorSettings } from '../types/medical';

export const DEFAULT_DOCTOR_SETTINGS: DoctorSettings = {
  name: 'Dr Alexandre Martin',
  title: 'Médecin Généraliste - Spécialiste en Médecine Générale',
  rpps: '10103489215',
  adeli: '751239856',
  cabinetName: 'Cabinet Médical Lumina',
  address: '14 Avenue des Ternes',
  postalCode: '75017',
  city: 'Paris',
  phone: '01 42 68 90 20',
  email: 'contact@cabinet-lumina.fr',
  website: 'www.lumina-sante.fr',
  legalNotice: 'Membre d\'une association de gestion agréée par l\'administration fiscale acceptant à ce titre le règlement des honoraires par chèque libellé à son nom ou par carte bancaire.',
  googleAccount: 'dr.alexandre.martin@gmail.com'
};

export const DOCTOR_PROFILE = DEFAULT_DOCTOR_SETTINGS;

// Par défaut, l'application part de ZÉRO (aucune donnée fictive)
export const INITIAL_PATIENTS: Patient[] = [];
export const INITIAL_APPOINTMENTS: Appointment[] = [];
export const INITIAL_TASKS: ClinicalTask[] = [];

// Données de démonstration disponibles sur demande via le menu Admin
export const DEMO_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    firstName: 'Jean-Pierre',
    lastName: 'Dubois',
    gender: 'M',
    birthDate: '1962-04-14',
    ssn: '1 62 04 75 112 045 28',
    phone: '06 12 34 56 78',
    email: 'jp.dubois@orange.fr',
    address: '28 Rue des Batignolles',
    city: 'Paris',
    postalCode: '75017',
    bloodGroup: 'A+',
    attendingPhysician: 'Dr Alexandre Martin',
    trustedPerson: {
      name: 'Hélène Dubois',
      relation: 'Épouse',
      phone: '06 98 76 54 32'
    },
    allergies: ['Pénicilline', 'Amoxicilline'],
    medicalHistory: ['Hypertension artérielle essentielle', 'Dyslipidémie mixte'],
    surgicalHistory: ['Appendicectomie en 1985', 'Méniscectomie genou droit (2012)'],
    familyHistory: ['Père : Infarctus du myocarde à 58 ans', 'Mère : Diabète de type 2'],
    ongoingTreatments: ['Ramipril 5mg (1 cp le matin)', 'Tahor 20mg (1 cp le soir)', 'Kardegic 75mg (1 sachet le midi)'],
    visits: [
      {
        id: 'vis-101',
        date: '2026-06-12',
        reason: 'Renouvellement ordonnance et bilan annuel HTA',
        diagnosis: 'Hypertension artérielle bien équilibrée, pas de signe de décompensation',
        vitals: {
          systolicBP: 128,
          diastolicBP: 78,
          heartRate: 68,
          temperature: 36.8,
          weight: 79.5,
          height: 176,
          spo2: 99,
          measuredAt: '2026-06-12T10:15:00Z'
        },
        soapNotes: {
          subjective: 'Patient asymptomatique, bonne tolérance du traitement par Ramipril et Tahor.',
          objective: 'Tension 128/78 mmHg aux deux bras. Auscultation cardio-pulmonaire normale.',
          assessment: 'HTA stade I contrôlée sous monothérapie IEC.',
          plan: 'Poursuite du traitement à l\'identique.'
        },
        doctorName: 'Dr Alexandre Martin'
      }
    ],
    prescriptions: [],
    bloodTests: [],
    letters: []
  },
  {
    id: 'pat-002',
    firstName: 'Sophie',
    lastName: 'Laurent',
    gender: 'F',
    birthDate: '1985-09-22',
    ssn: '2 85 09 33 218 554 12',
    phone: '06 45 67 89 01',
    email: 'sophie.laurent@gmail.com',
    address: '12 Boulevard Malesherbes',
    city: 'Paris',
    postalCode: '75008',
    bloodGroup: 'O+',
    attendingPhysician: 'Dr Alexandre Martin',
    allergies: ['AINS (Ibuprofène, Kétoprofène)'],
    medicalHistory: ['Asthme léger intermittent', 'Ulcère gastrique cicatrisé (2018)'],
    surgicalHistory: ['Césarienne (2015)'],
    familyHistory: ['Mère : Asthme allergique'],
    ongoingTreatments: ['Ventoline 100µg (si besoin en cas de crise)'],
    visits: [],
    prescriptions: [],
    bloodTests: [],
    letters: []
  }
];

export const DEMO_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'pat-001',
    patientName: 'Jean-Pierre Dubois',
    patientGender: 'M',
    patientAge: 64,
    patientPhone: '06 12 34 56 78',
    time: '09:00',
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 20,
    type: 'PRESENTIEL',
    status: 'EN_ATTENTE',
    reason: 'Contrôle tensionnel et renouvellement ald',
    waitingSince: '08:52'
  },
  {
    id: 'apt-002',
    patientId: 'pat-002',
    patientName: 'Sophie Laurent',
    patientGender: 'F',
    patientAge: 41,
    patientPhone: '06 45 67 89 01',
    time: '09:30',
    date: new Date().toISOString().split('T')[0],
    durationMinutes: 20,
    type: 'PRESENTIEL',
    status: 'A_VENIR',
    reason: 'Bilan asthme saisonnier et prescription'
  }
];

export const DEMO_TASKS: ClinicalTask[] = [
  {
    id: 'task-001',
    patientId: 'pat-001',
    patientName: 'Jean-Pierre Dubois',
    title: 'Vérifier clairance créatinine (DFG)',
    description: 'Patient sous Kardegic et Ramipril. Contrôler le bilan reçu du laboratoire Cerballiance.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '13:00',
    priority: 'HAUTE',
    completed: false,
    category: 'SUIVI_BIOLOGIQUE'
  }
];
