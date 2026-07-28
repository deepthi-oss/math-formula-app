# Math Formula App — Project History

## 📋 Project Overview
- **App Name:** Math Formula App
- **Live URL:** https://math-formula-app.vercel.app
- **GitHub:** https://github.com/deepthi-oss/math-formula-app
- **Stack:** React + Vite + react-router-dom
- **Hosting:** Vercel (free Hobby plan)
- **Built by:** Deepthi (CBSE High School Math Teacher, Grades 8–12)

---

## ✅ Features Built

### 1. Home Page
- Colorful landing page with animated floating shapes
- 4 feature cards: Formula Explorer, Identity Challenge, Myth Math Challenge, Tug of War
- "Let's Go 🚀" button navigates to Formula Explorer

### 2. Formula Explorer
- 3 sector tabs: Arithmetic, Algebra, Geometry
- 4th tab: Myth Math Challenge (embedded)
- Grade tabs per sector (Arithmetic: Class 1–12, Algebra: Class 6–12, Geometry: Class 3–12)
- Bulleted formula list per grade

### 3. Identity Challenge
- 2-player split screen (same device)
- Phase 1: 30 seconds to write answer on canvas
- Phase 2: 20 seconds to type answer — auto-judged
- 8 algebraic identities (Identity 1–8)
- Winner screen at end

### 4. Myth Math Challenge
- Sector tabs + grade tabs
- Teacher picks active question from dropdown
- Two whiteboards with draw canvas
- Sides / Corners / Angles input fields with auto-check
- 60 second timer (auto-starts, stops when correct)
- Team scoreboard — add any number of teams, auto +1 on correct

### 5. Tug of War
- Setup screen: pick topic + game mode + BOT difficulty
- Topics: Addition, Subtraction, Multiplication, Division, Formulas
- Game modes: 2 Players OR vs BOT
- BOT difficulty: Easy / Medium / Hard
- Split screen with numpad + keyboard toggle
- Animated rope moves left/right based on scores
- 60 second timer, winner declared at end

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Routing: /, /explore, /challenge, /tug |
| `src/Home.jsx` | Home page |
| `src/FormulaExplorer.jsx` | Formula reference + Myth Math tab |
| `src/IdentityChallenge.jsx` | 2-player identity game |
| `src/MythMathChallenge.jsx` | Team whiteboard activity |
| `src/TugOfWar.jsx` | Tug of War game with BOT |
| `src/formulaConfig.js` | Shared formula data and grade ranges |
| `src/App.css` | All styles |

---

## 📚 Formula Content Added

### Geometry — Class 3
- 2D Shapes: Circle, Oval, Square, Rectangle, Pentagon, Hexagon, Octagon, Nonagon, Decagon, Parallelogram, Rhombus
- 3D Shapes: Cone, Cube, Cuboid, Cylinder, Sphere, Prism

### Arithmetic — ⏳ Not yet added
### Algebra — ⏳ Not yet added

---

## ⏳ Pending / Planned

- [ ] Add BOT to Identity Challenge
- [ ] Add BOT to Myth Math Challenge
- [ ] Add AI Tutor BOT to Formula Explorer
- [ ] Add Quick Practice BOT on Home Page
- [ ] Add formula content for Arithmetic (all grades)
- [ ] Add formula content for Algebra (Class 6–12)
- [ ] Add formula content for Geometry (Class 4–12)
- [ ] Add Tug of War formula questions (Deepthi to provide)

---

## 📝 Change Log

| Date | Change |
|------|--------|
| Jun 2026 | Project started — React/Vite setup, GitHub + Vercel deployment |
| Jun 2026 | Formula Explorer built with sector + grade tabs |
| Jun 2026 | Identity Challenge built — 2-player handwriting + auto-judge |
| Jun 2026 | Myth Math Challenge built — whiteboards + timer + scoreboard |
| Jul 2026 | Tug of War built — split screen + BOT + animated rope |
| Jul 2026 | Full UI redesign — bright colorful student-oriented theme |
| Jul 2026 | Topic selector added to Tug of War (5 categories) |
| Jul 2026 | Keyboard toggle added to Tug of War numpad |
| Jul 2026 | PROJECT_HISTORY.md created |