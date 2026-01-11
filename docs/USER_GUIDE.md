# PairWise Cards - User Guide

This guide will help you get started with PairWise Cards and make the most of its features.

## Table of Contents

- [Getting Started](#getting-started)
- [Creating Your First Deck](#creating-your-first-deck)
- [Adding Cards](#adding-cards)
- [Learning Modes](#learning-modes)
- [Understanding SM-2 Algorithm](#understanding-sm-2-algorithm)
- [Mastery Levels](#mastery-levels)
- [Importing Cards](#importing-cards)
- [Free Practice Mode](#free-practice-mode)
- [Progress Page](#progress-page)
- [Deck Settings](#deck-settings)
- [FAQ](#faq)

---

## Getting Started

When you first open PairWise Cards, you'll see a welcome screen inviting you to create your first deck. The app has three main sections accessible from the bottom navigation bar:

| Tab | Purpose |
|-----|---------|
| **Learning** | Review your flashcards |
| **Collection** | Manage your decks and cards |
| **Progress** | View your learning statistics |

---

## Creating Your First Deck

1. Click the **"Create My First Deck"** button on the welcome screen
2. Enter a name for your deck (e.g., "Spanish Vocabulary")
3. Optionally, select a tolerance level for answer validation
4. Click **"Create"**

You can create multiple decks to organize your learning by subject, language, or any other category.

---

## Adding Cards

### Manual Creation

1. Navigate to your deck (use the selector in the top bar)
2. Click the **"Add"** button
3. Fill in the **Question** field (what you want to remember)
4. Fill in the **Answer** field (what you need to recall)
5. Click **"Add Card"**

**Tip:** You can add multiple cards in a row - the form stays open after each addition.

### Quick Tips for Good Flashcards

- Keep questions clear and specific
- One concept per card works best
- Use simple, direct answers
- Consider using the same card in reverse for bidirectional learning

---

## Learning Modes

PairWise Cards offers three different ways to study your cards. Switch between modes using the selector in the top bar.

### Typing Mode

**How it works:**
1. Read the question on the card
2. Type your answer in the input field
3. Press Enter or click "Check"
4. See if your answer matches

**Scoring:**
- Fast correct answer (< 3 seconds): Quality 5 (Perfect)
- Medium correct answer (3-8 seconds): Quality 4 (Good)
- Slow correct answer (> 8 seconds): Quality 3 (Hesitant)
- Wrong answer: Quality 1 (Needs review)

**Tolerance Settings:** Your deck's tolerance level affects how strictly answers are matched:
- **Exact**: 100% match required
- **Tolerant 80%**: 80% similarity accepted (minor typos OK)
- **Tolerant 60%**: 60% similarity accepted (very lenient)

### Swipe Mode

**How it works:**
1. Read the question on the card
2. Try to recall the answer mentally
3. Reveal the answer by clicking
4. Swipe **right** if you knew it, **left** if you didn't

**Best for:** Quick review sessions and self-assessment

**Scoring:**
- Swipe right (knew it): Quality 5
- Swipe left (didn't know): Quality 1

### Fill-in Mode

**How it works:**
1. The answer appears with key words replaced by blanks (e.g., `___[1]___`)
2. Fill in each blank with the missing word
3. Submit to check your answers

**How blanks are selected:**
The app automatically identifies important words to blank out:
- Proper nouns and names
- Numbers and dates
- Technical terms
- Long, specific words

**Scoring:** Based on the percentage of blanks filled correctly:
- 100% correct: Quality 5
- 80-99% correct: Quality 4
- 50-79% correct: Quality 3
- 1-49% correct: Quality 2
- 0% correct: Quality 1

---

## Understanding SM-2 Algorithm

PairWise Cards uses the **SuperMemo 2 (SM-2)** algorithm, a scientifically proven method for optimal learning.

### How It Works

1. **Initial Learning**: New cards are shown frequently (every 1-6 days)
2. **Successful Reviews**: Each correct answer increases the interval until the next review
3. **Failed Reviews**: Wrong answers reset the card to be reviewed sooner
4. **Easiness Factor**: Cards adjust their difficulty based on your performance

### Quality Ratings

The algorithm uses a 0-5 quality scale:

| Quality | Meaning |
|---------|---------|
| 5 | Perfect response, instant recall |
| 4 | Correct with some hesitation |
| 3 | Correct with difficulty |
| 2 | Incorrect, but answer seemed familiar |
| 1 | Incorrect, recognized answer when shown |
| 0 | Complete blackout |

### Interval Progression

For successful reviews (quality ≥ 3):
- 1st success: Review in 1 day
- 2nd success: Review in 6 days
- 3rd+ success: Interval × Easiness Factor

---

## Mastery Levels

Cards progress through four mastery levels:

| Level | Criteria | What It Means |
|-------|----------|---------------|
| **New** | Never reviewed | Card is waiting for first study |
| **Learning** | 1-2 correct answers | Building initial memory |
| **Reviewing** | 3+ correct, interval < 21 days | Strengthening recall |
| **Mastered** | Interval ≥ 21 days | Long-term memory achieved |

You can see your mastery breakdown on the **Progress** page.

---

## Importing Cards

Save time by importing cards from files instead of creating them manually.

### Supported Formats

#### CSV (Comma/Semicolon Separated)
```csv
question;answer
Capital of France;Paris
Largest ocean;Pacific
```

#### TSV (Tab Separated)
```
question	answer
Capital of France	Paris
Largest ocean	Pacific
```

#### JSON
```json
[
  {"question": "Capital of France", "answer": "Paris"},
  {"question": "Largest ocean", "answer": "Pacific"}
]
```

### How to Import

1. Go to the **Collection** page
2. Select a deck (not "All Cards")
3. Click the **"Import"** button
4. Either:
   - Drag and drop a file onto the upload area
   - Click to browse and select a file
   - Paste content directly into the text area
5. Preview the parsed cards
6. Click **"Import X cards"**

### Import Tips

- The app auto-detects the format (CSV, JSON, TSV)
- Header rows are automatically skipped
- Invalid lines are shown in the preview but not imported
- Supported file extensions: `.csv`, `.json`, `.tsv`, `.txt`

---

## Free Practice Mode

Practice cards without affecting your learning progress or SM-2 data.

### When to Use

- You want extra practice beyond scheduled reviews
- You're preparing for an exam and need intensive review
- You want to test yourself without consequences

### How to Activate

1. Complete all due cards for the day
2. When the "All caught up!" screen appears, choose:
   - **"Review all cards"** - Practice every card in the deck
   - **"Review upcoming cards"** - Practice cards due in the next X days

### Important Notes

- A yellow banner indicates you're in Free Practice mode
- Progress is NOT saved during free practice
- Click "Exit" to return to normal mode

---

## Progress Page

The Progress page shows your learning statistics and helps you understand your advancement.

### Statistics Overview

- **Total Cards**: Number of cards in the selected deck
- **Mastery**: Percentage of cards at "Mastered" level
- **Due Now**: Cards waiting for review
- **Decks**: Number of decks you've created

### Mastery Breakdown

A visual bar chart showing the distribution of your cards across mastery levels:
- Gray: New cards
- Blue: Learning cards
- Yellow: Reviewing cards
- Green: Mastered cards

### Learning Stats

- Average reviews per card
- Breakdown by mastery level with explanations

### Tips

The page also provides contextual tips, such as reminders when you have cards due for review.

---

## Deck Settings

Customize how each deck behaves.

### Accessing Settings

1. Go to the **Collection** page
2. Select a deck
3. Click the **"Settings"** button

### Available Settings

#### Deck Name
Change the display name of your deck.

#### Tolerance Level
Controls how strictly typed answers are validated:

| Level | Match Required | Best For |
|-------|----------------|----------|
| Exact | 100% | Precise terms, codes, dates |
| Tolerant 80% | 80% | General vocabulary, allows minor typos |
| Tolerant 60% | 60% | Concepts where wording may vary |

---

## FAQ

### How do I delete a card?

1. Go to the **Collection** page
2. Find the card in the list
3. Click the edit/delete icon on the card
4. Confirm deletion

### How do I delete a deck?

1. Go to the **Collection** page
2. Select the deck to delete
3. Click the **"Delete"** button in the header
4. Confirm deletion (this also deletes all cards in the deck)

### Is my data saved online?

No, all data is stored locally in your browser using IndexedDB. This means:
- Your data is private and never leaves your device
- You don't need an account
- Data persists between sessions
- Clearing browser data will erase your cards

### Can I export my cards?

Export functionality is planned for a future update. Currently, you can only import cards.

### Why do I see "All caught up!" when I have cards?

This means all your cards are scheduled for future review. The SM-2 algorithm determines when each card should be reviewed for optimal retention. Use **Free Practice** mode if you want to study ahead of schedule.

### How do I change the learning mode?

Use the mode selector in the top navigation bar. Your preference is saved automatically.

### Can I use this on mobile?

Yes! The app is fully responsive and works on phones and tablets. All features are available on mobile devices.

### How is the "Mastered" percentage calculated?

It's the number of cards at the "Mastered" level divided by total cards × 100. A card is considered mastered when its review interval reaches 21+ days.
