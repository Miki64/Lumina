import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Share2, 
  FileText, 
  AlertTriangle, 
  Phone, 
  Mail, 
  Calendar, 
  Play, 
  CheckCircle2,
  Filter,
  UserPlus
} from 'lucide-react';
import { Patient } from '../../types/medical';

interface PatientRecordsViewProps {
  patients: Patient[];
  onOpenPatientDetail: (patient: Patient) => void;
  onOpenSynthesizedProfile: (patient: Patient) => void;
  onStartConsultation: (patient: Patient) => void;
  onAddPatient: (patient: Patient) => void;
}

export const PatientRecordsView: React.FC<PatientRecordsViewProps> = ({
  patients,
  onOpenPatientDetail,
  onOpenSynthesizedProfile,
  onStartConsultation,
  onAddPatient
}) => {
  const [search, setSearch] = useState('');
  const [filterAllergiesOnly, setFilterAllergiesOnly] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New patient state
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newGender, setNewGender] = useState<'M' | 'F'>('M');
  const [newBirthDate, setNewBirthDate] = useState('1990-01-01');
  const [newSsn, setNewSsn] = useState('');
  const [newPhone, setNewPhone] = useState('06 ');
  const [newEmail, setNewEmail] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newCity, setNewCity] = useState('Paris');
  const [newPostalCode, setNewPostalCode] = useState('75017');
  const [newAllergies, setNewAllergies] = useState('');
  const [newMedicalHistory, setNewMedicalHistory] = useState('');
  const [newSurgicalHistory, setNewSurgicalHistory] = useState('');

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      p.lastName.toLowerCase().includes(q) ||
      p.firstName.toLowerCase().includes(q) ||
      p.ssn.includes(q) ||
      p.phone.includes(q);

    if (filterAllergiesOnly && p.allergies.length === 0) return false;
    return matchesSearch;
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Patient = {
      id: `pat-${Date.now()}`,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      gender: newGender,
      birthDate: newBirthDate,
      ssn: newSsn.trim() || '1 90 01 75 000 000 00',
      phone: newPhone.trim(),
      email: newEmail.trim(),
      address: newAddress.trim() || 'Adresse non renseignée',
      city: newCity.trim(),
      postalCode: newPostalCode.trim(),
      attendingPhysician: 'Dr Alexandre Martin',
      allergies: newAllergies ? newAllergies.split(',').map((s) => s.trim()).filter(Boolean) : [],
      medicalHistory: newMedicalHistory ? newMedicalHistory.split(',').map((s) => s.trim()).filter(Boolean) : [],
      surgicalHistory: newSurgicalHistory ? newSurgicalHistory.split(',').map((s) => s.trim()).filter(Boolean) : [],
      familyHistory: [],
      ongoingTreatments: [],
      visits: [],
      prescriptions: [],
      bloodTests: [],
      letters: []
    };

    onAddPatient(created);
    setIsAddModalOpen(false);
    // Reset form
    setNewFirstName('');
    setNewLastName('');
    setNewSsn('');
    setNewAllergies('');
    setNewMedicalHistory('');
    setNewSurgicalHistory('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1A73E8]" />
            Dossiers Médicaux des Patients
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Base active : {patients.length} patient(s) répertorié(s) au cabinet
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau patient</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, prénom, numéro de sécurité sociale..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/20 outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterAllergiesOnly(!filterAllergiesOnly)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              filterAllergiesOnly
                ? 'bg-red-50 text-red-700 border-red-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Allergies signalées</span>
          </button>
        </div>
      </div>

      {/* Patient Table */}
      {patients.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-2xs text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#1A73E8] flex items-center justify-center mx-auto">
            <UserPlus className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Aucun dossier patient dans Lumina</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Votre base de données est actuellement vide. Créez votre premier dossier patient pour commencer à gérer vos consultations, ordonnances et antécédents.
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-2xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Créer mon premier patient</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Result count */}
          <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {filtered.length} patient{filtered.length !== 1 ? 's' : ''} affiché{filtered.length !== 1 ? 's' : ''}
              {search && <span className="ml-1">pour « {search} »</span>}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                    Patient
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                    N° Sécurité Sociale
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                    Téléphone
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                    Email
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                    Dernière consultation
                  </th>
                  <th className="text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                    Alertes
                  </th>
                  <th className="text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-5 py-3 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((patient) => {
                  const hasAllergies = patient.allergies.length > 0;
                  const lastVisit = patient.visits && patient.visits.length > 0
                    ? patient.visits.slice().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
                    : null;

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* Identité */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#1A73E8] font-bold text-xs flex items-center justify-center shrink-0">
                            {patient.firstName[0]}{patient.lastName[0]}
                          </div>
                          <div>
                            <button
                              onClick={() => onOpenPatientDetail(patient)}
                              className="font-semibold text-slate-900 text-xs hover:text-[#1A73E8] transition-colors cursor-pointer text-left"
                            >
                              {patient.lastName} {patient.firstName}
                            </button>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {patient.gender === 'M' ? 'H' : 'F'} · Né(e) le {patient.birthDate}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* NSS */}
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          {patient.ssn || <span className="text-slate-400 italic">Non renseigné</span>}
                        </span>
                      </td>

                      {/* Téléphone */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{patient.phone || <span className="text-slate-400 italic">—</span>}</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-4 py-3.5 max-w-[200px]">
                        <div className="flex items-center gap-1.5 text-xs text-slate-700">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {patient.email
                            ? <span className="truncate">{patient.email}</span>
                            : <span className="text-slate-400 italic">Non renseigné</span>
                          }
                        </div>
                      </td>

                      {/* Dernière consultation */}
                      <td className="px-4 py-3.5">
                        {lastVisit ? (
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <div>
                              <span className="text-xs font-medium text-slate-700">
                                {new Date(lastVisit.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                              {lastVisit.reason && (
                                <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{lastVisit.reason}</p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Jamais consulté(e)
                          </span>
                        )}
                      </td>

                      {/* Alertes */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-1">
                          {hasAllergies && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 rounded-md whitespace-nowrap">
                              <AlertTriangle className="w-3 h-3" />
                              {patient.allergies.length} allergie{patient.allergies.length > 1 ? 's' : ''}
                            </span>
                          )}
                          {patient.visits.length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md whitespace-nowrap">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              {patient.visits.length} visite{patient.visits.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenPatientDetail(patient)}
                            className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                          >
                            Dossier
                          </button>
                          <button
                            onClick={() => onOpenSynthesizedProfile(patient)}
                            className="px-2.5 py-1.5 text-[11px] font-semibold text-[#1A73E8] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Volet de Synthèse Médicale"
                          >
                            <Share2 className="w-3 h-3" />
                            <span>VSM</span>
                          </button>
                          <button
                            onClick={() => onStartConsultation(patient)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-lg shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Play className="w-3 h-3" />
                            <span>Consulter</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: NOUVEAU PATIENT ENRICHI AVEC ANTECEDENTS CHIRURGICAUX */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                Création d'un dossier patient
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="DUPONT"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl uppercase outline-hidden focus:border-[#1A73E8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Marc"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl capitalize outline-hidden focus:border-[#1A73E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sexe</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as 'M' | 'F')}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden"
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date de naissance *</label>
                  <input
                    type="date"
                    required
                    value={newBirthDate}
                    onChange={(e) => setNewBirthDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">N° Sécurité Sociale (NIR)</label>
                <input
                  type="text"
                  value={newSsn}
                  onChange={(e) => setNewSsn(e.target.value)}
                  placeholder="1 90 01 75 123 456 78"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono outline-hidden focus:border-[#1A73E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="patient@email.fr"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Allergies (séparées par une virgule)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Pénicilline, AINS, Pollens"
                  value={newAllergies}
                  onChange={(e) => setNewAllergies(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-red-200 rounded-xl outline-hidden focus:border-red-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Antécédents médicaux (séparés par une virgule)
                </label>
                <input
                  type="text"
                  placeholder="Ex : HTA, Diabète type 2, Asthme"
                  value={newMedicalHistory}
                  onChange={(e) => setNewMedicalHistory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1A73E8]"
                />
              </div>

              {/* Champ d'antécédents chirurgicaux demandé par l'utilisateur */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Antécédents chirurgicaux (séparés par une virgule)
                </label>
                <input
                  type="text"
                  placeholder="Ex : Appendicectomie (1995), Méniscectomie genou droit, Prothèse de hanche"
                  value={newSurgicalHistory}
                  onChange={(e) => setNewSurgicalHistory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-indigo-200 rounded-xl outline-hidden focus:border-indigo-400"
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
                  Créer le dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
