# Contributing to PairWise Cards

Thank you for your interest in contributing to PairWise Cards! This guide will help you get started with the development process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Git Workflow](#git-workflow)
- [Submitting Changes](#submitting-changes)

---

## Code of Conduct

Please be respectful and inclusive in all interactions. We're building a learning tool, so let's maintain a positive and educational environment.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher
- **npm** 9 or higher (comes with Node.js)
- **Git**
- A code editor (we recommend VS Code with the following extensions):
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/pairWise-Cards.git
cd pairWise-Cards
```

3. Add the upstream remote:

```bash
git remote add upstream https://github.com/baddsu51/pairWise-Cards.git
```

---

## Development Setup

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with hot module replacement (HMR).

### Useful Development URLs

| URL                                | Purpose                          |
| ---------------------------------- | -------------------------------- |
| `http://localhost:5173`            | Main application                 |
| `http://localhost:5173?onboarding` | Test onboarding flow (clears DB) |

### Development Mode Features

When running in development mode (`npm run dev`):

- **DevToolbar**: A development toolbar appears at the bottom
- **Mock Data**: Sample decks and cards are loaded automatically
- **Console Logging**: Additional debug information via `devLog`

---

## Project Structure

```
src/
├── components/         # React/Preact components
│   ├── Page/          # Page-level components
│   ├── Modals/        # Modal dialogs
│   └── shared/        # Reusable components
├── contexts/          # React contexts for state
├── models/            # Data models and DB config
├── utils/             # Utility functions
├── assets/            # Static assets (SVGs)
└── config/            # Configuration files
```

For detailed architecture information, see [TECHNICAL.md](TECHNICAL.md).

---

## Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

| Prefix      | Use Case          | Example                    |
| ----------- | ----------------- | -------------------------- |
| `feature/`  | New features      | `feature/export-cards`     |
| `fix/`      | Bug fixes         | `fix/swipe-gesture-mobile` |
| `refactor/` | Code improvements | `refactor/sm2-algorithm`   |
| `docs/`     | Documentation     | `docs/api-reference`       |
| `test/`     | Test additions    | `test/fill-in-heuristic`   |

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Creating a Feature Branch

```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

---

## Submitting Changes

### Commit Messages

Follow the conventional commits format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
# Feature
git commit -m "feat(learning): add keyboard shortcuts for card navigation"

# Bug fix
git commit -m "fix(swipe): correct gesture detection on iOS Safari"

# Documentation
git commit -m "docs: update installation instructions"

# Refactoring
git commit -m "refactor(sm2): extract quality calculation into separate function"
```

### Pull Request Process

1. **Update your branch** with the latest changes from upstream:

```bash
git fetch upstream
git rebase upstream/main
```

2. **Run checks** before pushing:

```bash
npm run lint
npm run test:run
npm run build
```

3. **Push your branch**:

```bash
git push origin feature/your-feature-name
```

4. **Create a Pull Request** on GitHub with:
   - A clear title describing the change
   - A description explaining what and why
   - Screenshots for UI changes
   - Link to related issues (if any)

### Pull Request Template

```markdown
## Description

Brief description of the changes.

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?

Describe the tests you ran.

## Screenshots (if applicable)

Add screenshots for UI changes.

## Checklist

- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review
- [ ] I have added tests (if applicable)
- [ ] My changes generate no new warnings
- [ ] I have updated the documentation (if needed)
```

---

## Questions?

If you have questions about contributing:

1. Check the existing documentation
2. Search closed issues/PRs for similar topics
3. Open a new issue with the "question" label

Thank you for contributing to PairWise Cards!
