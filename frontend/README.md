# 🚀 Smart India Hackathon 2025 — Frontend Portal

![React](https://img.shields.io/badge/React-17.0.2-blue?logo=react)
![License](https://img.shields.io/badge/License-MIT-green)
![Language](https://img.shields.io/badge/Language-JavaScript-yellow)

---

## 📌 Project Overview

**Smart India Hackathon 2025 Portal (Frontend)** is a fully responsive React.js application that simulates the UI and interaction flow of the official SIH portal.

This project demonstrates:

- Problem browsing
- Detailed problem viewing
- Team application submission
- Form validation
- Confirmation logic
- Structured routing
- Professional government-style UI

---

## 📂 Features

### 🔍 Problem Statements
- Lists all problem statements
- Clickable titles navigate to detailed views
- Displays metadata:
  - Organization
  - Theme
  - Category
  - Deadline

---

### ✍️ Apply System
- Only **Team Leader** users can apply
- Maximum **5 team members**
- All member fields are mandatory
- Abstract input with character limit
- PPT upload support (`.ppt` & `.pptx` only)
- Dynamic route navigation

---

### ✔️ Confirmation Page
- Displays submitted team details
- Shows abstract content
- Confirms successful submission

---

### 🏛️ UI & Experience
- Government portal styling (inspired by SIH)
- Horizontal theme slider with arrow navigation
- Clean card-based layout
- Structured typography
- Fully responsive design

---

## 🧰 Tech Stack

| Technology | Usage |
|------------|--------|
| React.js | UI Components |
| React Router DOM | Client-side routing |
| CSS | Styling & Layout |
| JavaScript (ES6) | Application Logic |

---

## 📁 Project Structure

```
src/
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   └── ThemeCard.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── ProblemStatements.jsx
│   ├── ProblemDetails.jsx
│   ├── Application.jsx
│   └── Confirmation.jsx
│
├── sections/
│   ├── AboutSection.jsx
│   ├── GuidelinesSection.jsx
│   ├── FAQSection.jsx
│   └── ContactSection.jsx
│
├── data/
│   └── problemData.js
│
├── images/
│   └── sih.png
│
├── App.js
└── index.js
```

---

## 🛠 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SIH-React.git
```

### 2. Navigate into the Folder

```bash
cd SIH-React
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm start
```

The app will run at:

```
http://localhost:3000
```

---

## 🧠 Application Flow

<img width="2250" height="525" alt="mermaid-diagram" src="https://github.com/user-attachments/assets/4d1f11b4-f0e0-4a00-8f7c-f41d743c3319" />


---
## output images
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/633c524a-88ce-402e-a494-f6cf45b7af7c" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/4ea617e9-9be4-4243-8189-2835869b21af" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/fcfaeffc-b87a-4604-9599-19c1cce95a16" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a424a35a-744c-46e8-8ba2-96da771a818c" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/96e76adc-6919-482b-ba27-7f844d3a1ff4" />
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/646980f4-5be8-43fb-af6d-787035989546" />


---
## VIDEO OUTPUT

https://github.com/user-attachments/assets/bbc9c21f-4d44-4cf0-be9a-ec67a0fece67


---


## 📜 Validation Rules

| Rule | Description |
|------|-------------|
| Role | Only Team Leader can access Apply form |
| Members | Minimum 1, Maximum 5 members |
| Fields | All input fields required |
| Abstract | Must not be empty |
| File | Only `.ppt` / `.pptx` allowed |

---

## 🧩 Future Enhancements

- Backend Integration (Node.js / Express / Firebase)
- Database storage for submissions
- Role-based authentication
- Admin dashboard
- Real API integration
- Cloud deployment (Netlify / Vercel)

---

## 📄 License

This project is licensed under the MIT License.
