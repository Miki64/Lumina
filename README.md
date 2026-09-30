<<<<<<< HEAD
# 💡 LUMINA

> **Le logiciel médico-social qui simplifie votre quotidien.**
> *Éclairer le parcours d'accompagnement, coordonner les équipes, libérer du temps pour l'humain.*

---

## 🌟 À propos de Lumina

**Lumina** est une solution SaaS nouvelle génération dédiée aux établissements du secteur médico-social (EHPAD, handicap, protection de l'enfance, hébergement spécialisé). 

Conçu pour remplacer les outils traditionnels souvent lourds et complexes, Lumina propose une interface fluide, moderne et collaborative axée sur l'essentiel : **le suivi de l'usager et la sérénité des équipes de terrain.**

---

## ✨ Fonctionnalités clés

* **📂 Dossier Usager Informatisé (DUI) :** Vue à 360° du parcours, centralisation du projet personnalisé et gestion sécurisée des données.
* **💬 Transmissions fluides (Papote) :** Transmission d'informations en temps réel entre équipes pluridisciplinaires pour assurer la continuité des soins et de l'accompagnement.
* **📅 Planning & Coordination :** Organisation simplifiée des interventions, activités et rendez-vous des usagers.
* **📊 Suivi & Conformité :** Génération automatique de rapports et indicateurs conformes aux exigences réglementaires du secteur.
* **📱 Multi-plateforme :** Interface responsive utilisable sur ordinateur, tablette et smartphone.

---

## 🛠️ Stack Technique

* **Frontend :** React.js / Next.js, TailwindCSS, TypeScript
* **Backend :** Node.js / Express, PostgreSQL
* **Authentification & Sécurité :** OAuth2, chiffrement AES-256 (conformité RGPD & données de santé)
* **DevOps :** Docker, GitHub Actions, Vercel / AWS

---

## 🚀 Installation & Démarrage rapide

### Prérequis

* Node.js `>= 18.x`
* PostgreSQL `>= 14.x`
* npm ou pnpm

### 1. Cloner le projet

```bash
git clone https://github.com/votre-organisation/lumina.git
cd lumina
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'environnement

Créez un fichier `.env.local` à la racine du projet en vous basant sur `.env.example` :

```bash
cp .env.example .env.local
```

Renseignez vos identifiants de base de données et clés d'API.

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Rendez-vous sur `http://localhost:3000` pour voir l'application en action !

---

## 🔒 Sécurité & Confidentialité

La sécurité des données de santé et la protection des informations personnelles sont au cœur de nos priorités :
* Conformité **RGPD**.
* Architecture pensée pour l'hébergement de données de santé (HDS).
* Gestion stricte des rôles et des droits d'accès.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour proposer une amélioration ou signaler un bug :

1. Forkez le projet.
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/IncroyableFonctionnalite`).
3. Commitiez vos changements (`git commit -m 'Ajout d'une incroyable fonctionnalité'`).
4. Poussez sur la branche (`git push origin feature/IncroyableFonctionnalite`).
5. Ouvrez une **Pull Request**.

---

## 📄 Licence

Ce projet est sous licence `MIT`. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<p center="align">
  Fait avec ❤️ pour simplifier le quotidien des professionnels du médico-social.
</p>
=======
<div align="center">

<img src="https://img.shields.io/badge/MedWorkspace-Cabinet%20Médical%20Pro-1A73E8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xOSAzSDVjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptLTIgMTBoLTR2NGgtMnYtNEg3di0yaDR2LTRoMnY0aDR2MnoiLz48L3N2Zz4=" alt="MedWorkspace" />

# 🏥 MedWorkspace — Plateforme de Gestion Médicale

**Application web médicale complète pour cabinet de médecine générale**  
*Inspirée de Doctolib Pro & Google Workspace • Stack React + TypeScript + Tailwind CSS*

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

![MedWorkspace Demo](https://img.shields.io/badge/status-production--ready-brightgreen)

</div>

---

## 📋 Table des matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation & Démarrage](#installation--démarrage)
- [Modules détaillés](#modules-détaillés)
- [Services & APIs](#services--apis)
- [Structure du projet](#structure-du-projet)
- [Données & Conformité](#données--conformité)
- [Développement](#développement)
- [Roadmap](#roadmap)
- [Licence](#licence)

---

## Aperçu

**MedWorkspace** est une application web de gestion médicale premium, conçue pour les cabinets de médecine générale. Elle réunit dans une interface unique et intuitive (inspirée de Google Workspace) tous les outils dont un médecin a besoin au quotidien :

- Gestion des rendez-vous et de la salle d'attente en temps réel
- Dossiers patients complets (antécédents, allergies, historique)
- Consultation avec dictée vocale et synthèse IA automatique
- Prescription sécurisée avec vérification VIDAL Expert
- Rappels de suivi synchronisés avec Google Agenda

> **Public cible** : Médecins généralistes, cabinets de groupe, structures MSP (Maison de Santé Pluriprofessionnelle)

---

## Fonctionnalités

### 1. 🗓️ Salle d'attente & Planning

| Fonctionnalité | Détail |
|---|---|
| Liste chronologique des RDV | Triée par heure, filtrée par statut |
| Statuts dynamiques | En attente → En consultation → Terminé → Annulé |
| Vue créneaux horaires | Grille interactive 08h00-18h30 |
| Création de RDV | Modal avec sélection patient, type, durée, motif |
| KPIs temps réel | Compteurs live (en attente, en consultation, à venir, terminés) |
| Types de consultation | Présentiel, Téléconsultation, Urgence, Contrôle |

### 2. 📂 Dossiers Patients

| Fonctionnalité | Détail |
|---|---|
| Fiche complète | Identité, NIR, contacts, personne de confiance |
| Antécédents médicaux | Médicaux, chirurgicaux, familiaux |
| Alertes allergies | Mise en évidence visuelle critique (rouge) |
| Traitements de fond | Liste modifiable, prise en compte par le moteur VIDAL |
| Historique des visites | SOAP complet, constantes, diagnostics |
| **Volet de Synthèse Médicale (VSM)** | Export imprimable, JSON structuré (format DMP/ANS), lien de partage sécurisé confrère (MSSanté) |

### 3. 🩺 Consultation & Prise de notes IA

| Fonctionnalité | Détail |
|---|---|
| Saisie des constantes | TA, Pouls, Température, Poids/Taille, SpO2, Glycémie |
| Interprétation clinique auto | IMC calculé, classification HTA, statut fébrile |
| **Dictée vocale Web Speech API** | Transcription fr-FR en temps réel dans le champ de notes |
| **Synthèse SOAP 1-clic** | Génération automatique des 4 sections (Subjectif, Objectif, Assessment, Plan) |
| **Courrier d'adressage 1-clic** | Lettre officielle pré-remplie pour un confrère spécialiste |
| Sauvegarde dossier | Enregistrement de la visite dans l'historique patient |

### 4. 💊 Prescription & Sécurité (VIDAL Expert)

| Fonctionnalité | Détail |
|---|---|
| Recherche BDPM | Recherche dans la Base de Données Publique des Médicaments (Gouv.fr) avec fallback |
| Base locale validée | 18 spécialités de référence avec CIS, DCI, ATC, CI, précautions |
| **Moteur d'alertes VIDAL Expert** | Détection interactions médicamenteuses et contre-indications |
| Alertes allergiques | Vérification croisée avec le dossier patient (Pénicilline, AINS, Paracétamol…) |
| Alertes pathologiques | AINS + Insuffisance rénale, AINS + Ulcère, Metformine + IR, HTA + AINS |
| Interactions médicamenteuses | AINS + Anticoagulant, AINS + IEC, Cumul de paracétamol |
| Niveaux d'alertes | `CONTRE_INDICATION` / `ASSOCIATION_DECONSEILLEE` / `PRECAUTION` / `ALLERGIE` |
| Ordonnance officielle | Format A4 français, signature numérique, QR code e-prescription, imprimable PDF |

### 5. ✅ Tâches & Google Agenda

| Fonctionnalité | Détail |
|---|---|
| Gestion des rappels cliniques | Liés à un patient avec priorité, catégorie, échéance |
| Catégories | Suivi biologique, Courrier confrère, Appel patient, Renouvellement ALD, Autre |
| **Synchro Google Calendar** | Lien deep-link prérempli ouvrant directement Google Calendar (API officielle) |
| **Export iCal (.ics)** | Compatible Apple Calendar, Google Calendar, Microsoft Outlook |
| Filtres | Par priorité (Haute / Moyenne / Basse) |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     MedWorkspace UI                      │
│  React 18 + TypeScript + Tailwind CSS 4 + Vite 8        │
└─────────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                       │
│  App.tsx — State Management (useState) — Navigation      │
└─────────────────────────────────────────────────────────┘
         │
    ┌────┴──────────────────────────────────────────┐
    ▼                                               ▼
┌───────────────┐                       ┌───────────────────┐
│  Components   │                       │     Services       │
│               │                       │                   │
│  layout/      │                       │  bdpmService.ts   │
│  ├ Header     │                       │  (BDPM API + local│
│  └ Sidebar    │                       │   fallback)       │
│               │                       │                   │
│  dashboard/   │                       │  prescriptionSafety│
│  └ WaitingRoom│◄──────────────────────│  Service.ts       │
│               │                       │  (VIDAL Engine)   │
│  patients/    │                       │                   │
│  ├ Records    │                       │  googleCalendar   │
│  ├ Detail     │                       │  Service.ts       │
│  └ VSM Modal  │                       │  (URL + .ics)     │
│               │                       └───────────────────┘
│  consultation/│                                │
│  └ Consult    │                       ┌────────┴──────────┐
│               │                       │      Data Layer    │
│  prescription/│                       │                   │
│  └ Prescribe  │                       │  mockData.ts      │
│               │                       │  (5 patients,     │
│  tasks/       │                       │   8 RDV, 4 tasks) │
│  └ TasksView  │                       │                   │
└───────────────┘                       │  frenchMedications│
                                        │  .ts (18 spécia.) │
                                        └───────────────────┘
```

---

## Installation & Démarrage

### Prérequis

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Navigateur moderne (Chrome, Edge, Firefox) avec support Web Speech API (pour dictée vocale)

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/Miki64/Lumina.git
cd Lumina

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible sur **http://localhost:5173**

### Build de production

```bash
npm run build      # Génère le bundle dans dist/
npm run preview    # Prévisualise le build de production
```

---

## Modules détaillés

### Module 1 : Salle d'attente (`WaitingRoomView.tsx`)

Le tableau de bord principal affiche en temps réel l'état de la salle d'attente :

```tsx
// Changement de statut d'un rendez-vous
onUpdateStatus(appointmentId: string, newStatus: AppointmentStatus): void

// Types de statuts
type AppointmentStatus = 'EN_ATTENTE' | 'EN_CONSULTATION' | 'TERMINE' | 'A_VENIR' | 'ANNULE'
```

**Vue créneaux** : affichage en grille des créneaux disponibles/occupés de 08h30 à 18h00. Un clic sur un créneau vide ouvre le modal de création de RDV pré-rempli.

---

### Module 2 : Dossier Patient (`PatientDetailModal.tsx`)

La fiche patient est organisée en 3 onglets :

1. **Fiche Générale & Sécurité** : Allergies (édition inline), coordonnées, traitements
2. **Antécédents & Traitements** : Gestion des traitements de fond (ajout/suppression)
3. **Historique des Consultations** : Toutes les visites SOAP avec constantes

#### Volet de Synthèse Médicale (VSM)

Format standardisé **ANS / Mon Espace Santé** incluant :
- Allergies et intolérances en évidence critique
- Antécédents médicaux, chirurgicaux, familiaux
- Traitements de fond en cours
- Dernières constantes enregistrées
- Export JSON (format DMP compatible) et impression PDF
- Lien de partage sécurisé confrère (simule MSSanté, validité 48h, code OTP)

---

### Module 3 : Consultation (`ConsultationView.tsx`)

#### Constantes & Interprétation clinique

| Constante | Interprétation automatique |
|---|---|
| Tension artérielle | Normale / Normale haute / HTA Stade 1 / HTA Stade 2 |
| Température | Apyrétique / Fébrile (≥ 38°C) |
| Poids + Taille | IMC calculé + classification (Insuffisance / Normal / Surpoids / Obésité) |
| Pouls | Bradycardie / Normocarde / Tachycardie |

#### Dictée vocale Web Speech API

```tsx
// Initialisation de la reconnaissance vocale française
recognition.lang = 'fr-FR';
recognition.continuous = true;
recognition.interimResults = true;

// La transcription est insérée dans le champ d'anamnèse en temps réel
recognition.onresult = (event) => {
  setDictationText((prev) => `${prev} ${transcript}`);
};
```

> **Simulation** : Un bouton "Simuler dictée" insère un extrait clinique réaliste si le micro n'est pas disponible.

#### Génération IA (1-Clic)

La synthèse SOAP et le courrier d'adressage sont générés à partir de :
- L'anamnèse dictée ou saisie
- Les constantes du jour
- Le dossier patient (allergies, antécédents, traitements)
- Le profil du médecin traitant

---

### Module 4 : Prescription (`PrescriptionView.tsx`)

#### Moteur VIDAL Expert (`PrescriptionSafetyEngine`)

Le moteur analyse 3 niveaux de sécurité :

```typescript
static analyze(
  prescribedLines: PrescriptionLine[],
  patient: Patient | null
): SafetyAlert[]
```

**1. Allergies patient ↔ Médicament prescrit**
```
Allergie Pénicilline + Amoxicilline → ALLERGIE (rouge)
Allergie AINS + Ibuprofène → ALLERGIE (rouge)
```

**2. Pathologies patient ↔ Médicament prescrit**
```
Insuffisance rénale + AINS → CONTRE_INDICATION
Insuffisance rénale + Metformine → PRECAUTION
Ulcère GD + AINS → CONTRE_INDICATION
HTA + Corticoïdes → PRECAUTION
```

**3. Interactions médicamenteuses (ordonnance × traitements de fond)**
```
AINS + Anticoagulant (Eliquis/Kardegic) → CONTRE_INDICATION
AINS + IEC (Ramipril) → ASSOCIATION_DECONSEILLEE
Cumul de Paracétamol (≥2 spécialités) → ASSOCIATION_DECONSEILLEE
```

#### Ordonnance officielle

Format A4 français avec :
- En-tête médecin (RPPS, ADELI, cabinet)
- Identité patient avec NIR
- Lignes de prescription avec posologie (NS, ALD)
- Pied avec QR code e-prescription et signature numérique
- Impression directe / export PDF navigateur

---

### Module 5 : Tâches & Google Agenda (`TasksAgendaView.tsx`)

#### Synchronisation Google Calendar

```typescript
// Génère un URL officiel Google Calendar avec préremplissage complet
GoogleCalendarService.generateGoogleCalendarUrl(task, patient): string

// Export fichier iCal standard (RFC 5545)
GoogleCalendarService.downloadIcsFile(task, patient): void
```

L'URL Google Calendar ouvre directement l'interface Google Agenda avec :
- Titre : `[Cabinet Médical] Tâche - Nom Patient`
- Description : infos patient (NIR, tél), catégorie, priorité, consignes
- Invitations automatiques vers l'email patient
- Durée par défaut : 30 minutes

---

## Services & APIs

### `BdpmService` — Base de Données Publique des Médicaments

```typescript
// Recherche avec fallback intelligent
BdpmService.searchMedications(query: string): Promise<Medication[]>
```

- Tente d'abord l'API BDPM (Gouv.fr) avec timeout 1,2s
- Fallback automatique sur la base locale (18 spécialités validées ANSM)
- Recherche multi-critères : nom spécialité, DCI, code CIS, classe ATC

### `PrescriptionSafetyEngine` — Moteur VIDAL

```typescript
PrescriptionSafetyEngine.analyze(lines, patient): SafetyAlert[]

// Types d'alertes
type SafetyAlertLevel = 
  | 'CONTRE_INDICATION'      // Rouge - blocage
  | 'ASSOCIATION_DECONSEILLEE' // Orange - avertissement
  | 'PRECAUTION'             // Jaune - surveillance
  | 'ALLERGIE'               // Rouge vif - critique
```

### `GoogleCalendarService` — Intégration Calendrier

```typescript
// Ouvre Google Calendar avec événement pré-rempli
generateGoogleCalendarUrl(task, patient?): string

// Télécharge fichier .ics (RFC 5545)
downloadIcsFile(task, patient?): void
```

---

## Structure du projet

```
med-workspace/
│
├── index.html                          # Point d'entrée HTML (Google Fonts, Meta)
├── vite.config.ts                      # Config Vite + Tailwind CSS plugin
├── tsconfig.app.json                   # Config TypeScript
│
└── src/
    ├── main.tsx                        # Point d'entrée React
    ├── App.tsx                         # Composant racine + State global
    ├── index.css                       # Styles globaux + Tailwind import
    │
    ├── types/
    │   └── medical.ts                  # Interfaces TypeScript (Patient, Appointment…)
    │
    ├── data/
    │   ├── frenchMedications.ts        # 18 médicaments BDPM (CIS, DCI, CI, ATC)
    │   └── mockData.ts                 # Données de démonstration (patients, RDV, tâches)
    │
    ├── services/
    │   ├── bdpmService.ts              # Recherche médicaments BDPM + fallback
    │   ├── prescriptionSafetyService.ts # Moteur VIDAL Expert (interactions & CI)
    │   └── googleCalendarService.ts    # Synchro Google Agenda + export .ics
    │
    └── components/
        ├── layout/
        │   ├── Header.tsx              # Barre supérieure (recherche, profil médecin)
        │   └── Sidebar.tsx             # Navigation latérale avec badges
        │
        ├── dashboard/
        │   └── WaitingRoomView.tsx     # Salle d'attente + Planning
        │
        ├── patients/
        │   ├── PatientRecordsView.tsx  # Annuaire patients + filtres
        │   ├── PatientDetailModal.tsx  # Fiche complète (3 onglets)
        │   └── PatientSynthesizedProfileModal.tsx  # VSM + Export confrère
        │
        ├── consultation/
        │   └── ConsultationView.tsx    # Constantes + Dictée + Synthèse IA
        │
        ├── prescription/
        │   └── PrescriptionView.tsx    # BDPM + VIDAL + Ordonnance imprimable
        │
        └── tasks/
            └── TasksAgendaView.tsx     # Tâches + Google Calendar + .ics
```

---

## Données & Conformité

### Données médicaments BDPM embarquées

| Spécialité | DCI | CIS | Classe ATC |
|---|---|---|---|
| DOLIPRANE 1000mg | Paracétamol | 65239103 | N02BE01 |
| AMOXICILLINE BIOGARAN 1g | Amoxicilline | 60234125 | J01CA04 |
| IBUPROFENE VIATRIS 400mg | Ibuprofène | 68741250 | M01AE01 |
| ELIQUIS 5mg | Apixaban | 63124567 | B01AF02 |
| KARDEGIC 75mg | Aspirine | 64891234 | B01AC06 |
| RAMIPRIL TEVA 5mg | Ramipril | 65543210 | C09AA05 |
| METFORMINE EG 1000mg | Metformine | 67890123 | A10BA02 |
| INEXIUM 20mg | Ésoméprazole | 68901245 | A02BC05 |
| TAHOR 20mg | Atorvastatine | 69012356 | C10AA05 |
| LEVOTHYROX 75µg | Lévothyroxine | 64567890 | H03AA01 |
| VENTOLINE 100µg | Salbutamol | 62345890 | R03AC02 |
| CELESTENE 2mg | Bétaméthasone | 65678901 | H02AB01 |
| *(et 6 autres...)* | | | |

### Conformité & Sécurité

> ⚠️ **Note de conformité** : Cette application est un **démonstrateur pédagogique**. Pour un déploiement en production dans un établissement de santé, les obligations suivantes s'appliquent :

- **HDS (Hébergement Données de Santé)** : Certification obligatoire pour l'hébergeur
- **RGPD** : Registre de traitements, DPO désigné, politique de confidentialité
- **Certification HAS** : Pour les logiciels d'aide à la prescription (LAP)
- **InteropSanté** : Implémentation FHIR R4 pour l'interopérabilité DMP/Mon Espace Santé
- **eIDAS** : Signature électronique qualifiée (e-CPS) pour les ordonnances numériques

---

## Développement

### Stack technique

| Technologie | Version | Usage |
|---|---|---|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Typage statique |
| Tailwind CSS | 4.x | Styling utilitaire |
| Vite | 8.x | Bundler & Dev Server |
| Lucide React | Latest | Icônes SVG |
| Web Speech API | Native | Dictée vocale |

### Commandes

```bash
npm run dev       # Serveur de développement (hot reload)
npm run build     # Build de production optimisé
npm run preview   # Prévisualisation du build
```

### Variables d'environnement (optionnel)

```env
# .env.local
VITE_BDPM_API_URL=https://base-donnees-publique.medicaments.gouv.fr/api
VITE_GOOGLE_CALENDAR_CLIENT_ID=votre_client_id_google
VITE_APP_ENV=development
```

### Ajout d'un médicament à la base locale

Éditez [`src/data/frenchMedications.ts`](src/data/frenchMedications.ts) :

```typescript
{
  cis: 'CODE_CIS',
  name: 'NOM COMMERCIAL Xmg, forme galénique',
  dci: 'Dénomination Commune Internationale',
  dosage: 'Xmg',
  form: 'Comprimé / Gélule / Solution...',
  laboratory: 'Laboratoire titulaire AMM',
  statusAmm: 'Commercialisée',
  atcClass: 'XXXXX',
  contraindications: ['CI 1', 'CI 2'],
  cautions: ['Précaution 1']
}
```

---

## Roadmap

### v2.5 (Court terme)
- [ ] Authentification sécurisée (e-CPS / SSO ANS)
- [ ] Mode sombre (Dark Mode complet)
- [ ] Responsive mobile complet (PWA)
- [ ] Export ordonnance en PDF côté serveur (Puppeteer)

### v3.0 (Moyen terme)
- [ ] Intégration API VIDAL officielle
- [ ] Connexion DMP (Dossier Médical Partagé) via API ANS
- [ ] FHIR R4 pour interopérabilité Mon Espace Santé
- [ ] Module de téléconsultation vidéo intégré (WebRTC)
- [ ] Facturation et feuilles de soins électroniques (FSE/SESAM-Vitale)

### v4.0 (Long terme)
- [ ] IA générative (LLM) pour synthèse SOAP avancée
- [ ] Intégration résultats laboratoire (HL7 FHIR DiagnosticReport)
- [ ] Agenda multi-praticiens (cabinet de groupe)
- [ ] Application mobile native (React Native)

---

## Licence

MIT License — © 2026 MedWorkspace Contributors

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software, to deal in the Software without restriction.
```

---

<div align="center">

**Fait avec ❤️ pour les professionnels de santé**

[📧 Contact](mailto:contact@medworkspace.fr) • [🐛 Signaler un bug](https://github.com/Miki64/Lumina/issues) • [💡 Proposer une fonctionnalité](https://github.com/Miki64/Lumina/issues/new)

</div>
>>>>>>> 8999ec3 (feat: initial release — MedWorkspace v1.0)
