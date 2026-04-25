# PairWise Cards 🃏

> Application de flashcards avec répétition espacée, construite avec Preact, TypeScript, Dexie.js et Tailwind CSS.

[![Demo en ligne](https://img.shields.io/badge/Demo-GitHub%20Pages-blue?style=for-the-badge)](https://baddsu51.github.io/pairWise-Cards/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Preact](https://img.shields.io/badge/Preact-673AB8?style=for-the-badge&logo=preact&logoColor=white)](https://preactjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

## Aperçu

PairWise Cards est une application d'apprentissage par flashcards qui implémente l'**algorithme de répétition espacée SM-2**. L'objectif est d'aider les utilisateurs à mémoriser des informations de manière durable et efficace. L'application planifie automatiquement les révisions à des intervalles calculés par l'algorithme en fonction des réponses données pendant l'entraînement.

**Demo live :** [https://adrienskr.github.io/spaced-repetition-flashcards/](https://adrienskr.github.io/spaced-repetition-flashcards/)

![Demo de l'application](docs/images/demo.gif)

## Motivation

J'ai toujours été fasciné par les applications de flashcards et l'apprentissage par renforcement, notamment grâce à [Anki](https://apps.ankiweb.net/). Une fois des compétences en développement web acquises, j'ai décidé de créer ma propre application.

Comme beaucoup de projets personnels, le premier jet a souffert d'une trop grande ambition : trop de fonctionnalités d'emblée, une architecture difficile à maintenir, et un abandon progressif.

Plus d'un an plus tard, j'ai relancé le projet avec une approche différente : me concentrer sur un **MVP fonctionnel et cohérent**. J'en ai également profité pour explorer l'assistance par intelligence artificielle dans le développement, un changement de paradigme que je souhaitais expérimenter.

## Fonctionnalités

### 🎯 Trois modes d'apprentissage

| Mode | Description |
|---|---|
| **Saisie (Typing)** | L'utilisateur tape la réponse complète. La tolérance aux fautes est configurable par deck. |
| **Glissement (Swipe)** | Révision rapide par auto-évaluation : glisser à gauche si la réponse était connue, à droite sinon. |
| **Texte à trous (Fill-in)** | Les mots-clés de la réponse sont masqués grâce à une heuristique de scoring. L'utilisateur complète uniquement les mots importants. |

> 💡 Le mode Fill-in représente un **juste milieu** entre la rapidité du Swipe et la rigueur du Typing : il évite la fausse impression de connaissance tout en réduisant le temps de saisie.

### 🧠 Algorithme SM-2

- Algorithme scientifiquement éprouvé pour la rétention optimale en mémoire à long terme.
- Planification automatique des révisions.
- Intervalles adaptatifs selon la performance de l'utilisateur.

### 📂 Gestion des decks

- Création et organisation de plusieurs listes thématiques.
- Import de cartes en masse via fichiers **CSV, JSON ou TSV**.
- Tolérance de frappe configurable par deck.

### 📊 Suivi de progression

Chaque carte passe par quatre états :

| État | Description |
|---|---|
| **Nouvelle** | Jamais révisée |
| **En cours** | 1 à 2 bonnes réponses |
| **En révision** | 3+ bonnes réponses, intervalle < 21 jours |
| **Maîtrisée** | Mémoire long terme, intervalle ≥ 21 jours |

La page de progression affiche : nombre total de cartes, répartition par état, pourcentage de maîtrise, et nombre moyen de révisions par carte.

### 🔁 Mode entraînement libre

Quand toutes les cartes disponibles selon SM-2 ont été révisées, il est possible de continuer sans impacter la progression. La révision libre peut porter sur toutes les cartes du deck ou sur les cartes à venir (jusqu'à 30 jours à l'avance).

### 🖥️ UI/UX moderne

- Design responsive adapté mobile et desktop.
- Navigation entièrement au clavier (révision sans souris).

---

## Défis techniques

### Stockage local dans le navigateur
La première problématique était de trouver comment persister une base de données côté client. Après recherches, j'ai découvert **IndexedDB** via la bibliothèque [Dexie.js](https://dexie.org/), qui simplifie considérablement la configuration et offre une API TypeScript intuitive.

### Algorithme Fill-in
La détection des mots à masquer a nécessité une réflexion approfondie. L'approche actuelle repose sur un système d'heuristiques couplé à un scoring. Une évolution envisagée est l'intégration d'un **modèle de NLP** pour identifier automatiquement les mots les plus pertinents - maximisant l'apprentissage tout en minimisant le temps de saisie.

### Architecture & priorisation
Ce projet m'a appris l'importance de **prioriser les fonctionnalités** et de livrer un MVP solide avant d'ajouter des fonctionnalités supplémentaires.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| [Preact](https://preactjs.com/) | Framework UI (alternative légère à React) |
| [TypeScript](https://www.typescriptlang.org/) | JavaScript typé et sécurisé |
| [Tailwind CSS](https://tailwindcss.com/) | Framework CSS utilitaire |
| [Dexie.js](https://dexie.org/) | Wrapper IndexedDB pour le stockage local |
| [Vite](https://vitejs.dev/) | Build tool et serveur de développement |
| [Vitest](https://vitest.dev/) | Framework de tests unitaires |

---

## Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/AdrienSkr/pairWise-Cards.git
cd pairWise-Cards

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Build de production

```bash
npm run build      # Créer le build de production
npm run preview    # Prévisualiser le build localement
```

### Déploiement sur GitHub Pages

```bash
npm run deploy
```

---

## Scripts disponibles

| Script | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build pour la production |
| `npm run preview` | Prévisualise le build localement |
| `npm run deploy` | Déploie sur GitHub Pages |
| `npm run lint` | Exécute ESLint |
| `npm run lint:fix` | Corrige automatiquement les erreurs ESLint |
| `npm run test` | Lance les tests en mode "watch" |
| `npm run test:run` | Lance les tests une fois |
| `npm run test:coverage` | Lance les tests avec rapport de couverture |

---

## Documentation

- [Guide utilisateur](docs/USER_GUIDE.md) - Comment utiliser l'application.
- [Documentation technique](docs/TECHNICAL.md) - Détails sur l'architecture et l'implémentation.

---

## Compatibilité navigateurs

PairWise Cards utilise IndexedDB pour le stockage local (persistance entre les sessions) :

| Navigateur | Version minimale |
|---|---|
| Chrome | 80+ |
| Firefox | 75+ |
| Safari | 14+ |
| Edge | 80+ |

---

## Licence

Ce projet est open source sous licence [MIT](LICENSE).

---

## Remerciements

- [Algorithme SuperMemo SM-2](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2) - L'algorithme de répétition espacée.
- [Preact](https://preactjs.com/) - L'alternative légère à React (3kB).
- [Dexie.js](https://dexie.org/) - Un wrapper minimaliste pour IndexedDB.
