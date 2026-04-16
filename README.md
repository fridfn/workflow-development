# 🌙 ExFavorite Workflows

Automated GitHub Actions system that tracks daily activity, builds consistency, and sends personalized messages based on user behavior.

This project is not just automation — it’s a lightweight behavioral companion that reacts to your coding habits over time.

---

## ✨ Overview

ExFavorite Workflows is a collection of GitHub Actions that:

- Tracks daily commit activity
- Detects streak consistency
- Differentiates behavior based on time of day
- Sends personalized Telegram messages
- Adjusts tone based on user activity (active / inactive)

---

## 🧠 Core Concept

Instead of generic reminders, this system reacts to your behavior:

- Did you commit yesterday?
- Are you consistent or skipping days?
- What time are you active?
- Are you building momentum or losing it?

Each condition changes how the system talks to you.

---

## 🌅 Workflow System

### 1. Daily Cycle Start
Runs every midnight and generates a morning message based on yesterday’s activity.

- If no commit yesterday → motivational / restart tone
- If committed yesterday → continuation / momentum tone

---

### 2. Daily Reminder System
Runs hourly to check activity:

- Warning (sore)
- Last warning (malam)
- Final warning (larut malam)

Each stage adjusts urgency and tone.

---

### 3. Lock System
Prevents duplicate messages in a single day using GitHub labels.

---

### 4. Daily Appreciate System

Triggered when user has committed at least once in the current day.

This system sends appreciation messages based on time and consistency.

#### 🧠 Behavior:

- Detects today's commit activity
- Only runs if `no_commit=false`
- Uses time-based mood system:
  - Ambitious (12–16)
  - Productive (16–21)
  - Consistent (21–07)

#### 💬 Message Style:

- Appreciates consistency
- Reinforces momentum
- Avoids over-praising
- Keeps tone natural and slightly personal

#### 🌙 Example Behavior:

- Light encouragement during daytime
- Reflective appreciation in evening
- Calm reinforcement at night

#### ⚙️ Flow:

1. Check today's GitHub activity
2. If commit exists → enable appreciation mode
3. Pick message based on time + mode
4. Send Telegram message
5. Set lock to prevent duplicate sends

---

## 📁 Structure

```yml
.github
├── ISSUE_TEMPLATE
│   ├── bug.md
│   ├── config.yml
│   ├── feature.md
│   └── improvement.md
├── messages
│   ├── appreciation.json
│   ├── daily.start.json
│   └── reminder.json
├── scripts
│   ├── get.message.sh
│   └── send.telegram.sh
└── workflows
    ├── cycle.reset.yml
    ├── cycle.start.yml
    ├── git.commit.message.yml
    ├── streak.lock.yml
    └── streak.reminder.yml
```
---

## 💬 Message Philosophy

Messages are designed to feel:

- Personal, not robotic
- Context-aware, not random
- Light emotional pressure (not forcing)
- Reflective rather than aggressive

The system doesn’t just remind — it responds.

---

## ⚙️ Tech Stack

- GitHub Actions
- Bash scripting
- jq (JSON processing)
- GitHub API
- Telegram Bot API

---

## 🔐 Environment Variables

Required secrets:

TELEGRAM_TOKEN, TELEGRAM_CHANNEL_ID, ACTIVITY_GITHUB_TOKEN

---

## 🧩 Future Ideas

- Memory system (track streak & behavior history)
- Personality shift based on consistency
- Weekly summary recap
- Adaptive message tone system
- Burnout detection mode

---

## 💜 Philosophy

This project is built around one simple idea:

> Consistency is not about pressure, but about returning.

Even small progress matters. Even pauses are part of the process.

---

## 🌙 Author

Built with automation, curiosity, and a quiet obsession with consistency.