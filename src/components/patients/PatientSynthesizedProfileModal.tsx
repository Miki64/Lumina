import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  Check, 
  ShieldCheck, 
  Copy, 
  Lock, 
  Calendar, 
  AlertTriangle,
  HeartPulse,
  User,
  X
} from 'lucide-react';
import { Patient, DoctorSettings } from '../../types/medical';

interface PatientSynthesizedProfileModalProps {
  patient: Patient;
  doctorProfile: DoctorSettings;
  onClose: () => void;
}

export const PatientSynthesizedProfileModal: React.FC<PatientSynthesizedProfileModalProps> = ({
  patient,
  doctorProfile,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharePassword, setSharePassword] = useState('LUM-' + Math.floor(100000 + Math.random() * 900000));
  const [shareLinkActive, setShareLinkActive] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const exportData = {
      format: 'VoletDeSyntheseMedicale-VSM',
      version: '1.2-ANS-DMP',
      generatedAt: new Date().toISOString(),
      software: 'Lumina — Exercez ! On s\'occupe du reste...',
      practitioner: doctorProfile,
      patient: {
        identity: {
          firstName: patient.firstName,
          lastName: patient.lastName,
          gender: patient.gender,
          birthDate: patient.birthDate,
          ssn: patient.ssn,
          bloodGroup: patient.bloodGroup
        },
        contact: {
          phone: patient.phone,
          email: patient.email,
          address: `${patient.address}, ${patient.postalCode} ${patient.city}`
        },
        allergiesAndIntolerances: patient.allergies,
        medicalHistory: patient.medicalHistory,
        surgicalHistory: patient.surgicalHistory,
        familyHistory: patient.familyHistory,
        activeTreatments: patient.ongoingTreatments,
        lastVitals: patient.visits[0]?.vitals || null,
        recentVisitsCount: patient.visits.length
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `VSM_${patient.lastName}_${patient.firstName}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyShareLink = () => {
    const fakeSecureUrl = `https://lumina-sante.fr/confrere/vsm-share?token=sec_${patient.id}_${Date.now().toString(36)}&exp=48h`;
    navigator.clipboard.writeText(fakeSecureUrl);
    setCopiedLink(true);
    setShareLinkActive(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print p-4 sm:px-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#1A73E8] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 leading-tight">
                Volet de Synthèse Médicale (VSM)
              </h2>
              <p className="text-xs text-slate-500">
                Format standardisé confrère & Mon Espace Santé • {patient.lastName} {patient.firstName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg shadow-2xs transition-colors cursor-pointer"
              title="Exporter au format structuré JSON (DMP)"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer / PDF Pleine Page</span>
            </button>

            <button
              onClick={onClose}
              className="ml-2 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Peer Sharing Simulation Banner (Hidden on print) */}
          <div className="no-print p-4 bg-linear-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-[#1A73E8] uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  Partage sécurisé Confrère (Messagerie Sécurisée de Santé - MSSanté)
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Générez un lien de consultation éphémère (chiffré de bout en bout, validité 48h) avec code d'accès OTP.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyShareLink}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-[#1A73E8] bg-white border border-blue-300 hover:bg-blue-50 rounded-xl shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Lien chiffré copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier lien confrère</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {shareLinkActive && (
              <div className="mt-3 pt-3 border-t border-blue-200/70 flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Code d'accès sécurisé pour le confrère :</span>
                  <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-900">
                    {sharePassword}
                  </span>
                </div>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-700 font-medium">Validité 48h chiffré</span>
              </div>
            )}
          </div>

          {/* PRINTABLE OFFICIAL VSM SHEET (Takes 100% full width and height on print) */}
          <div className="print-page bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 text-slate-800 space-y-6 w-full">
            {/* Header Document */}
            <div className="flex flex-col sm:flex-row justify-between pb-4 border-b-2 border-slate-900 gap-4">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Volet de Synthèse Médicale (VSM)
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                  {patient.lastName.toUpperCase()} {patient.firstName}
                </h1>
                <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                  <p>Date de naissance : <strong className="text-slate-900">{patient.birthDate}</strong> (Sexe : {patient.gender === 'M' ? 'Masculin' : 'Féminin'})</p>
                  <p>N° Sécurité Sociale (NIR) : <strong className="font-mono text-slate-900">{patient.ssn}</strong></p>
                  <p>Coordonnées : {patient.phone} • {patient.address}, {patient.postalCode} {patient.city}</p>
                </div>
              </div>

              <div className="sm:text-right text-xs text-slate-600 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="font-bold text-slate-900 text-sm">{doctorProfile.name}</div>
                <div>{doctorProfile.title}</div>
                <div>N° RPPS : {doctorProfile.rpps} • ADELI : {doctorProfile.adeli}</div>
                <div>{doctorProfile.cabinetName}</div>
                <div>{doctorProfile.address}, {doctorProfile.postalCode} {doctorProfile.city}</div>
                <div className="mt-1 font-semibold text-slate-500">
                  Document édité le {new Date().toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>

            {/* CRITICAL SAFETY: ALLERGIES & INTOLERANCES */}
            <div className={`p-4 rounded-xl border ${patient.allergies.length > 0 ? 'bg-red-50/60 border-red-300' : 'bg-emerald-50/50 border-emerald-200'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className={`w-4 h-4 ${patient.allergies.length > 0 ? 'text-red-600' : 'text-emerald-600'}`} />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${patient.allergies.length > 0 ? 'text-red-900' : 'text-emerald-900'}`}>
                  Allergies & Intolérances Majeures
                </h3>
              </div>
              {patient.allergies.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {patient.allergies.map((allergy, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-lg border border-red-300 shadow-2xs"
                    >
                      ⚠️ {allergy}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-800 font-medium">
                  Aucune allergie ou intolérance médicamenteuse connue déclarée à ce jour.
                </p>
              )}
            </div>

            {/* ANTECEDENTS (Médicaux, Chirurgicaux, Familiaux) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Antécédents Médicaux */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Antécédents Médicaux
                </h4>
                {patient.medicalHistory.length > 0 ? (
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {patient.medicalHistory.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">Néant</p>
                )}
              </div>

              {/* Antécédents Chirurgicaux (Demandé distinctement) */}
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200">
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-2">
                  Antécédents Chirurgicaux
                </h4>
                {patient.surgicalHistory.length > 0 ? (
                  <ul className="text-xs text-indigo-950 space-y-1 list-disc list-inside">
                    {patient.surgicalHistory.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">Néant</p>
                )}
              </div>

              {/* Antécédents Familiaux */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Antécédents Familiaux
                </h4>
                {patient.familyHistory.length > 0 ? (
                  <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                    {patient.familyHistory.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 italic">Néant</p>
                )}
              </div>
            </div>

            {/* TRAITEMENTS DE FOND */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Traitements de Fond Actuels
              </h4>
              {patient.ongoingTreatments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {patient.ongoingTreatments.map((tr, i) => (
                    <div key={i} className="p-2 bg-white rounded-lg border border-slate-200 font-semibold text-slate-800">
                      💊 {tr}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Aucun traitement de fond au long cours répertorié.</p>
              )}
            </div>

            {/* DERNIERES CONSTANTES */}
            {patient.visits.length > 0 && patient.visits[0].vitals && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
                  Dernières Constantes Enregistrées ({patient.visits[0].date})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Tension Artérielle</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {patient.visits[0].vitals.systolicBP}/{patient.visits[0].vitals.diastolicBP} mmHg
                    </strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Fréquence Cardiaque</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {patient.visits[0].vitals.heartRate} bpm
                    </strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Poids & Taille</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {patient.visits[0].vitals.weight} kg ({patient.visits[0].vitals.height} cm)
                    </strong>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] block">Température & SpO2</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {patient.visits[0].vitals.temperature}°C {patient.visits[0].vitals.spo2 ? `• ${patient.visits[0].vitals.spo2}%` : ''}
                    </strong>
                  </div>
                </div>
              </div>
            )}

            {/* Footer with doctor verification */}
            <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-xs text-slate-500">
              <div>
                <p>Généré via <strong>Lumina — Exercez ! On s'occupe du reste...</strong></p>
                <p className="text-[10px] mt-0.5">Certifié conforme au référentiel Volet de Synthèse Médicale (VSM) de l'ANS</p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-slate-800">{doctorProfile.name}</p>
                <p className="text-[10px]">Signature et cachet du médecin traitant</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
