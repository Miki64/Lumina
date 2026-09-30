import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Send, 
  HeartPulse, 
  Thermometer, 
  Activity, 
  Scale, 
  Ruler, 
  FileText, 
  Check, 
  Copy, 
  ArrowRight, 
  AlertTriangle,
  Volume2,
  Printer,
  Share2,
  Stethoscope,
  Pill
} from 'lucide-react';
import { Patient, Vitals, PatientVisit, ReferralLetterDocument, DoctorSettings } from '../../types/medical';

interface ConsultationViewProps {
  currentPatient: Patient | null;
  patients: Patient[];
  doctorProfile: DoctorSettings;
  onSelectPatient: (patient: Patient) => void;
  onSaveVisit: (patientId: string, visit: PatientVisit) => void;
  onSaveReferralLetter?: (patientId: string, letter: ReferralLetterDocument) => void;
  onNavigateToPrescription: (patient: Patient) => void;
}

export const ConsultationView: React.FC<ConsultationViewProps> = ({
  currentPatient,
  patients,
  doctorProfile,
  onSelectPatient,
  onSaveVisit,
  onSaveReferralLetter,
  onNavigateToPrescription
}) => {
  // Active patient fallback
  const activePatient = currentPatient || (patients.length > 0 ? patients[0] : null);

  // Vitals State
  const [systolicBP, setSystolicBP] = useState<number>(125);
  const [diastolicBP, setDiastolicBP] = useState<number>(78);
  const [heartRate, setHeartRate] = useState<number>(72);
  const [temperature, setTemperature] = useState<number>(37.2);
  const [weight, setWeight] = useState<number>(68);
  const [height, setHeight] = useState<number>(172);
  const [spo2, setSpo2] = useState<number>(99);
  const [bloodGlucose, setBloodGlucose] = useState<string>('0.95');

  // Consultation Text & Dictation State
  const [reason, setReason] = useState<string>('Fièvre persistante, céphalées et odynophagie depuis 48 heures');
  const [dictationText, setDictationText] = useState<string>(
    "Patient(e) consultant pour syndrome fébrile aigu à 38.5°C avec odynophagie majeure et toux sèche. Absence de dyspnée. À l'examen de l'oropharynx : amygdales hypertrophiées, érythémateuses sans exsudat pultacé franc. Adénopathies sous-angulomaxillaires bilatérales sensibles. Auscultation cardio-pulmonaire normale, murmure vésiculaire bien perçu bilatéralement, sans râle crépitant."
  );
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const recognitionRef = useRef<any>(null);
  // Ref qui accumule uniquement les résultats FINALS confirmés par l'API
  const finalDictationRef = useRef<string>('');

  // AI Generated Sections
  const [soapNotes, setSoapNotes] = useState<{
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  }>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });

  const [referralLetter, setReferralLetter] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState<boolean>(false);
  const [copiedLetter, setCopiedLetter] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Calculate BMI (IMC)
  const bmi = height > 0 ? (weight / Math.pow(height / 100, 2)).toFixed(1) : '22.0';
  const bmiNumber = parseFloat(bmi);
  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { label: 'Insuffisance pondérale', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (val < 25) return { label: 'Poids normal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val < 30) return { label: 'Surpoids', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Obésité', color: 'text-red-700 bg-red-50 border-red-200' };
  };
  const bmiStatus = getBmiStatus(bmiNumber);

  // Blood Pressure interpretation
  const getBpStatus = (sys: number, dia: number) => {
    if (sys >= 160 || dia >= 100) return { label: 'HTA Stade 2', color: 'text-red-700 bg-red-50 border-red-200' };
    if (sys >= 140 || dia >= 90) return { label: 'HTA Stade 1', color: 'text-orange-700 bg-orange-50 border-orange-200' };
    if (sys >= 130 || dia >= 85) return { label: 'Pression normale haute', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Pression normale', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
  };
  const bpStatus = getBpStatus(systolicBP, diastolicBP);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0].transcript;

          if (result.isFinal) {
            // Mot/phrase confirmé(e) définitivement par l'API
            finalDictationRef.current = finalDictationRef.current
              ? `${finalDictationRef.current} ${text.trim()}`
              : text.trim();
          } else {
            // Résultat temporaire, en cours de reconnaissance
            interimTranscript += text;
          }
        }

        // Texte affiché = finals confirmés + interim en cours (pas de doublons)
        setDictationText(() => {
          const finals = finalDictationRef.current;
          const interim = interimTranscript.trim();
          if (finals && interim) return `${finals} ${interim}`;
          if (finals) return finals;
          return interim;
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleDictation = () => {
    if (!speechSupported) {
      alert("Votre navigateur ne supporte pas l'API Web Speech. Veuillez utiliser Chrome, Edge ou Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Initialiser le ref finals avec le texte déjà présent dans la zone
      // (pour ne pas l'écraser lors de la prochaine session de dictée)
      finalDictationRef.current = dictationText;
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  const simulateSpeechInput = () => {
    const sample = "\nExamen complémentaire : pharynx congestif sans enduit diphtéroïde, pas de signe de détresse respiratoire. Tympans bilatéralement normaux, sans épanchement rétro-tympanique.";
    setDictationText((prev) => prev + sample);
  };

  // Generate 1-Click SOAP Notes via Intelligent Heuristic Engine
  const handleGenerateSoap = () => {
    setIsGeneratingAi(true);

    setTimeout(() => {
      const generatedSubjective = `${dictationText.trim() || 'Patient(e) vu en consultation pour motif aigu.'}
Absence de signes de gravité immédiats déclarés par le patient.`;

      const generatedObjective = `Constantes du jour : TA ${systolicBP}/${diastolicBP} mmHg (${bpStatus.label}), FC ${heartRate} bpm, T° ${temperature}°C, SpO2 ${spo2}%, Poids ${weight} kg, Taille ${height} cm, IMC ${bmi} kg/m² (${bmiStatus.label}), Glycémie ${bloodGlucose} g/L.
Examen clinique ciblé : examen de l'oropharynx et auscultation cardio-pulmonaire concordants avec les données d'anamnèse.`;

      let generatedAssessment = 'Syndrome infectieux aigu des voies aériennes supérieures (pharyngite/angine).';
      if (reason.toLowerCase().includes('hta') || systolicBP >= 140) {
        generatedAssessment = 'Surveillance et évaluation du profil tensionnel.';
      } else if (reason.toLowerCase().includes('diab')) {
        generatedAssessment = 'Suivi d\'équilibre glycémique et métabolique.';
      }

      const generatedPlan = `1. Traitement symptomatique et antipyrétique adapté au terrain (respect des contre-indications).
2. Prescription médicamenteuse ou bilan complémentaire si persistance à J3.
3. Consignes de surveillance : reconsulter en urgence si apparition d'une dyspnée ou intolérance alimentaire.`;

      setSoapNotes({
        subjective: generatedSubjective,
        objective: generatedObjective,
        assessment: generatedAssessment,
        plan: generatedPlan
      });

      setIsGeneratingAi(false);
    }, 900);
  };

  // Generate Referral Letter for Specialist
  const handleGenerateReferralLetter = () => {
    if (!activePatient) return;
    setIsGeneratingLetter(true);

    setTimeout(() => {
      const todayFormatted = new Date().toLocaleDateString('fr-FR');

      const letter = `${doctorProfile.name}
${doctorProfile.title} - N° RPPS : ${doctorProfile.rpps}
${doctorProfile.cabinetName} - ${doctorProfile.address}, ${doctorProfile.postalCode} ${doctorProfile.city}
Tél : ${doctorProfile.phone}

${doctorProfile.city}, le ${todayFormatted}

À l'attention de notre cher(e) Confrère Spécialiste,

Objet : Consultation d'adressage pour ${activePatient.lastName.toUpperCase()} ${activePatient.firstName}
Né(e) le ${activePatient.birthDate} - N° Sécurité Sociale : ${activePatient.ssn}

Cher(e) Confrère,

Je vous adresse ce jour M./Mme ${activePatient.lastName} ${activePatient.firstName} que je suis en qualité de médecin traitant, pour avis spécialisé et prise en charge complémentaire.

MOTIF D'ADRESSAGE :
${reason}

ANTÉCÉDENTS ET TERRAIN :
- Antécédents médicaux : ${activePatient.medicalHistory.join(', ') || 'Néant'}
- Antécédents chirurgicaux : ${activePatient.surgicalHistory.join(', ') || 'Néant'}
- Allergies signalées : ${activePatient.allergies.length > 0 ? activePatient.allergies.join(', ') : 'Aucune allergie connue'}
- Traitement habituel en cours : ${activePatient.ongoingTreatments.join(', ') || 'Aucun'}

EXAMEN CLINIQUE DU JOUR (${todayFormatted}) :
- Constantes : TA ${systolicBP}/${diastolicBP} mmHg | Pouls ${heartRate} bpm | T° ${temperature}°C | IMC ${bmi} kg/m² (Poids : ${weight} kg, Taille : ${height} cm).
- Données d'anamnèse : ${dictationText}

QUESTIONS POSÉES :
1. Confirmez-vous l'orientation diagnostique ?
2. Préconisez-vous des explorations complémentaires d'imagerie ou de biologie ?
3. Quelle adaptation thérapeutique de seconde ligne préconisez-vous ?

En vous remerciant très vivement de votre collaboration confraternelle, je vous prie d'agréer, cher(e) Confrère, l'expression de mes salutations les plus dévouées.

${doctorProfile.name}
Signé électroniquement`;

      setReferralLetter(letter);
      setIsGeneratingLetter(false);

      // Si le callback de sauvegarde est fourni, associer également le courrier au patient !
      if (onSaveReferralLetter) {
        onSaveReferralLetter(activePatient.id, {
          id: `let-${Date.now()}`,
          patientId: activePatient.id,
          date: todayFormatted,
          doctorName: doctorProfile.name,
          specialistTitle: 'Courrier d\'adressage Confrère',
          content: letter
        });
      }
    }, 1100);
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(referralLetter);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2500);
  };

  const handleSaveVisitRecord = () => {
    if (!activePatient) return;

    const newVisit: PatientVisit = {
      id: `vis-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      reason: reason,
      diagnosis: soapNotes.assessment || 'Consultation générale et prise de constantes',
      vitals: {
        systolicBP,
        diastolicBP,
        heartRate,
        temperature,
        weight,
        height,
        spo2,
        bloodGlucose: parseFloat(bloodGlucose) || 0.95,
        measuredAt: new Date().toISOString()
      },
      soapNotes: soapNotes.subjective ? soapNotes : {
        subjective: dictationText,
        objective: `TA ${systolicBP}/${diastolicBP}, FC ${heartRate}, T° ${temperature}`,
        assessment: reason,
        plan: 'Traitement ambulatoire standard'
      },
      referralLetter: referralLetter || undefined,
      doctorName: doctorProfile.name
    };

    onSaveVisit(activePatient.id, newVisit);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (!activePatient) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-700">Aucun patient sélectionné</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Pour débuter une consultation, veuillez d'abord créer ou sélectionner un patient dans l'onglet "Dossiers Patients".
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patient Selector & Active Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#1A73E8] flex items-center justify-center font-extrabold text-lg shadow-2xs">
            {activePatient.firstName[0]}{activePatient.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                Consultation en cours : {activePatient.lastName} {activePatient.firstName}
              </h1>
              <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Dossier actif
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
              <span>{activePatient.gender === 'M' ? 'Homme' : 'Femme'} • Né(e) le {activePatient.birthDate}</span>
              <span>•</span>
              <span className="font-mono">NIR : {activePatient.ssn}</span>
              <span>•</span>
              <span>Praticien : <strong>{doctorProfile.name}</strong></span>
            </div>
          </div>
        </div>

        {/* Patient Switcher Dropdown */}
        {patients.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Changer de patient :</span>
            <select
              value={activePatient.id}
              onChange={(e) => {
                const found = patients.find((p) => p.id === e.target.value);
                if (found) onSelectPatient(found);
              }}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 outline-hidden focus:border-[#1A73E8]"
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

      {/* Allergies Warning if any */}
      {activePatient.allergies.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800 font-semibold">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>⚠️ Allergies majeures du patient : {activePatient.allergies.join(', ')}</span>
        </div>
      )}

      {/* SECTION 1: VITALS (CONSTANTES VITALES AVEC INTERPRÉTATION AUTO) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#1A73E8]" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Constantes Vitales & Interprétation Clinique
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Horodatage : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Systolic & Diastolic BP */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Tension (mmHg)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={systolicBP}
                onChange={(e) => setSystolicBP(Number(e.target.value))}
                className="w-12 p-1 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg text-sm"
              />
              <span className="text-slate-400 font-bold">/</span>
              <input
                type="number"
                value={diastolicBP}
                onChange={(e) => setDiastolicBP(Number(e.target.value))}
                className="w-12 p-1 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block mt-1 ${bpStatus.color}`}>
              {bpStatus.label}
            </span>
          </div>

          {/* Heart Rate */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Pouls (bpm)</span>
            <input
              type="number"
              value={heartRate}
              onChange={(e) => setHeartRate(Number(e.target.value))}
              className="w-full p-1 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg text-sm"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              {heartRate > 100 ? '⚡ Tachycardie' : heartRate < 55 ? '🐢 Bradycardie' : '✓ Normocarde'}
            </span>
          </div>

          {/* Temperature */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Température (°C)</span>
            <input
              type="number"
              step="0.1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full p-1 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg text-sm"
            />
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block mt-1 ${
              temperature >= 38 ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              {temperature >= 38 ? '🔥 Fébrile' : '✓ Apyrétique'}
            </span>
          </div>

          {/* Weight & Height -> BMI */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Poids (kg) & Taille (cm)</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-12 p-1 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg text-sm"
              />
              <span className="text-slate-400">/</span>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-12 p-1 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <span className="text-[10px] text-slate-500 block mt-1">
              Poids actuel
            </span>
          </div>

          {/* Computed BMI (IMC) */}
          <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200 space-y-1">
            <span className="text-[11px] font-bold text-[#1A73E8] block">IMC Calculé</span>
            <div className="text-lg font-extrabold text-[#1A73E8]">
              {bmi} <span className="text-xs font-normal">kg/m²</span>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block mt-1 ${bmiStatus.color}`}>
              {bmiStatus.label}
            </span>
          </div>

          {/* SpO2 */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Saturation SpO2</span>
            <input
              type="number"
              value={spo2}
              onChange={(e) => setSpo2(Number(e.target.value))}
              className="w-full p-1 text-center font-bold text-slate-800 bg-white border border-slate-200 rounded-lg text-sm"
            />
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border inline-block mt-1 ${
              spo2 < 95 ? 'text-red-700 bg-red-50 border-red-200' : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              {spo2 < 95 ? '⚠️ Hypoxie' : '✓ Normosaturation'}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: MOTIF & DICTÉE VOCALE */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
            Motif de Consultation
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium outline-hidden focus:bg-white focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <span>Anamnèse Clinique & Dictée Vocale (Web Speech API)</span>
              {isListening && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Microphone actif (fr-FR)...
                </span>
              )}
            </label>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={simulateSpeechInput}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
              >
                Simuler dictée
              </button>

              <button
                type="button"
                onClick={toggleDictation}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer ${
                  isListening
                    ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                    : 'bg-[#1A73E8] text-white hover:bg-[#1557B0]'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isListening ? 'Arrêter dictée' : 'Démarrer dictée'}</span>
              </button>
            </div>
          </div>

          <textarea
            rows={4}
            value={dictationText}
            onChange={(e) => setDictationText(e.target.value)}
            placeholder="Dictez ou saisissez librement les symptômes, signes physiques, auscultation et observations..."
            className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 transition-all leading-relaxed"
          />
        </div>

        {/* Action Trigger Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateSoap}
              disabled={isGeneratingAi}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGeneratingAi ? 'Synthèse en cours...' : '1-Clic : Synthèse SOAP'}</span>
            </button>

            <button
              onClick={handleGenerateReferralLetter}
              disabled={isGeneratingLetter}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#1A73E8]" />
              <span>{isGeneratingLetter ? 'Génération lettre...' : '1-Clic : Courrier Confrère'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToPrescription(activePatient)}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Rédiger ordonnance</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>

            <button
              onClick={handleSaveVisitRecord}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-2xs transition-all cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 hover:bg-black text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Dossier enregistré ✓</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Enregistrer la consultation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: SOAP OUTPUT (GENERATED) */}
      {(soapNotes.subjective || isGeneratingAi) && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Synthèse Structurée SOAP (Prêt pour le Dossier Médical)
            </h3>
            <span className="text-[11px] text-slate-400">Modifiable par le praticien</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-[#1A73E8] uppercase tracking-wider text-[11px]">
                [S] Subjectif (Anamnèse & Plaintes)
              </span>
              <textarea
                rows={3}
                value={soapNotes.subjective}
                onChange={(e) => setSoapNotes({ ...soapNotes, subjective: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-[#1A73E8]"
              />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-[#1A73E8] uppercase tracking-wider text-[11px]">
                [O] Objectif (Examen & Constantes)
              </span>
              <textarea
                rows={3}
                value={soapNotes.objective}
                onChange={(e) => setSoapNotes({ ...soapNotes, objective: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-[#1A73E8]"
              />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-[#1A73E8] uppercase tracking-wider text-[11px]">
                [A] Évaluation / Diagnostic
              </span>
              <textarea
                rows={2}
                value={soapNotes.assessment}
                onChange={(e) => setSoapNotes({ ...soapNotes, assessment: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-[#1A73E8]"
              />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-[#1A73E8] uppercase tracking-wider text-[11px]">
                [P] Plan Thérapeutique & Conduite
              </span>
              <textarea
                rows={2}
                value={soapNotes.plan}
                onChange={(e) => setSoapNotes({ ...soapNotes, plan: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs outline-hidden focus:border-[#1A73E8]"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: REFERRAL LETTER FOR SPECIALIST */}
      {referralLetter && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#1A73E8]" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Courrier d'Adressage Confrère (Généré Automatiquement)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLetter}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                {copiedLetter ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le courrier</span>
                  </>
                )}
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs whitespace-pre-line text-slate-800 leading-relaxed max-h-80 overflow-y-auto">
            {referralLetter}
          </div>
        </div>
      )}
    </div>
  );
};
