import React, { useState } from 'react';
import { 
  Activity, 
  Check, 
  Printer, 
  Sparkles, 
  FileCheck2, 
  QrCode, 
  AlertCircle,
  HelpCircle,
  Clock,
  User,
  Trash2
} from 'lucide-react';
import { Patient, BloodTestPrescription, DoctorSettings } from '../../types/medical';

interface BloodTestPrescriptionViewProps {
  currentPatient: Patient | null;
  doctorProfile: DoctorSettings;
  onSaveBloodTest: (patientId: string, bloodTest: BloodTestPrescription) => void;
}

interface TestCategory {
  category: string;
  items: string[];
}

const BLOOD_TEST_CATEGORIES: TestCategory[] = [
  {
    category: 'Hématologie & Hémostase',
    items: [
      'NFS (Numération Formule Sanguine) + Plaquettes',
      'Vitesse de sédimentation (VS)',
      'Taux de Prothrombine (TP) / INR',
      'Temps de Céphaline Activée (TCA)',
      'Fibrinogène',
      'Groupe sanguin ABO + Facteur Rhésus (2 déterminations) + RAI'
    ]
  },
  {
    category: 'Biochimie, Métabolisme & Rénale',
    items: [
      'Ionogramme sanguin (Sodium, Potassium, Chlore)',
      'Créatininémie avec estimation du DFG (CKD-EPI)',
      'Urée sanguine',
      'Glycémie veineuse à jeun',
      'Hémoglobine glyquée (HbA1c)',
      'Bilan lipidique complet (EAL : Cholestérol total, HDL, LDL calculé, Triglycérides)',
      'Acide urique (Uricémie)',
      'Calcémie + Albuminémie'
    ]
  },
  {
    category: 'Bilan Hépatique & Pancréatique',
    items: [
      'Transaminases ASAT (TGO) et ALAT (TGP)',
      'Gamma-Glutamyl Transférase (GGT)',
      'Phosphatases Alcalines (PAL)',
      'Bilirubine totale et conjuguée',
      'Lipase sérique'
    ]
  },
  {
    category: 'Endocrinologie, Fer & Vitamines',
    items: [
      'TSH ultra-sensible (TSH us)',
      'T4 libre (T4L)',
      'Ferritinémie',
      'Coefficient de saturation de la transferrine (CST)',
      'Vitamine D (25-OH-D3)',
      'Vitamine B12 et Folates sériques (B9)',
      'Troponine ultra-sensible',
      'BNP ou NT-proBNP'
    ]
  },
  {
    category: 'Analyses Urinaires & Infectiologie',
    items: [
      'Protéine C-Réactive (CRP)',
      'ECBU avec cytologie, numération de germes et antibiogramme si leucocyturie',
      'Microalbuminurie sur échantillon d\'urines fraîches',
      'Protéinurie des 24 heures',
      'Sérologie VIH 1 et 2 (avec accord)',
      'Sérologies Hépatites B et C (Ag HBs, Ac anti-HBs, Ac anti-HCV)'
    ]
  }
];

