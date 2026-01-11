# Deployment Guide

## Development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173/pairWise-Cards/`

### Test Onboarding (Dev Only)

To test the new user onboarding experience:

```
http://localhost:5173/pairWise-Cards/?onboarding
```

This will automatically clear the database and show the welcome screen.

---

## Production Build

```bash
npm run build
```

Output is in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Deploy to GitHub Pages

```bash
npm run deploy
```

This runs `gh-pages -d dist` to publish to GitHub Pages.

**Live URL**: https://baddsu51.github.io/pairWise-Cards/

---

## Environment Differences

| Feature | Development | Production |
|---------|-------------|------------|
| Mock data | Yes - Auto-loaded | No - Empty |
| `?onboarding` param | Yes - Clears DB | No - Ignored |
| Hot reload | Yes | No |

---

## Theme Customization

Edit CSS variables in `src/style.css`:

```css
:root {
  --color-primary-500: #8b5cf6;  /* Main brand color */
  --color-primary-600: #7c3aed;  /* Hover state */
  /* ... other colors */
}
```
