# Contributing to PairWise Cards

Thank you for your interest in contributing to PairWise Cards! This guide will help you get started with the development process.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style](#code-style)
- [Git Workflow](#git-workflow)
- [Submitting Changes](#submitting-changes)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

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

| URL | Purpose |
|-----|---------|
| `http://localhost:5173` | Main application |
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

## Code Style

### TypeScript

- Use strict TypeScript (`strict: true` in tsconfig)
- Prefer interfaces over type aliases for object shapes
- Export types when they need to be shared
- Use explicit return types for public functions

```typescript
// Good
interface CardProps {
  card: Card
  onAnswer: (data: ModeAnswerData) => void
}

export function Card({ card, onAnswer }: CardProps): JSX.Element {
  // ...
}

// Avoid
export function Card(props: any) {
  // ...
}
```

### Component Guidelines

- Use functional components with hooks
- Keep components focused and single-purpose
- Extract complex logic into custom hooks or utilities
- Use descriptive prop names

```typescript
// Good - Clear, focused component
export function MasteryBreakdown({ counts, total }: MasteryBreakdownProps) {
  // Single responsibility: display mastery breakdown
}

// Avoid - Doing too much
export function ProgressStuff({ everything }) {
  // Multiple responsibilities mixed together
}
```

### Tailwind CSS

- Use Tailwind utility classes for styling
- Follow the project's custom class conventions in `style.css`
- Use the theme colors defined in `tailwind.config.js`

```tsx
// Good - Using theme colors and utilities
<button className="btn-primary">Save</button>
<div className="card-elevated p-4">Content</div>

// Avoid - Inline styles or arbitrary values
<button style={{ backgroundColor: '#0ea5e9' }}>Save</button>
<div className="bg-[#f5f5f5]">Content</div>
```

### ESLint

Run the linter before committing:

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
```

ESLint rules are configured in `eslint.config.js`.

---

## Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feature/` | New features | `feature/export-cards` |
| `fix/` | Bug fixes | `fix/swipe-gesture-mobile` |
| `refactor/` | Code improvements | `refactor/sm2-algorithm` |
| `docs/` | Documentation | `docs/api-reference` |
| `test/` | Test additions | `test/fill-in-heuristic` |

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

## Testing

### Running Tests

```bash
npm run test          # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage report
```

### Writing Tests

Tests are located alongside the code they test or in `__tests__` directories.

```typescript
// src/utils/myUtil.test.ts
import { describe, it, expect } from 'vitest'
import { myFunction } from './myUtil'

describe('myFunction', () => {
  it('should handle normal input', () => {
    const result = myFunction('input')
    expect(result).toBe('expected output')
  })

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('')
    expect(myFunction(null)).toBeNull()
  })
})
```

### What to Test

- **Utility functions**: Test all edge cases
- **SM-2 algorithm**: Ensure calculations are correct
- **Fill-in heuristic**: Test word extraction logic
- **Components**: Test user interactions (optional, we use happy-dom)

---

## Reporting Issues

### Bug Reports

When reporting a bug, please include:

1. **Description**: What happened vs. what you expected
2. **Steps to Reproduce**: Detailed steps to reproduce the issue
3. **Environment**: Browser, OS, screen size
4. **Screenshots/Videos**: If applicable
5. **Console Errors**: Any JavaScript errors in the console

### Feature Requests

For feature requests, please describe:

1. **The Problem**: What need does this address?
2. **Proposed Solution**: How do you envision it working?
3. **Alternatives**: Any alternative solutions you considered?
4. **Additional Context**: Mockups, examples, etc.

---

## Questions?

If you have questions about contributing:

1. Check the existing documentation
2. Search closed issues/PRs for similar topics
3. Open a new issue with the "question" label

Thank you for contributing to PairWise Cards!
