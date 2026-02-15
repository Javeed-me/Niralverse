# 🐞 Bug Hunt – Debugging Event Platform

Bug Hunt is a lightweight web-based platform designed to conduct live **debugging competitions** in coding events and hackathons.

Participants receive buggy code snippets, debug them, run programs, and submit outputs. The platform records results automatically for evaluation.

The system is designed to run entirely on lightweight technologies and free deployment platforms.

---

## 🚀 Features

### ✅ Multi-language Debugging
Participants can debug problems in:

- Python
- C++
- Java

Each language includes:
- Easy
- Medium
- Hard level problems.

---

### ✅ Built-in Online Code Editor
The platform integrates an in-browser code editor allowing participants to:

- View buggy starter code
- Edit and debug code
- Run code
- View output instantly
- Submit results

---

### ✅ Online Compilation & Execution
Code execution happens online using an execution API, allowing:

- Compilation
- Runtime execution
- Output/error display

No local compiler setup required.

---

### ✅ Automatic Submission Storage
Submitted outputs are automatically stored in **Google Sheets backend**, including:

- Timestamp
- Participant Name
- Email
- Team Name
- College Name
- Selected Language
- Problem outputs

This allows easy judging and scoring.

---

### ✅ Anti-Malpractice Controls
The platform includes protections against cheating:

- Tab/window switch detection
- Violation counter
- Auto-submit on violation limit breach
- Full-screen enforcement
- Session locking after submission
- Copy-paste & right-click restrictions
- Duplicate email prevention

---

### ✅ Auto Submit System
Participants are auto-submitted when:

- Time limit expires
- Violation count exceeds limit

Only completed problems are recorded.

---

### ✅ Lightweight & Deployable Anywhere
Stack used:

- HTML
- CSS
- Vanilla JavaScript
- Monaco Editor
- Google Apps Script backend
- Static hosting (Vercel / GitHub Pages)

No heavy backend required.

---

## 🧠 Event Flow

