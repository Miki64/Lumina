import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  Activity, 
  FileText, 
  Calendar, 
  Plus, 
  X, 
  Play, 
  Share2, 
  Check, 
  Clock,
  HeartPulse,
  Pill,
  Syringe,
  MailQuestion,
  Copy,
  FolderOpen,
  Pencil
} from 'lucide-react';
import { PatientEditModal } from './PatientEditModal';
import { Patient, PatientVisit, Prescription, BloodTestPrescription, ReferralLetterDocument } from '../../types/medical';

interface PatientDetailModalProps {
  patient: Patient;
  onClose: () => void;
  onUpdatePatient: (updated: Patient) => void;
  onStartConsultationForPatient: (patient: Patient) => void;
  onOpenSynthesizedProfile: (patient: Patient) => void;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  patient,
  onClose,
  onUpdatePatient,
  onStartConsultationForPatient,
  onOpenSynthesizedProfile
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'HISTORY' | 'DOCUMENTS'>('OVERVIEW');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newAllergy, setNewAllergy] = useState('');
  const [newTreatment, setNewTreatment] = useState('');
  const [newMedicalHistoryItem, setNewMedicalHistoryItem] = useState('');
  const [newSurgicalHistoryItem, setNewSurgicalHistoryItem] = useState('');
  const [newFamilyHistoryItem, setNewFamilyHistoryItem] = useState('');
  const [copiedDocId, setCopiedDocId] = useState<string | null>(null);

  // Allergies
  const handleAddAllergy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    const updated = {
      ...patient,
      allergies: [...patient.allergies, newAllergy.trim()]
    };
    onUpdatePatient(updated);
    setNewAllergy('');
  };

  const handleRemoveAllergy = (index: number) => {
    const updated = {
      ...patient,
      allergies: patient.allergies.filter((_, i) => i !== index)
    };
    onUpdatePatient(updated);
  };

  // Traitements
  const handleAddTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreatment.trim()) return;
    const updated = {
      ...patient,
      ongoingTreatments: [...patient.ongoingTreatments, newTreatment.trim()]
    };
    onUpdatePatient(updated);
    setNewTreatment('');
  };

  const handleRemoveTreatment = (index: number) => {
    const updated = {
      ...patient,
      ongoingTreatments: patient.ongoingTreatments.filter((_, i) => i !== index)
    };
    onUpdatePatient(updated);
  };

  // Antécédents Médicaux (demandé par l'utilisateur)
  const handleAddMedicalHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedicalHistoryItem.trim()) return;
    const updated = {
      ...patient,
      medicalHistory: [...patient.medicalHistory, newMedicalHistoryItem.trim()]
    };
    onUpdatePatient(updated);
    setNewMedicalHistoryItem('');
  };

  const handleRemoveMedicalHistory = (index: number) => {
    const updated = {
      ...patient,
      medicalHistory: patient.medicalHistory.filter((_, i) => i !== index)
    };
    onUpdatePatient(updated);
  };

  // Antécédents Chirurgicaux (demandé par l'utilisateur)
  const handleAddSurgicalHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSurgicalHistoryItem.trim()) return;
    const updated = {
      ...patient,
      surgicalHistory: [...patient.surgicalHistory, newSurgicalHistoryItem.trim()]
    };
    onUpdatePatient(updated);
    setNewSurgicalHistoryItem('');
  };

  const handleRemoveSurgicalHistory = (index: number) => {
    const updated = {
      ...patient,
      surgicalHistory: patient.surgicalHistory.filter((_, i) => i !== index)
    };
    onUpdatePatient(updated);
  };

  // Antécédents Familiaux
  const handleAddFamilyHistory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamilyHistoryItem.trim()) return;
    const updated = {
      ...patient,
      familyHistory: [...patient.familyHistory, newFamilyHistoryItem.trim()]
    };
    onUpdatePatient(updated);
    setNewFamilyHistoryItem('');
  };

  const handleRemoveFamilyHistory = (index: number) => {
    const updated = {
      ...patient,
      familyHistory: patient.familyHistory.filter((_, i) => i !== index)
    };
    onUpdatePatient(updated);
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDocId(id);
    setTimeout(() => setCopiedDocId(null), 2500);
  };

  const totalDocuments = (patient.visits?.length || 0) + (patient.prescriptions?.length || 0) + (patient.bloodTests?.length || 0) + (patient.letters?.length || 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header with Patient Identity & Action CTAs */}
        <div className="p-5 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-blue-100 text-[#1A73E8] flex items-center justify-center font-extrabold text-xl shadow-2xs">
              {patient.firstName[0]}{patient.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">
                  {patient.lastName} {patient.firstName}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#1A73E8] border border-blue-200">
                  {patient.gender === 'M' ? 'Homme' : 'Femme'} • Né(e) le {patient.birthDate}
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-3">
                <span className="font-mono">NIR : {patient.ssn}</span>
                <span>•</span>
                <span>Tél : {patient.phone}</span>
                <span>•</span>
                <span>{patient.city}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Modifier la fiche */}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500" />
              <span>Modifier</span>
            </button>

            <button
              onClick={() => onOpenSynthesizedProfile(patient)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Profil Synthétisé</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartConsultationForPatient(patient);
              }}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Lancer consultation</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'border-[#1A73E8] text-[#1A73E8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Fiche Générale & Sécurité
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'HISTORY'
                ? 'border-[#1A73E8] text-[#1A73E8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Antécédents & Traitements ({patient.ongoingTreatments.length + patient.medicalHistory.length + patient.surgicalHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('DOCUMENTS')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'DOCUMENTS'
                ? 'border-[#1A73E8] text-[#1A73E8]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Historique & Documents ({totalDocuments})
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Critical Allergies Section */}
              <div className="p-4 bg-red-50/70 border border-red-200 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider">
                      Allergies & Intolérances (Sécurité Prescription)
                    </h3>
                  </div>
                  <span className="text-[11px] text-red-600 font-semibold">
                    {patient.allergies.length} signalement(s)
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {patient.allergies.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">Aucune allergie répertoriée</span>
                  ) : (
                    patient.allergies.map((allergy, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-red-300 text-red-700 text-xs font-bold rounded-lg shadow-2xs"
                      >
                        <span>{allergy}</span>
                        <button
                          onClick={() => handleRemoveAllergy(i)}
                          className="text-red-400 hover:text-red-700 font-normal cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Allergy inline form */}
                <form onSubmit={handleAddAllergy} className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter une allergie (ex: Pénicilline, AINS, Iode)..."
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-red-200 rounded-xl outline-hidden focus:border-red-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Ajouter
                  </button>
                </form>
              </div>

              {/* Administrative & Contact Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Coordonnées & État Civil
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{patient.email || 'Email non renseigné'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{patient.address}, {patient.postalCode} {patient.city}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-slate-400" />
                      <span>Groupe Sanguin : <strong>{patient.bloodGroup || 'Non renseigné'}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Médecin Traitant & Personne de Confiance
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    <div>
                      <span className="text-slate-400">Médecin traitant déclaré :</span>
                      <p className="font-semibold text-slate-800">{patient.attendingPhysician}</p>
                    </div>
                    {patient.trustedPerson && (
                      <div>
                        <span className="text-slate-400">Personne de confiance :</span>
                        <p className="font-semibold text-slate-800">
                          {patient.trustedPerson.name} ({patient.trustedPerson.relation}) • {patient.trustedPerson.phone}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-6">
              {/* Treatments Management */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-[#1A73E8]" />
                    Traitements de fond habituels
                  </h3>
                  <span className="text-xs text-slate-500">Pris en compte par l'analyse VIDAL</span>
                </div>

                <div className="space-y-2">
                  {patient.ongoingTreatments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucun traitement de fond enregistré.</p>
                  ) : (
                    patient.ongoingTreatments.map((t, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                      >
                        <span className="font-semibold text-slate-800">💊 {t}</span>
                        <button
                          onClick={() => handleRemoveTreatment(idx)}
                          className="text-slate-400 hover:text-red-600 font-bold px-2 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddTreatment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter un traitement (ex: Ramipril 5mg, Kardegic 75mg)..."
                    value={newTreatment}
                    onChange={(e) => setNewTreatment(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Ajouter
                  </button>
                </form>
              </div>

              {/* ANTECEDENTS MEDICAUX ET CHIRURGICAUX EDITABLES (demande utilisateur) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Antécédents Médicaux */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Antécédents Médicaux
                    </h4>
                    <span className="text-[11px] font-semibold text-slate-400">{patient.medicalHistory.length}</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {patient.medicalHistory.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Aucun antécédent médical</p>
                    ) : (
                      patient.medicalHistory.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200 text-xs">
                          <span>{item}</span>
                          <button
                            onClick={() => handleRemoveMedicalHistory(i)}
                            className="text-slate-400 hover:text-red-600 font-bold px-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddMedicalHistory} className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Ajouter (ex: HTA, Diabète)..."
                      value={newMedicalHistoryItem}
                      onChange={(e) => setNewMedicalHistoryItem(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:border-[#1A73E8]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Ajouter
                    </button>
                  </form>
                </div>

                {/* Antécédents Chirurgicaux */}
                <div className="p-4 bg-indigo-50/40 rounded-2xl border border-indigo-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                      Antécédents Chirurgicaux
                    </h4>
                    <span className="text-[11px] font-semibold text-indigo-400">{patient.surgicalHistory.length}</span>
                  </div>

                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {patient.surgicalHistory.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Aucun antécédent chirurgical</p>
                    ) : (
                      patient.surgicalHistory.map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-indigo-200 text-xs">
                          <span>🔪 {item}</span>
                          <button
                            onClick={() => handleRemoveSurgicalHistory(i)}
                            className="text-slate-400 hover:text-red-600 font-bold px-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddSurgicalHistory} className="flex gap-1.5 pt-1">
                    <input
                      type="text"
                      placeholder="Ajouter chirurgie (ex: Prothèse de hanche)..."
                      value={newSurgicalHistoryItem}
                      onChange={(e) => setNewSurgicalHistoryItem(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 text-xs bg-white border border-indigo-200 rounded-lg outline-hidden focus:border-[#1A73E8]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Ajouter
                    </button>
                  </form>
                </div>
              </div>

              {/* Antécédents Familiaux */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Antécédents Familiaux
                  </h4>
                  <span className="text-[11px] font-semibold text-slate-400">{patient.familyHistory.length}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {patient.familyHistory.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs">
                      <span>{item}</span>
                      <button
                        onClick={() => handleRemoveFamilyHistory(i)}
                        className="text-slate-400 hover:text-red-600 font-bold cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddFamilyHistory} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter un antécédent familial (ex: Père : Infarctus du myocarde à 55 ans)..."
                    value={newFamilyHistoryItem}
                    onChange={(e) => setNewFamilyHistoryItem(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-hidden focus:border-[#1A73E8]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Ajouter
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'DOCUMENTS' && (
            <div className="space-y-6">
              {/* 1. VISITES / CONSULTATIONS */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#1A73E8]" />
                  Consultations Médicales ({patient.visits.length})
                </h3>

                {patient.visits.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                    Aucune consultation passée enregistrée pour ce patient.
                  </p>
                ) : (
                  patient.visits.map((visit) => (
                    <div
                      key={visit.id}
                      className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <Calendar className="w-4 h-4 text-[#1A73E8]" />
                          <span className="text-xs font-bold text-slate-800">
                            Consultation du {visit.date}
                          </span>
                          <span className="text-xs text-slate-500">• {visit.doctorName}</span>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Enregistrée
                        </span>
                      </div>

                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900">Motif : </strong>
                        <span>{visit.reason}</span>
                      </div>

                      <div className="text-xs text-slate-700">
                        <strong className="text-slate-900">Diagnostic : </strong>
                        <span className="text-blue-700 font-semibold">{visit.diagnosis}</span>
                      </div>

                      {/* Vitals summary */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                          TA : {visit.vitals.systolicBP}/{visit.vitals.diastolicBP} mmHg
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                          Pouls : {visit.vitals.heartRate} bpm
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                          T° : {visit.vitals.temperature}°C
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-medium text-slate-700">
                          Poids : {visit.vitals.weight} kg ({visit.vitals.height} cm)
                        </span>
                      </div>

                      {/* SOAP Notes Collapsible/Summary */}
                      {visit.soapNotes?.subjective && (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                          <p><strong>[S] Subjectif : </strong>{visit.soapNotes.subjective}</p>
                          <p><strong>[O] Objectif : </strong>{visit.soapNotes.objective}</p>
                          <p><strong>[A] Évaluation : </strong>{visit.soapNotes.assessment}</p>
                          <p><strong>[P] Plan : </strong>{visit.soapNotes.plan}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* 2. ORDONNANCES MÉDICAMENTEUSES & BILANS */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <Pill className="w-3.5 h-3.5 text-emerald-600" />
                  Ordonnances Associées ({(patient.prescriptions?.length || 0) + (patient.bloodTests?.length || 0)})
                </h3>

                {(!patient.prescriptions || patient.prescriptions.length === 0) && (!patient.bloodTests || patient.bloodTests.length === 0) ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                    Aucune ordonnance archivée pour ce patient.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {/* Prescriptions médicamenteuses */}
                    {patient.prescriptions?.map((presc) => (
                      <div key={presc.id} className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900">
                            💊 Ordonnance Médicamenteuse du {presc.date}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-semibold">{presc.lines.length} spécialité(s)</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-slate-800">
                          {presc.lines.map((l) => (
                            <li key={l.id}>
                              <strong>{l.medication.name}</strong> : {l.dosageInstructions} ({l.duration})
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Bilans sanguins */}
                    {patient.bloodTests?.map((bt) => (
                      <div key={bt.id} className="p-4 bg-indigo-50/40 rounded-xl border border-indigo-200 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900">
                            🔬 Ordonnance de Biologie Médicale du {bt.date}
                          </span>
                          <span className="text-[10px] text-indigo-700 font-semibold">{bt.selectedTests.length} analyse(s)</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {bt.selectedTests.map((test, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-[11px] text-indigo-900">
                              {test}
                            </span>
                          ))}
                        </div>
                        {bt.clinicalIndications && (
                          <p className="text-[11px] text-slate-500 italic">Indication : {bt.clinicalIndications}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. COURRIERS D'ADRESSAGE SPÉCIALISTES */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  Courriers d'Adressage Confrères ({patient.letters?.length || 0})
                </h3>

                {!patient.letters || patient.letters.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                    Aucun courrier rédigé pour ce patient.
                  </p>
                ) : (
                  patient.letters.map((letter) => (
                    <div key={letter.id} className="p-4 bg-purple-50/40 rounded-xl border border-purple-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-purple-900">
                          ✉️ {letter.specialistTitle} — Édité le {letter.date}
                        </span>
                        <button
                          onClick={() => copyText(letter.id, letter.content)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-purple-300 text-purple-800 rounded-lg hover:bg-purple-100 transition-colors font-semibold cursor-pointer"
                        >
                          {copiedDocId === letter.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copié</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copier le texte</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="whitespace-pre-line text-slate-700 bg-white p-3 rounded-lg border border-purple-100 font-mono text-[11px] max-h-40 overflow-y-auto">
                        {letter.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Patient Modal */}
      {isEditModalOpen && (
        <PatientEditModal
          patient={patient}
          onSave={(updated) => {
            onUpdatePatient(updated);
          }}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};