export const BloodTestPrescriptionView: React.FC<BloodTestPrescriptionViewProps> = ({
  currentPatient,
  doctorProfile,
  onSaveBloodTest
}) => {
  const [selectedTests, setSelectedTests] = useState<string[]>([
    'NFS (Numération Formule Sanguine) + Plaquettes',
    'Ionogramme sanguin (Sodium, Potassium, Chlore)',
    'Créatininémie avec estimation du DFG (CKD-EPI)',
    'Glycémie veineuse à jeun',
    'Bilan lipidique complet (EAL : Cholestérol total, HDL, LDL calculé, Triglycérides)'
  ]);

  const [fastingRequired, setFastingRequired] = useState(true);
  const [homeSamplingAllowed, setHomeSamplingAllowed] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [ald, setAld] = useState(false);
  const [clinicalIndications, setClinicalIndications] = useState('Bilan systématique de contrôle');
  const [additionalTests, setAdditionalTests] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!currentPatient) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
        <Activity className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-700">Aucun patient sélectionné</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Veuillez sélectionner un patient dans la liste pour rédiger une ordonnance de biologie médicale.
        </p>
      </div>
    );
  }

  const toggleTest = (test: string) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter((t) => t !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'standard':
        setSelectedTests([
          'NFS (Numération Formule Sanguine) + Plaquettes',
          'Ionogramme sanguin (Sodium, Potassium, Chlore)',
          'Créatininémie avec estimation du DFG (CKD-EPI)',
          'Glycémie veineuse à jeun',
          'Bilan lipidique complet (EAL : Cholestérol total, HDL, LDL calculé, Triglycérides)',
          'Transaminases ASAT (TGO) et ALAT (TGP)',
          'TSH ultra-sensible (TSH us)'
        ]);
        setFastingRequired(true);
        setClinicalIndications('Bilan biologique général annuel');
        break;

      case 'diabete':
        setSelectedTests([
          'Hémoglobine glyquée (HbA1c)',
          'Glycémie veineuse à jeun',
          'Créatininémie avec estimation du DFG (CKD-EPI)',
          'Bilan lipidique complet (EAL : Cholestérol total, HDL, LDL calculé, Triglycérides)',
          'Microalbuminurie sur échantillon d\'urines fraîches'
        ]);
        setFastingRequired(true);
        setClinicalIndications('Surveillance trimestrielle Diabète Type 2 - ALD');
        setAld(true);
        break;

      case 'hta':
        setSelectedTests([
          'Ionogramme sanguin (Sodium, Potassium, Chlore)',
          'Créatininémie avec estimation du DFG (CKD-EPI)',
          'Bilan lipidique complet (EAL : Cholestérol total, HDL, LDL calculé, Triglycérides)',
          'Glycémie veineuse à jeun',
          'Protéinurie des 24 heures'
        ]);
        setFastingRequired(true);
        setClinicalIndications('Bilan de retentissement et suivi HTA');
        break;

      case 'fatigue':
        setSelectedTests([
          'NFS (Numération Formule Sanguine) + Plaquettes',
          'Ferritinémie',
          'Protéine C-Réactive (CRP)',
          'TSH ultra-sensible (TSH us)',
          'Vitamine D (25-OH-D3)',
          'Vitamine B12 et Folates sériques (B9)',
          'Ionogramme sanguin (Sodium, Potassium, Chlore)'
        ]);
        setFastingRequired(false);
        setClinicalIndications('Bilan étiologique d\'asthénie inexpliquée / suspicion carence martiale');
        break;

      case 'preop':
        setSelectedTests([
          'NFS (Numération Formule Sanguine) + Plaquettes',
          'Taux de Prothrombine (TP) / INR',
          'Temps de Céphaline Activée (TCA)',
          'Groupe sanguin ABO + Facteur Rhésus (2 déterminations) + RAI',
          'Ionogramme sanguin (Sodium, Potassium, Chlore)',
          'Créatininémie avec estimation du DFG (CKD-EPI)'
        ]);
        setFastingRequired(false);
        setClinicalIndications('Bilan pré-opératoire et hémostase');
        break;

      case 'infectieux':
        setSelectedTests([
          'NFS (Numération Formule Sanguine) + Plaquettes',
          'Protéine C-Réactive (CRP)',
          'Vitesse de sédimentation (VS)',
          'ECBU avec cytologie, numération de germes et antibiogramme si leucocyturie'
        ]);
        setFastingRequired(false);
        setClinicalIndications('Syndrome fébrile aigu / Bilan infectieux');
        break;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSavePrescription = () => {
    const bloodTest: BloodTestPrescription = {
      id: `bt-${Date.now()}`,
      patientId: currentPatient.id,
      doctorName: doctorProfile.name,
      doctorRpps: doctorProfile.rpps,
      date: new Date().toLocaleDateString('fr-FR'),
      fastingRequired,
      homeSamplingAllowed,
      isUrgent,
      ald,
      clinicalIndications,
      selectedTests,
      additionalTests: additionalTests.trim() || undefined,
      signedAt: new Date().toISOString()
    };

    onSaveBloodTest(currentPatient.id, bloodTest);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Banner & Actions */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Ordonnance de Biologie Médicale & Bilan Sanguin
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Ordonnance Distincte
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Pour : <strong>{currentPatient.lastName} {currentPatient.firstName}</strong> • NIR : {currentPatient.ssn}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSavePrescription}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl shadow-2xs transition-all ${
              isSaved
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Enregistrée dans le dossier ✓</span>
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
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimer l'ordonnance</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Presets & Checkboxes on Left, Printable A4 Sheet on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ENRICHED BUILDER */}
        <div className="no-print lg:col-span-6 space-y-4">
          {/* Quick Presets */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#1A73E8]" />
              Profils Cliniques en 1-Clic
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-300 border border-slate-200 rounded-lg transition-colors"
              >
                ⚡ Bilan Standard
              </button>
              <button
                type="button"
                onClick={() => applyPreset('diabete')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-300 border border-slate-200 rounded-lg transition-colors"
              >
                ⚡ Suivi Diabète (HbA1c)
              </button>
              <button
                type="button"
                onClick={() => applyPreset('hta')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-300 border border-slate-200 rounded-lg transition-colors"
              >
                ⚡ Bilan HTA & Rénal
              </button>
              <button
                type="button"
                onClick={() => applyPreset('fatigue')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-300 border border-slate-200 rounded-lg transition-colors"
              >
                ⚡ Asthénie / Anémie / Fer
              </button>
              <button
                type="button"
                onClick={() => applyPreset('preop')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-300 border border-slate-200 rounded-lg transition-colors"
              >
                ⚡ Pré-opératoire
              </button>
              <button
                type="button"
                onClick={() => applyPreset('infectieux')}
                className="px-2.5 py-1 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-[#1A73E8] hover:border-blue-300 border border-slate-200 rounded-lg transition-colors"
              >
                ⚡ Bilan Infectieux (CRP/ECBU)
              </button>
            </div>
          </div>

          {/* Options & Clinical Indications */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Conditions de Réalisation & Mentions
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={fastingRequired}
                  onChange={(e) => setFastingRequired(e.target.checked)}
                  className="rounded text-[#1A73E8] focus:ring-[#1A73E8]"
                />
                <span className="font-semibold text-slate-800">À jeun strict</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={homeSamplingAllowed}
                  onChange={(e) => setHomeSamplingAllowed(e.target.checked)}
                  className="rounded text-[#1A73E8] focus:ring-[#1A73E8]"
                />
                <span className="font-semibold text-slate-800">Prélèvement à domicile (IDE)</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-red-50/50 border border-red-200 cursor-pointer hover:bg-red-50 transition-colors">
                <input
                  type="checkbox"
                  checked={isUrgent}
                  onChange={(e) => setIsUrgent(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="font-semibold text-red-800">Caractère d'URGENCE</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-xl bg-blue-50/50 border border-blue-200 cursor-pointer hover:bg-blue-50 transition-colors">
                <input
                  type="checkbox"
                  checked={ald}
                  onChange={(e) => setAld(e.target.checked)}
                  className="rounded text-[#1A73E8] focus:ring-[#1A73E8]"
                />
                <span className="font-semibold text-blue-800">Prise en charge ALD 100%</span>
              </label>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Indication clinique / Renseignement médical :
              </label>
              <input
                type="text"
                value={clinicalIndications}
                onChange={(e) => setClinicalIndications(e.target.value)}
                placeholder="Ex : Contrôle annuel, HTA, Diabète, Fièvre..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
              />
            </div>
          </div>

          {/* Test selection list grouped by category */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 max-h-[500px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Sélection des Analyses ({selectedTests.length} sélectionnée(s))
              </span>
              <button
                type="button"
                onClick={() => setSelectedTests([])}
                className="text-xs text-slate-400 hover:text-red-600"
              >
                Tout désélectionner
              </button>
            </div>

            {BLOOD_TEST_CATEGORIES.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50 px-2 py-1 rounded-md">
                  {cat.category}
                </h4>
                <div className="space-y-1">
                  {cat.items.map((test) => {
                    const isChecked = selectedTests.includes(test);
                    return (
                      <label
                        key={test}
                        className={`flex items-start gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-blue-50/70 border border-blue-200 text-slate-900 font-semibold'
                            : 'hover:bg-slate-50 border border-transparent text-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleTest(test)}
                          className="mt-0.5 rounded text-[#1A73E8] focus:ring-[#1A73E8]"
                        />
                        <span>{test}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Additional custom tests */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Autres analyses spécifiques (champ libre) :
              </label>
              <textarea
                rows={2}
                value={additionalTests}
                onChange={(e) => setAdditionalTests(e.target.value)}
                placeholder="Ex : Dosage sanguin tacrolimus, Anticorps anti-nucléaires, Calprotectine fécale..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-hidden focus:border-[#1A73E8]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: OFFICIAL PRINTABLE A4 MEDICAL BIOLOGY PRESCRIPTION */}
        <div className="lg:col-span-6">
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
                <div className="inline-block bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg text-indigo-900 text-xs font-bold uppercase tracking-wider">
                  Biologie Médicale
                </div>
                <div className="text-xs text-slate-600 mt-2 font-medium">
                  {doctorProfile.city}, le {new Date().toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            {/* Patient banner */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-500">Patient(e) : </span>
                <strong className="text-sm font-bold text-slate-900">
                  {currentPatient.lastName.toUpperCase()} {currentPatient.firstName}
                </strong>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Né(e) le : <strong>{currentPatient.birthDate}</strong> (Sexe : {currentPatient.gender === 'M' ? 'M' : 'F'})
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-600">
                <div>NIR : <strong className="font-mono">{currentPatient.ssn}</strong></div>
                {ald && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded">
                    Prescription en ALD
                  </span>
                )}
              </div>
            </div>

            {/* Conditions & Mentions */}
            {(fastingRequired || homeSamplingAllowed || isUrgent || clinicalIndications) && (
              <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                  Conditions de prélèvement & Renseignements cliniques :
                </div>
                <div className="flex flex-wrap gap-2 text-[11px] text-amber-800">
                  {fastingRequired && <span className="font-semibold underline">Prélèvement à jeun strict</span>}
                  {homeSamplingAllowed && <span>• À réaliser à domicile par IDE si besoin</span>}
                  {isUrgent && <span className="text-red-700 font-bold">• RÉSULTATS EN URGENCE</span>}
                </div>
                {clinicalIndications && (
                  <div className="text-[11px] text-slate-600 italic">
                    Indication : {clinicalIndications}
                  </div>
                )}
              </div>
            )}

            {/* Prescribed tests list */}
            <div className="py-2 space-y-3 min-h-[220px]">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                Prière de réaliser les examens de biologie médicale suivants :
              </div>

              {selectedTests.length === 0 && !additionalTests ? (
                <div className="text-center py-10 text-slate-400 text-xs italic">
                  Aucun examen sélectionné. Cochez les analyses dans le panneau de gauche.
                </div>
              ) : (
                <ul className="space-y-2 text-xs">
                  {selectedTests.map((test, i) => (
                    <li key={i} className="flex items-start gap-2 pl-2 border-l-2 border-indigo-400">
                      <span className="font-semibold text-slate-900">{i + 1}. {test}</span>
                    </li>
                  ))}
                  {additionalTests && (
                    <li className="pl-2 border-l-2 border-purple-400 text-purple-950 font-medium whitespace-pre-line">
                      • {additionalTests}
                    </li>
                  )}
                </ul>
              )}
            </div>

            {/* Footer with doctor signature */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-xs">
              <div className="space-y-1 max-w-xs">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-300">
                    <QrCode className="w-6 h-6 text-slate-700" />
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Ordonnance de Biologie Médicale<br />
                    Conforme e-CPS / ANS<br />
                    <span className="font-mono text-slate-600">ID: BIO-{Date.now().toString(36).toUpperCase()}</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-400 italic">
                  {doctorProfile.legalNotice}
                </p>
              </div>

              <div className="text-center min-w-44 border border-slate-300 rounded-xl p-3 bg-slate-50/50">
                <div className="text-[11px] font-bold text-slate-800">{doctorProfile.name}</div>
                <div className="text-[10px] text-slate-500">Signature & Cachet du Praticien</div>
                <div className="mt-1 font-serif text-blue-700 font-bold italic text-base">
                  {doctorProfile.name.replace('Dr ', 'Dr ')}
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
  );
};
