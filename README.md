# 🧠 Personal Life Dashboard

A minimal but powerful **personal life tracking dashboard** built with Next.js 15, TailwindCSS v4, and Recharts. Track everything that matters — sleep, study, coding, workouts, habits, mood, money, social metrics, and daily notes — all in one beautiful dark UI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06b6d4?logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-charting-34d399)

---

## ✨ Features

| Module | Description |
|---|---|
| 😴 **Sleep** | Log sleep hours with quality tracking |
| 📚 **Study** | Track study sessions with weekly bar chart |
| 💻 **Coding** | Live timer + manual entry, weekly chart |
| 🏋️ **Gym** | Workout toggle with notes |
| ✅ **Habits** | 6 daily habits with streak tracking |
| 😊 **Mood** | Emoji-based mood logging |
| 💰 **Money** | Earned vs spent tracker |
| 📱 **Social** | YT views, subscribers, IG views & followers |
| 📝 **Notes** | Daily brain dump with auto-save |
| 📊 **Analytics** | 14-day overview charts for all metrics |

### Extra
- ⚡ **Live productivity score** (0–100) with animated ring in header
- 🕐 **Live clock** in header
- 🎯 **Daily goal progress** per card
- 🔥 **Streak tracking** for habits
- 💾 **Persistent data** via localStorage (no backend needed)
- 🌙 **Deep navy ocean dark theme** with electric cyan accents

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Krushang004/personal-dashbard.git
cd personal-dashbard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 Tech Stack

- **[Next.js 15](https://nextjs.org/)** — App Router, React Server Components
- **[TailwindCSS v4](https://tailwindcss.com/)** — Utility-first CSS with `@theme` tokens
- **[Recharts](https://recharts.org/)** — Composable charting library
- **[Lucide React](https://lucide.dev/)** — Clean icon set
- **[date-fns](https://date-fns.org/)** — Date utility functions
- **localStorage** — Client-side data persistence

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css        # Theme tokens & global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main dashboard page
├── components/
│   └── dashboard/
│       ├── Header.tsx         # Sticky header with score ring & live clock
│       ├── SleepCard.tsx      # Sleep tracker
│       ├── StudyCard.tsx      # Study tracker
│       ├── CodingCard.tsx     # Coding timer + tracker
│       ├── GymCard.tsx        # Workout tracker
│       ├── HabitsCard.tsx     # Habit checklist with streaks
│       ├── MoodCard.tsx       # Mood selector
│       ├── MoneyCard.tsx      # Money tracker
│       ├── SocialCard.tsx     # Social metrics
│       ├── NotesCard.tsx      # Daily notes (auto-save)
│       └── AnalyticsPage.tsx  # 14-day analytics overlay
├── hooks/
│   └── useLocalStorage.ts     # Persistent state hook
└── utils/
    ├── types.ts               # TypeScript types & productivity score
    └── dateUtils.ts           # Date helpers
```

---

## 🎨 Color Theme

The dashboard uses a custom **electric cyan + deep navy ocean** palette:

| Token | Value | Use |
|---|---|---|
| Accent | `#06b6d4` | Primary actions, icons |
| Accent Light | `#22d3ee` | Hover states, timer |
| Background | `#050d1a` | Page background |
| Card | `#0d1e30` | Card surfaces |
| Green | `#34d399` | Success, study |
| Text | `#e2f4ff` | Primary text |

---

## 📸 Screenshots

> Dashboard in action — track your entire day at a glance.

---

## 🤝 Contributing

This is a personal project, but PRs and suggestions are welcome!

---

## 📄 License

MIT © [Krushang004](https://github.com/Krushang004)
