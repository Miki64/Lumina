import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Droplets,
  Users,
  Save,
  AlertCircle
} from 'lucide-react';
import { Patient } from '../../types/medical';

interface PatientEditModalProps {
  patient: Patient;
  onSave: (updated: Patient) => void;
  onClose: () => void;
}

type FormErrors = Partial<Record<keyof Patient | 'trustedPerson_name' | 'trustedPerson_phone' | 'trustedPerson_relation', string>>;

export const PatientEditModal: React.FC<PatientEditModalProps> = ({
  patient,
  onSave,
  onClose
}) => {
  const [form, setForm] = useState({
    firstName: patient.firstName,
    lastName: patient.lastName,
    gender: patient.gender as 'M' | 'F',
    birthDate: patient.birthDate,
    ssn: patient.ssn,
    phone: patient.phone,
    email: patient.email,
    address: patient.address,
    city: patient.city,
    postalCode: patient.postalCode,
    bloodGroup: patient.bloodGroup || '',
    attendingPhysician: patient.attendingPhysician,
    notes: patient.notes || '',
    trustedPerson_name: patient.trustedPerson?.name || '',
    trustedPerson_relation: patient.trustedPerson?.relation || '',
    trustedPerson_phone: patient.trustedPerson?.phone || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const setField = (key: string, value: string) => {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'Le prénom est obligatoire';
    if (!form.lastName.trim()) newErrors.lastName = 'Le nom est obligatoire';
    if (!form.birthDate) newErrors.birthDate = 'La date de naissance est obligatoire';
    if (!form.phone.trim()) newErrors.phone = 'Le téléphone est obligatoire';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Email invalide';
    }
    if (form.ssn && form.ssn.replace(/\s/g, '').length !== 15) {
      newErrors.ssn = 'Le NIR doit comporter 15 chiffres';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const updated: Patient = {
      ...patient,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim().toUpperCase(),
      gender: form.gender,
      birthDate: form.birthDate,
      ssn: form.ssn.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      bloodGroup: form.bloodGroup || undefined,
      attendingPhysician: form.attendingPhysician.trim(),
      notes: form.notes.trim() || undefined,
      trustedPerson: form.trustedPerson_name.trim()
        ? {
            name: form.trustedPerson_name.trim(),
            relation: form.trustedPerson_relation.trim(),
            phone: form.trustedPerson_phone.trim(),
          }
        : undefined,
    };

    onSave(updated);
    onClose();
  };

  const inputCls = (field: string) =>
    `w-full px-3 py-2.5 text-sm rounded-xl border transition-all outline-none focus:ring-2 focus:ring-[#1A73E8]/30 focus:border-[#1A73E8] ${
      errors[field as keyof FormErrors]
        ? 'border-red-400 bg-red-50'
        : 'border-slate-200 bg-white hover:border-slate-300'
    }`;

  const labelCls = 'block text-xs font-semibold text-slate-600 mb-1.5';

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[94vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
              <User className="w-4.5 h-4.5 text-[#1A73E8]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Modifier la fiche patient</h2>
              <p className="text-xs text-slate-500">
                {patient.lastName} {patient.firstName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="p-5 sm:p-6 space-y-6">

            {/* Section : Identité */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <User className="w-3.5 h-3.5" /> Identité
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nom */}
                <div>
                  <label className={labelCls}>Nom de famille *</label>
                  <input
                    type="text"
                    className={inputCls('lastName')}
                    value={form.lastName}
                    onChange={e => setField('lastName', e.target.value)}
                    placeholder="DUPONT"
                  />
                  {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                </div>

                {/* Prénom */}
                <div>
                  <label className={labelCls}>Prénom *</label>
                  <input
                    type="text"
                    className={inputCls('firstName')}
                    value={form.firstName}
                    onChange={e => setField('firstName', e.target.value)}
                    placeholder="Jean"
                  />
                  {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                </div>

                {/* Sexe */}
                <div>
                  <label className={labelCls}>Sexe *</label>
                  <div className="flex gap-2">
                    {(['M', 'F'] as const).map(g => (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setField('gender', g)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${
                          form.gender === g
                            ? 'bg-[#1A73E8] text-white border-[#1A73E8] shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {g === 'M' ? '♂ Homme' : '♀ Femme'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date de naissance */}
                <div>
                  <label className={labelCls}>Date de naissance *</label>
                  <input
                    type="date"
                    className={inputCls('birthDate')}
                    value={form.birthDate}
                    onChange={e => setField('birthDate', e.target.value)}
                  />
                  {errors.birthDate && <p className="mt-1 text-xs text-red-500">{errors.birthDate}</p>}
                </div>

                {/* NIR */}
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><CreditCard className="w-3 h-3" /> NIR (N° Sécu)</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls('ssn')}
                    value={form.ssn}
                    onChange={e => setField('ssn', e.target.value)}
                    placeholder="1 85 06 75 116 042 68"
                    maxLength={20}
                  />
                  {errors.ssn && <p className="mt-1 text-xs text-red-500">{errors.ssn}</p>}
                </div>

                {/* Groupe sanguin */}
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Droplets className="w-3 h-3" /> Groupe sanguin</span>
                  </label>
                  <select
                    className={inputCls('bloodGroup')}
                    value={form.bloodGroup}
                    onChange={e => setField('bloodGroup', e.target.value)}
                  >
                    <option value="">Non renseigné</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* Section : Coordonnées */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <Phone className="w-3.5 h-3.5" /> Coordonnées
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Téléphone */}
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> Téléphone *</span>
                  </label>
                  <input
                    type="tel"
                    className={inputCls('phone')}
                    value={form.phone}
                    onChange={e => setField('phone', e.target.value)}
                    placeholder="06 12 34 56 78"
                  />
                  {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> Email</span>
                  </label>
                  <input
                    type="email"
                    className={inputCls('email')}
                    value={form.email}
                    onChange={e => setField('email', e.target.value)}
                    placeholder="patient@exemple.fr"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Adresse */}
                <div className="sm:col-span-2">
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Adresse</span>
                  </label>
                  <input
                    type="text"
                    className={inputCls('address')}
                    value={form.address}
                    onChange={e => setField('address', e.target.value)}
                    placeholder="12 rue de la Paix"
                  />
                </div>

                {/* Code postal */}
                <div>
                  <label className={labelCls}>Code postal</label>
                  <input
                    type="text"
                    className={inputCls('postalCode')}
                    value={form.postalCode}
                    onChange={e => setField('postalCode', e.target.value)}
                    placeholder="75001"
                    maxLength={5}
                  />
                </div>

                {/* Ville */}
                <div>
                  <label className={labelCls}>Ville</label>
                  <input
                    type="text"
                    className={inputCls('city')}
                    value={form.city}
                    onChange={e => setField('city', e.target.value)}
                    placeholder="Paris"
                  />
                </div>
              </div>
            </section>

            {/* Section : Personne de confiance */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <Users className="w-3.5 h-3.5" /> Personne de confiance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Nom complet</label>
                  <input
                    type="text"
                    className={inputCls('trustedPerson_name')}
                    value={form.trustedPerson_name}
                    onChange={e => setField('trustedPerson_name', e.target.value)}
                    placeholder="Marie Dupont"
                  />
                </div>
                <div>
                  <label className={labelCls}>Lien de parenté</label>
                  <input
                    type="text"
                    className={inputCls('trustedPerson_relation')}
                    value={form.trustedPerson_relation}
                    onChange={e => setField('trustedPerson_relation', e.target.value)}
                    placeholder="Épouse, fils, ami…"
                  />
                </div>
                <div>
                  <label className={labelCls}>Téléphone</label>
                  <input
                    type="tel"
                    className={inputCls('trustedPerson_phone')}
                    value={form.trustedPerson_phone}
                    onChange={e => setField('trustedPerson_phone', e.target.value)}
                    placeholder="06 98 76 54 32"
                  />
                </div>
              </div>
            </section>

            {/* Section : Médecin traitant & Notes */}
            <section>
              <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                <AlertCircle className="w-3.5 h-3.5" /> Informations complémentaires
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelCls}>Médecin traitant déclaré</label>
                  <input
                    type="text"
                    className={inputCls('attendingPhysician')}
                    value={form.attendingPhysician}
                    onChange={e => setField('attendingPhysician', e.target.value)}
                    placeholder="Dr Martin"
                  />
                </div>
                <div>
                  <label className={labelCls}>Notes libres</label>
                  <textarea
                    rows={3}
                    className={`${inputCls('notes')} resize-none`}
                    value={form.notes}
                    onChange={e => setField('notes', e.target.value)}
                    placeholder="Observations particulières, contexte social…"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 px-5 py-4 flex flex-col-reverse sm:flex-row gap-3 justify-end rounded-b-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#1A73E8] hover:bg-[#1557B0] rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
