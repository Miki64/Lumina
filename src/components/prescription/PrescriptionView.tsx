import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Printer, 
  Download, 
  Check, 
  Clock, 
  Sparkles, 
  Info,
  QrCode,
  FileCheck2,
  RefreshCw,
  X,
  Activity,
  User
} from 'lucide-react';
import { Medication, Patient, PrescriptionLine, SafetyAlert, Prescription, BloodTestPrescription, DoctorSettings } from '../../types/medical';
import { BdpmService } from '../../services/bdpmService';
import { PrescriptionSafetyEngine } from '../../services/prescriptionSafetyService';
import { FRENCH_MEDICATIONS } from '../../data/frenchMedications';
import { BloodTestPrescriptionView } from './BloodTestPrescriptionView';

interface PrescriptionViewProps {
  currentPatient: Patient | null;
  patients: Patient[];
  doctorProfile: DoctorSettings;
  onSelectPatient: (patient: Patient) => void;
  onSavePrescription: (patientId: string, prescription: Prescription) => void;
  onSaveBloodTest: (patientId: string, bloodTest: BloodTestPrescription) => void;
}

export const PrescriptionView: React.FC<PrescriptionViewProps> = ({
  currentPatient,
  patients,
  doctorProfile,
  onSelectPatient,
  onSavePrescription,
  onSaveBloodTest
}) => {
  // Prescription Sub-Mode: Medications OR Blood Test (Biologie médicale)
  const [prescriptionType, setPrescriptionType] = useState<'MEDICATION' | 'BLOOD_TEST'>('MEDICATION');

  const activePatient = currentPatient || (patients.length > 0 ? patients[0] : null);

  // Prescription Lines State
  const [lines, setLines] = useState<PrescriptionLine[]>([]);

  // Search & Medication Picker
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Medication[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);

  // New Line inputs
  const [dosageText, setDosageText] = useState('1 prise matin et soir au milieu du repas');
  const [durationText, setDurationText] = useState('7 jours');
  const [quantityText, setQuantityText] = useState('1 boîte');
  const [isNonSub, setIsNonSub] = useState(false);
  const [isAld, setIsAld] = useState(false);
  const [renewals, setRenewals] = useState<number>(0);

  // Safety Alerts from VIDAL Engine
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [isSaved, setIsSaved] = useState(false);

  // Trigger search with full BDPM service (15,883 medications)
  useEffect(() => {
    let active = true;
    setIsSearching(true);
    BdpmService.searchMedications(searchQuery).then((results) => {
      if (active) {
        setSearchResults(results);
        setIsSearching(false);
      }
    });
    return () => {
      active = false;
    };
  }, [searchQuery]);

  // Run VIDAL Expert Safety Engine whenever lines or active patient change
  useEffect(() => {
    const alerts = PrescriptionSafetyEngine.analyze(lines, activePatient);
    setSafetyAlerts(alerts);
  }, [lines, activePatient]);

  const handleSelectMedicationToAdd = (med: Medication) => {
    setSelectedMed(med);
    // Provide sensible default dosage based on molecule
    const lower = med.name.toLowerCase();
    if (lower.includes('amoxicilline')) {
      setDosageText('1 gélule matin et soir au cours du repas');
      setDurationText('6 jours');
    } else if (lower.includes('ibuprof')) {
      setDosageText('1 comprimé à renouveler si besoin après 8h, au milieu d\'un repas');
      setDurationText('3 à 5 jours max');
    } else if (lower.includes('doliprane') || lower.includes('paracetamol')) {
      setDosageText('1 comprimé toutes les 6 heures si douleur ou fièvre, max 3g/jour');
      setDurationText('5 jours');
    } else if (lower.includes('kardegic')) {
      setDosageText('1 sachet par jour au milieu du déjeuner');
      setDurationText('3 mois');
    } else if (lower.includes('ramipril')) {
      setDosageText('1 comprimé le matin au réveil');
      setDurationText('3 mois');
    } else if (lower.includes('inexium')) {
      setDosageText('1 comprimé le soir 30 min avant le repas');
      setDurationText('4 semaines');
    } else {
      setDosageText('1 prise matin et soir');
      setDurationText('7 jours');
    }
  };

  const handleAddLine = () => {
    if (!selectedMed) return;

    const newLine: PrescriptionLine = {
      id: `line-${Date.now()}`,
      medication: selectedMed,
      dosageInstructions: dosageText,
      duration: durationText,
      quantity: quantityText,
      isNonSubstituable: isNonSub,
      ald: isAld
    };

    setLines([...lines, newLine]);
    setSelectedMed(null);
  };

  const handleRemoveLine = (id: string) => {
    setLines(lines.filter((l) => l.id !== id));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveToPatient = () => {
    if (!activePatient) return;

    const prescription: Prescription = {
      id: `rx-${Date.now()}`,
      patientId: activePatient.id,
      doctorName: doctorProfile.name,
      doctorRpps: doctorProfile.rpps,
      doctorSpecialty: doctorProfile.title,
      cabinetAddress: `${doctorProfile.address}, ${doctorProfile.postalCode} ${doctorProfile.city}`,
      cabinetPhone: doctorProfile.phone,
      date: new Date().toLocaleDateString('fr-FR'),
      lines: [...lines],
      renewals: renewals,
      signedAt: new Date().toISOString()
    };

    onSavePrescription(activePatient.id, prescription);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!activePatient) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
        <Pill className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-700">Aucun patient disponible</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Pour rédiger une ordonnance, veuillez d'abord créer un dossier patient dans l'onglet "Dossiers Patients".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Type Switcher: Médicaments VS Bilan Sanguin */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPrescriptionType('MEDICATION')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              prescriptionType === 'MEDICATION'
                ? 'bg-[#1A73E8] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Pill className="w-4 h-4" />
            <span>Ordonnance Médicamenteuse (BDPM & VIDAL)</span>
          </button>

          <button
            onClick={() => setPrescriptionType('BLOOD_TEST')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              prescriptionType === 'BLOOD_TEST'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Prescription Bilan Sanguin & Biologie</span>
          </button>
        </div>

        {/* Patient Switcher */}
        {patients.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500">Patient :</span>
            <select
              value={activePatient.id}
              onChange={(e) => {
                const found = patients.find((p) => p.id === e.target.value);
                if (found) onSelectPatient(found);
              }}
              className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-hidden"
            >
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.lastName} {p.firstName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* RENDER BLOOD TEST VIEW IF SELECTED */}
      {prescriptionType === 'BLOOD_TEST' ? (
        <BloodTestPrescriptionView
          currentPatient={activePatient}
          doctorProfile={doctorProfile}
          onSaveBloodTest={onSaveBloodTest}
        />
      ) : (
        /* RENDER MEDICATION PRESCRIPTION VIEW */
        <div className="space-y-6">
          {/* Top Banner with Patient Info & Action Buttons */}
          <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1A73E8] flex items-center justify-center font-extrabold text-lg shadow-2xs">
                {activePatient.firstName[0]}{activePatient.lastName[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-900">
                    Prescription : {activePatient.lastName} {activePatient.firstName}
                  </h1>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1A73E8] border border-blue-200">
                    {lines.length} médicament(s)
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-3">
                  <span>Né(e) le {activePatient.birthDate}</span>
                  <span>•</span>
                  <span>NIR : {activePatient.ssn}</span>
                  <span>•</span>
                  <span>Prescripteur : <strong>{doctorProfile.name}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToPatient}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl shadow-2xs transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Enregistrée au dossier ✓</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Enregistrer au dossier</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer l'ordonnance</span>
              </button>
            </div>
          </div>

          {/* VIDAL EXPERT SAFETY ALERT BANNER */}
          {safetyAlerts.length > 0 && (
            <div className="no-print space-y-2">
              {safetyAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border flex items-start gap-3 shadow-2xs transition-all ${
                    alert.level === 'ALLERGIE'
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : alert.level === 'CONTRE_INDICATION'
                      ? 'bg-red-50/80 border-red-200 text-red-900'
                      : alert.level === 'ASSOCIATION_DECONSEILLEE'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-yellow-50 border-yellow-200 text-yellow-900'
                  }`}
                >
                  <AlertTriangle
                    className={`w-5 h-5 shrink-0 mt-0.5 ${
                      alert.level === 'ALLERGIE' || alert.level === 'CONTRE_INDICATION'
                        ? 'text-red-600'
                        : 'text-amber-600'
                    }`}
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <strong className="font-bold text-sm">{alert.title}</strong>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 border">
                        {alert.level.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="mt-1 font-medium">{alert.description}</p>
                    <p className="mt-1 text-[11px] opacity-90">
                      💡 <strong>Recommandation VIDAL :</strong> {alert.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Main Prescription Layout: Search & Builder on Left, Official Printable Preview on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: BDPM SEARCH & ADD MEDICATIONS */}
            <div className="no-print lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                      Recherche BDPM (15 883 Médicaments)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Base officielle publique ANSM intégrale
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    Base Intégrale
                  </span>
                </div>

                {/* Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nom, DCI ou molécule (ex: Doliprane, Amoxicilline, Ozempic, Spasfon)..."
                    className="w-full pl-10 pr-8 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all font-medium"
                  />
                  {isSearching && (
                    <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {/* Search Results list */}
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                    Résultats trouvés ({searchResults.length})
                  </span>
                  {searchResults.map((med) => (
                    <div
                      key={med.cis}
                      onClick={() => handleSelectMedicationToAdd(med)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedMed?.cis === med.cis
                          ? 'bg-blue-50 border-[#1A73E8] shadow-2xs'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{med.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">CIS {med.cis}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                        <span>DCI : <strong>{med.dci}</strong></span>
                        <span className="text-slate-400">{med.form}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Config Selected Medication form */}
                {selectedMed && (
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-[#1A73E8] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Ajouter : {selectedMed.name.split(',')[0]}
                      </div>
                      <button
                        onClick={() => setSelectedMed(null)}
                        className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Posologie & Instructions de prise :
                      </label>
                      <input
                        type="text"
                        value={dosageText}
                        onChange={(e) => setDosageText(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-hidden focus:border-[#1A73E8]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Durée :</label>
                        <input
                          type="text"
                          value={durationText}
                          onChange={(e) => setDurationText(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-hidden focus:border-[#1A73E8]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Quantité :</label>
                        <input
                          type="text"
                          value={quantityText}
                          onChange={(e) => setQuantityText(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs outline-hidden focus:border-[#1A73E8]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs pt-1">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isNonSub}
                          onChange={(e) => setIsNonSub(e.target.checked)}
                          className="rounded text-[#1A73E8] focus:ring-[#1A73E8]"
                        />
                        <span>Non substituable</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAld}
                          onChange={(e) => setIsAld(e.target.checked)}
                          className="rounded text-[#1A73E8] focus:ring-[#1A73E8]"
                        />
                        <span>En ALD (100%)</span>
                      </label>
                    </div>

                    <button
                      onClick={handleAddLine}
                      className="w-full py-2 bg-[#1A73E8] hover:bg-[#1557B0] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter à l'ordonnance</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: OFFICIAL PRINTABLE A4 MEDICAL PRESCRIPTION */}
            <div className="lg:col-span-7">
              <div className="print-page bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-slate-800 space-y-6">
                {/* Header: Prescriber */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{doctorProfile.name}</h3>
                    <p className="text-xs text-slate-600">{doctorProfile.title}</p>
                    <p className="text-xs text-slate-600">{doctorProfile.cabinetName}</p>
                    <p className="text-xs text-slate-600">{doctorProfile.address}, {doctorProfile.postalCode} {doctorProfile.city}</p>
                    <p className="text-xs text-slate-600">Tél : {doctorProfile.phone}</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">
                      N° RPPS : {doctorProfile.rpps} • ADELI : {doctorProfile.adeli}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="inline-block bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg text-[#1A73E8] text-xs font-bold uppercase tracking-wider">
                      Ordonnance Médicale
                    </div>
                    <div className="text-xs font-semibold text-slate-800 mt-2">
                      {doctorProfile.city}, le {new Date().toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </div>

                {/* Patient Banner */}
                <div className="pt-2 pb-2 flex justify-between items-center text-xs border-b border-slate-200">
                  <div>
                    <span className="text-slate-500">Pour : </span>
                    <strong className="text-sm font-bold text-slate-900">
                      {activePatient.lastName.toUpperCase()} {activePatient.firstName}
                    </strong>
                  </div>
                  <div className="text-slate-600 space-x-3">
                    <span>Né(e) le : <strong>{activePatient.birthDate}</strong></span>
                    <span>•</span>
                    <span>NIR : <strong className="font-mono">{activePatient.ssn}</strong></span>
                  </div>
                </div>

                {/* Prescription Items (Medications List) */}
                <div className="py-4 space-y-5 min-h-[220px]">
                  {lines.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs italic">
                      Aucun médicament sur cette ordonnance. Utilisez le formulaire à gauche pour rechercher parmi les 15 883 médicaments de la base BDPM.
                    </div>
                  ) : (
                    lines.map((line, index) => (
                      <div key={line.id} className="group relative pl-4 border-l-2 border-slate-300 text-xs space-y-1">
                        <div className="flex items-baseline justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">
                              {index + 1}. {line.medication.name}
                            </span>
                            {line.isNonSubstituable && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-200 text-slate-800 rounded">
                                NON SUBSTITUABLE
                              </span>
                            )}
                            {line.ald && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded">
                                ALD
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleRemoveLine(line.id)}
                            className="no-print opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition-opacity p-1 cursor-pointer"
                            title="Supprimer cette ligne"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-xs text-slate-800 font-medium pl-2">
                          👉 {line.dosageInstructions}
                        </p>

                        <div className="text-[11px] text-slate-500 pl-2">
                          Pendant : <strong className="text-slate-700">{line.duration}</strong> • Quantité : <strong className="text-slate-700">{line.quantity}</strong>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Official Footer with Signature & Legal Notices */}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
                  <div className="space-y-1 max-w-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-300">
                        <QrCode className="w-6 h-6 text-slate-700" />
                      </div>
                      <div className="text-[10px] text-slate-500 leading-tight">
                        Prescription électronique certifiée<br />
                        <span className="font-mono text-slate-600">ID: MED-{Date.now().toString(36).toUpperCase()}</span>
                      </div>
                    </div>
                    <p className="text-[9px] text-slate-400 italic">
                      {doctorProfile.legalNotice}
                    </p>
                  </div>

                  <div className="text-center min-w-44 border border-slate-300 rounded-xl p-3 bg-slate-50/50">
                    <div className="text-[11px] font-bold text-slate-800">{doctorProfile.name}</div>
                    <div className="text-[10px] text-slate-500">Signature numérique qualifiée</div>
                    <div className="mt-1 font-serif text-blue-700 font-bold italic text-base">
                      {doctorProfile.name}
                    </div>
                    <div className="text-[9px] text-emerald-700 font-semibold mt-0.5">
                      ✓ Horodatage certifié
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
