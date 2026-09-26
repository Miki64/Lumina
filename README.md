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
