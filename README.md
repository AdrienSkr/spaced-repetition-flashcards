# PairWise Cards

A flashcard application using spaced repetition learning, built with Preact, TypeScript, Dexie.js, and Tailwind CSS.

[![Deploy to GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-blue)](https://baddsu51.github.io/pairWise-Cards/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org/)
[![Preact](https://img.shields.io/badge/Preact-10.23-purple)](https://preactjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8)](https://tailwindcss.com/)

## Overview

PairWise Cards is a flashcard learning application that uses the **SM-2 spaced repetition algorithm** with the goal of helping users memorize information more effectively. The application automatically schedules reviews at intervals calculated by the algorithm based on responses given during training mode.

**Live Demo:** [https://baddsu51.github.io/pairWise-Cards/](https://baddsu51.github.io/pairWise-Cards/)

<div align="center">
<img src="docs/images/demo.gif" alt="App Demo" width="500" />
</div>

## Motivation

I have always been interested in flashcard applications and reinforcement learning, notably thanks to [Anki](https://apps.ankiweb.net/). Once I acquired web development skills, I decided to create my own flashcard app.

However, like many personal projects, it initially suffered from over-ambition. I tried to implement too many features for a first project. Maintaining a coherent architecture became complicated, and I eventually abandoned it.

Over a year later, with the benefit of hindsight, I decided to relaunch this project and finally reach a usable first version. I focused on a functional MVP. I managed to maintain a consistent architecture thanks to the assistance of artificial intelligence; indeed, recent advancements have changed the way we develop, and I wanted to give it a try.

## Development Challenges

From the start of the project, I faced several problems. By solving them, I acquired new knowledge.

The first challenge was finding a way to save a database locally in the browser. After some research, I discovered **IndexedDB** via the [Dexie.js](https://dexie.org/) library, which greatly simplifies configuration and offers an intuitive TypeScript API for managing client-side storage.

I had to think long and hard about the user interface and essential features. My goal was to implement the features I always wanted in a flashcard app. This taught me the importance of prioritizing features and creating a solid MVP before adding extra functionality.

The algorithm for determining which words to hide in Fill-in mode required significant thought and will need further improvement. Currently, it relies on a set of heuristics paired with a scoring system. In the future, I would like to implement a Natural Language Processing (NLP) model to detect the most relevant words to hide, maximizing learning while ensuring a shorter typing time compared to the full Typing mode

## Features

- **Three Learning Modes**

  - **Typing Mode**: Allows learning by writing the answer to the question. Tolerance levels can be configured for each card list.
  - **Swipe Mode**: Allows for easy card review by giving the power of self-assessment to the user, who can simply swipe left (if they knew it) or right (if they didn't) after flipping the card to see the answer.
  - **Fill-in Mode**: Offers a middle ground between typing and swiping. Swipe mode can give the user a false impression of knowledge. Typing mode can be very time-consuming for reviewing all cards if answers are long. Fill-in mode solves these issues by hiding only important words in an answer using heuristics. The user no longer has to type the whole phrase and benefits from active learning.

- **SM-2 Spaced Repetition Algorithm**

  - A scientifically proven algorithm for optimal memory retention.
  - Automatically schedules card reviews.
  - Adapts review intervals based on your performance.

- **Deck Management**

  - The application allows you to create and organize multiple lists (decks).
  - You can import multiple cards at once from CSV, JSON, or TSV files.
  - Manual typing tolerance levels are configurable for each deck.

- **Progress Tracking**

  - A card can have several states throughout the learning cycle: New, Learning, Reviewing, and Mastered.
  - The progress page shows statistics on deck cards, such as the total count, number of cards per state, mastery percentage, and even the average number of reviews per card.

- **Free Training Mode**

  - When all cards made available by the SM-2 algorithm have been reviewed, you can continue reviewing cards without affecting progress.
  - Free review can be done on all cards in a deck or on upcoming cards (from 1 to 30 days in advance).

- **Modern UI/UX**
  - The design is intended to be simple and strives to be adapted for all devices (mobile and desktop).
  - Navigation within the app is possible via keyboard. You can review your cards without touching the mouse.

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

# Start the development server
npm run dev

```

The application will be available at `http://localhost:5173`

### Production Build

```bash
# Create the application build
npm run build

# Preview the production build locally
npm run preview

```

### Deploy to GitHub Pages

```bash
npm run deploy

```

## Available Scripts

| Script                  | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Starts the development server         |
| `npm run build`         | Builds for production                 |
| `npm run preview`       | Previews the production build locally |
| `npm run deploy`        | Deploys to GitHub Pages               |
| `npm run lint`          | Runs ESLint                           |
| `npm run lint:fix`      | Automatically fixes ESLint issues     |
| `npm run test`          | Starts tests in "watch" mode          |
| `npm run test:run`      | Runs tests once                       |
| `npm run test:coverage` | Runs tests with a coverage report     |

## Tech Stack

| Technology                                    | Role                                         |
| --------------------------------------------- | -------------------------------------------- |
| [Preact](https://preactjs.com/)               | UI Framework (lightweight React alternative) |
| [TypeScript](https://www.typescriptlang.org/) | Typed and secure JavaScript                  |
| [Tailwind CSS](https://tailwindcss.com/)      | Utility-first CSS framework                  |
| [Dexie.js](https://dexie.org/)                | IndexedDB wrapper for local storage          |
| [Vite](https://vitejs.dev/)                   | Fast build tool and dev server               |
| [Vitest](https://vitest.dev/)                 | Unit testing framework                       |

## Documentation

- [User Guide](docs/USER_GUIDE.md) - How to use the application.
- [Technical Documentation](docs/TECHNICAL.md) - Details on architecture and implementation.

## How It Works

1. **Create a deck** - Organize your cards by theme (a language, a subject, etc.).
2. **Add cards** - Create question-answer pairs manually or import them.
3. **Learn** - Review cards using your preferred learning mode (Typing, Swipe, Fill-in).
4. **Progress** - The SM-2 algorithm automatically coordinates the review schedule.

Cards progress through different mastery levels:

- **New** - Never reviewed.
- **Learning** - 1 to 2 correct answers.
- **Reviewing** - 3+ correct answers, interval < 21 days.
- **Mastered** - Long-term memory, interval ≥ 21 days.

## Browser Support

PairWise Cards uses IndexedDB for local storage and works on all modern browsers:

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

Thus, decks and cards are saved from one session to another.

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- [SuperMemo SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2) - The spaced repetition algorithm.
- [Preact](https://preactjs.com/) - The fast 3kB alternative to React.
- [Dexie.js](https://dexie.org/) - A minimalist wrapper for IndexedDB.
