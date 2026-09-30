export type AppointmentStatus = 'EN_ATTENTE' | 'EN_CONSULTATION' | 'TERMINE' | 'A_VENIR' | 'ANNULE';

export type AppointmentType = 'PRESENTIEL' | 'TELECONSULTATION' | 'URGENCE' | 'CONTROLE';

export interface Vitals {
  systolicBP: number; // mmHg (ex: 120)
  diastolicBP: number; // mmHg (ex: 80)
  heartRate: number; // bpm (ex: 72)
  temperature: number; // °C (ex: 37.1)
  weight: number; // kg (ex: 74)
  height: number; // cm (ex: 178)
  spo2?: number; // % (ex: 98)
  bloodGlucose?: number; // g/L (ex: 0.95)
  measuredAt: string;
}

export interface PatientVisit {
  id: string;
  date: string;
  reason: string;
  diagnosis: string;
  vitals: Vitals;
  soapNotes: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  referralLetter?: string;
  prescribedMedications?: string[];
  doctorName: string;
}

export interface ReferralLetterDocument {
  id: string;
  patientId: string;
  date: string;
  doctorName: string;
  specialistTitle: string;
  recipientName?: string;
  content: string;
}

export interface BloodTestPrescription {
  id: string;
  patientId: string;
  doctorName: string;
  doctorRpps: string;
  date: string;
  fastingRequired: boolean; // À jeun strict
  homeSamplingAllowed: boolean; // Prélèvement à domicile par IDE si besoin
  isUrgent: boolean; // Caractère d'urgence
  ald: boolean; // Prise en charge ALD 100%
  clinicalIndications: string;
  selectedTests: string[];
  additionalTests?: string;
  signedAt?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'M' | 'F';
  birthDate: string;
  ssn: string; // Numéro de sécurité sociale
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  bloodGroup?: string;
  attendingPhysician: string;
  trustedPerson?: {
    name: string;
    relation: string;
    phone: string;
  };
  allergies: string[];
  medicalHistory: string[]; // Antécédents médicaux
  surgicalHistory: string[]; // Antécédents chirurgicaux
  familyHistory: string[]; // Antécédents familiaux
  ongoingTreatments: string[]; // Traitements de fond actuels
  visits: PatientVisit[];
  prescriptions?: Prescription[];
  bloodTests?: BloodTestPrescription[];
  letters?: ReferralLetterDocument[];
  notes?: string;
  avatarUrl?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientGender: 'M' | 'F';
  patientAge: number;
  patientPhone: string;
  time: string; // "09:00"
  date: string; // "2026-09-30"
  durationMinutes: number; // 20
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  waitingSince?: string; // "08:52"
  consultationStartTime?: string;
  notes?: string;
}

export interface Medication {
  cis: string; // Code Identifiant de Spécialité
  name: string; // Ex: AMOXICILLINE BIOGARAN 500 mg, gélule
  dci: string; // Dénomination Commune Internationale (ex: Amoxicilline)
  dosage: string;
  form: string;
  laboratory: string;
  isNarcotic?: boolean;
  statusAmm?: string;
  atcClass?: string;
  contraindications?: string[];
  cautions?: string[];
}

export interface PrescriptionLine {
  id: string;
  medication: Medication;
  dosageInstructions: string; // "1 gélule 3 fois par jour au cours des repas"
  duration: string; // "7 jours"
  quantity: string; // "1 boîte"
  isNonSubstituable?: boolean;
  nonSubstituableReason?: string; // "MTE", "EFG", "CIF"
  ald?: boolean; // Pris en charge à 100% au titre de l'ALD
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  doctorRpps: string;
  doctorSpecialty: string;
  cabinetAddress: string;
  cabinetPhone: string;
  date: string;
  lines: PrescriptionLine[];
  renewals: number;
  deliveryNotes?: string;
  signedAt?: string;
}

export type SafetyAlertLevel = 'CONTRE_INDICATION' | 'ASSOCIATION_DECONSEILLEE' | 'PRECAUTION' | 'ALLERGIE';

export interface SafetyAlert {
  id: string;
  level: SafetyAlertLevel;
  title: string;
  description: string;
  culpritMedication: string;
  conflictingEntity: string; // another medication or patient pathology/allergy
  recommendation: string;
}

export interface ClinicalTask {
  id: string;
  patientId?: string;
  patientName?: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  priority: 'HAUTE' | 'MOYENNE' | 'BASSE';
  completed: boolean;
  category: 'SUIVI_BIOLOGIQUE' | 'COURRIER' | 'APPEL_PATIENT' | 'RENOUVELLEMENT' | 'AUTRE';
  googleCalendarSynced?: boolean;
  googleCalendarEventId?: string;
}

export interface DoctorSettings {
  name: string;
  title: string;
  rpps: string;
  adeli: string;
  cabinetName: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  legalNotice: string;
  googleAccount?: string;
}
