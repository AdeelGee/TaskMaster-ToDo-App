# TaskMaster — Offline To-Do List App

A simple, offline-first To-Do list app built with **Expo + React Native + TypeScript**.
Built for testing in **Expo Go**.

## ✨ Features

- **One-time name entry** — asked only on the very first launch (saved with AsyncStorage)
- **Gray theme** with white text, simple and clean UI
- **Add / Edit / Delete tasks** with title, description, priority (High/Medium/Low) and category
- **Deadline picker** — pick a date from a calendar and a time from a clock
- **Live countdown timer** on every task with a progress bar
- **Offline local notification** — "Only 15 minutes left, Hurry up!" sent 15 minutes before the deadline.
  Works fully offline — even in **Airplane Mode** or **Silent Mode** (local notifications don't need internet/signal)
- **Congratulations popup** when a task is completed, with an "OK — Add Next Task" button
- **Points system**:
  - Completed 15+ minutes before deadline → **+15 points**
  - Completed on time → **+10 points**
  - Completed after deadline → **+5 points**
  - No deadline set → **+10 points**
- **Daily streak counter** 🔥
- **100% Offline** — all data is stored locally with AsyncStorage, no internet/server required

## 🚀 How to Run (Expo Go)

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Recommended) Make sure all native packages match your Expo SDK version:
   ```bash
   npx expo install --fix
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Open the **Expo Go** app on your Android phone and scan the QR code shown in the terminal.

> ⚠️ Notification permission: when the app opens for the first time, allow the
> "Notifications" permission prompt — this is required for the 15-minute reminder
> to work.

## 📁 Project Structure

```
app/
  _layout.tsx        → Root navigation layout
  index.tsx          → Main app screen (loading, name entry, dashboard)
components/
  LoadingScreen.tsx   → Splash/loading screen
  NameEntryScreen.tsx → One-time "Enter your Name" screen
  TaskCard.tsx        → Task card with countdown timer
  AddTaskModal.tsx    → Add/Edit task form with calendar + clock picker
  CongratsModal.tsx   → "Congratulations!" popup
constants/
  colors.ts           → App color theme (gray + white)
utils/
  types.ts            → TypeScript types
  storage.ts          → AsyncStorage save/load helpers
  notifications.ts    → Local notification scheduling (15-min reminder)
```

## 🧪 Testing Checklist

1. Open the app → Loading screen appears for ~2 seconds
2. First time → "Enter your Name" screen appears → type your name → tap "Get Started"
3. Close and reopen the app → it goes **straight to the Dashboard** (name screen is skipped)
4. Tap **"+ Add New Task"**
5. Fill in title, description, choose priority & category
6. Tap the date field → pick a date from the calendar
7. Tap the time field → pick a time from the clock
8. Save the task → it appears on the dashboard with a live countdown timer
9. Turn on **Airplane Mode** and/or **Silent Mode** — wait for the 15-minute mark →
   you should still get the "Only 15 minutes left, Hurry up!" notification
10. Tap the circle on a task to mark it complete →
    "Congratulations! You successfully complete your task!" popup appears with points earned
11. Tap **OK — Add Next Task** → Add Task form opens again
12. Check your **Points** and **Streak** at the top of the dashboard
