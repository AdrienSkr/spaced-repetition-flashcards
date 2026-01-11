# PairWise Cards

A modern flashcard application with spaced repetition learning, built with Preact and TypeScript.

[![Deploy to GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)](https://baddsu51.github.io/pairWise-Cards/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Preact](https://img.shields.io/badge/Preact-10.23-purple)](https://preactjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8)](https://tailwindcss.com/)

## Overview

PairWise Cards is a flashcard learning application that uses the **SM-2 spaced repetition algorithm** to help you memorize information more effectively. The app automatically schedules reviews at optimal intervals based on how well you remember each card.

**Live Demo:** [https://baddsu51.github.io/pairWise-Cards/](https://baddsu51.github.io/pairWise-Cards/)

## Features

- **Three Learning Modes**
  - **Typing Mode**: Type your answer and get instant feedback with tolerance settings
  - **Swipe Mode**: Quick self-assessment by swiping left (don't know) or right (know)
  - **Fill-in Mode**: Automatically generated blanks to fill in key words

- **SM-2 Spaced Repetition Algorithm**
  - Scientifically proven algorithm for optimal memory retention
  - Automatic scheduling of card reviews
  - Adaptive difficulty based on your performance

- **Deck Management**
  - Create and organize multiple decks
  - Import cards from CSV, JSON, or TSV files
  - Configurable tolerance levels per deck

- **Progress Tracking**
  - Visual mastery breakdown (New, Learning, Reviewing, Mastered)
  - Statistics dashboard with cards due and mastery percentage
  - Detailed learning stats

- **Free Practice Mode**
  - Review cards without affecting your progress
  - Practice upcoming cards (1-30 days ahead)

- **Modern UI/UX**
  - Clean, responsive design with Tailwind CSS
  - Keyboard accessibility with skip links
  - Smooth animations and transitions

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/baddsu51/pairWise-Cards.git
cd pairWise-Cards

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Deploy to GitHub Pages |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues automatically |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Preact](https://preactjs.com/) | UI framework (lightweight React alternative) |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first CSS framework |
| [Dexie.js](https://dexie.org/) | IndexedDB wrapper for local storage |
| [Vite](https://vitejs.dev/) | Fast build tool and dev server |
| [Vitest](https://vitest.dev/) | Unit testing framework |

## Documentation

- [User Guide](docs/USER_GUIDE.md) - How to use the application
- [Technical Documentation](docs/TECHNICAL.md) - Architecture and implementation details
- [Contributing Guide](docs/CONTRIBUTING.md) - How to contribute to the project

## Project Structure

```
src/
├── components/          # UI components
│   ├── BottomBar/      # Navigation bar
│   ├── Modals/         # Modal dialogs
│   ├── Page/           # Page components (Learning, Collection, Progress)
│   ├── Progress/       # Progress-related components
│   ├── shared/         # Reusable components
│   └── TopBar/         # Header with deck selector
├── contexts/           # React contexts
├── models/             # Data models and database
├── utils/              # Utility functions (SM-2, Levenshtein, etc.)
└── assets/             # SVG icons and images
```

## How It Works

1. **Create a Deck** - Organize your flashcards into themed decks
2. **Add Cards** - Create question-answer pairs manually or import from files
3. **Learn** - Review cards using your preferred learning mode
4. **Progress** - The SM-2 algorithm optimizes your review schedule automatically

Cards progress through mastery levels:
- **New** - Never reviewed
- **Learning** - 1-2 correct answers
- **Reviewing** - 3+ correct answers, interval < 21 days
- **Mastered** - Long-term memory, interval ≥ 21 days

## Browser Support

PairWise Cards uses IndexedDB for local storage and works in all modern browsers:
- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [SuperMemo SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2) - The spaced repetition algorithm
- [Preact](https://preactjs.com/) - Fast 3kB alternative to React
- [Dexie.js](https://dexie.org/) - A minimalistic wrapper for IndexedDB
