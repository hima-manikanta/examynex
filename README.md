---

## ✨ Features

### 🎥 Webcam Proctoring
- Face detection using OpenCV
- Multiple face detection
- Left seat detection
- Camera covered detection
- Identity verification (anti-impersonation)

### 🎙️ Audio Monitoring
- Real-time microphone monitoring
- Talking detection during exams

### 🖥️ Browser & UI Monitoring
- Tab switch detection
- Window blur detection
- Fullscreen exit detection

### ⚠️ Violation Escalation System
- Progressive warnings
- Final warning system
- Automatic exam termination after repeated violations

### 📄 Proctoring Reports
- Detailed violation logs
- Auto-generated PDF reports
- Cheating score and risk level assessment

### 🔐 Secure Backend
- JWT authentication
- Role-based access (Admin / Student)
- HTTPS-ready deployment
- WebSocket support for real-time admin monitoring

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite / PostgreSQL
- JWT Authentication

### AI & Computer Vision
- OpenCV
- face_recognition
- NumPy

### Real-Time Communication
- WebSockets

### Deployment
- Render (Free Tier)
- Cloudflare Tunnel (for HTTPS webcam & mic support)

---

## 📂 Project Structure

# 🚀 Examynex
### AI-Powered Online Examination System with Real-Time Proctoring

**Examynex** is an AI-driven online examination platform designed to ensure exam integrity through real-time webcam, microphone, and user activity monitoring. The system detects suspicious behavior such as impersonation, talking, tab switching, and absence from the screen, making online exams secure and reliable.

---

## ✨ Features

### 🎥 Webcam Proctoring
- Face detection using OpenCV
- Multiple face detection
- Left seat detection
- Camera covered detection
- Identity verification (anti-impersonation)

### 🎙️ Audio Monitoring
- Real-time microphone monitoring
- Talking detection during exams

### 🖥️ Browser & UI Monitoring
- Tab switch detection
- Window blur detection
- Fullscreen exit detection

### ⚠️ Violation Escalation System
- Progressive warnings
- Final warning system
- Automatic exam termination after repeated violations

### 📄 Proctoring Reports
- Detailed violation logs
- Auto-generated PDF reports
- Cheating score and risk level assessment

### 🔐 Secure Backend
- JWT authentication
- Role-based access (Admin / Student)
- HTTPS-ready deployment
- WebSocket support for real-time admin monitoring

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite / PostgreSQL
- JWT Authentication

### AI & Computer Vision
- OpenCV
- face_recognition
- NumPy

### Real-Time Communication
- WebSockets

### Deployment
- Render (Free Tier)
- Cloudflare Tunnel (for HTTPS webcam & mic support)

---

## 📂 Project Structure

# 🚀 Examynex
### AI-Powered Online Examination System with Real-Time Proctoring

**Examynex** is an AI-driven online examination platform designed to ensure exam integrity through real-time webcam, microphone, and user activity monitoring. The system detects suspicious behavior such as impersonation, talking, tab switching, and absence from the screen, making online exams secure and reliable.

---

## ✨ Features

### 🎥 Webcam Proctoring
- Face detection using OpenCV
- Multiple face detection
- Left seat detection
- Camera covered detection
- Identity verification (anti-impersonation)

### 🎙️ Audio Monitoring
- Real-time microphone monitoring
- Talking detection during exams

### 🖥️ Browser & UI Monitoring
- Tab switch detection
- Window blur detection
- Fullscreen exit detection

### ⚠️ Violation Escalation System
- Progressive warnings
- Final warning system
- Automatic exam termination after repeated violations

### 📄 Proctoring Reports
- Detailed violation logs
- Auto-generated PDF reports
- Cheating score and risk level assessment

### 🔐 Secure Backend
- JWT authentication
- Role-based access (Admin / Student)
- HTTPS-ready deployment
- WebSocket support for real-time admin monitoring

---

## 🛠️ Tech Stack

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite / PostgreSQL
- JWT Authentication

### AI & Computer Vision
- OpenCV
- face_recognition
- NumPy

### Real-Time Communication
- WebSockets

### Deployment
- Render (Free Tier)
- Cloudflare Tunnel (for HTTPS webcam & mic support)

---

## 📂 Project Structure

examynex/
├── Documentation & Config Files/
│   ├── ARCHITECTURE.md
│   ├── CHANGES_SUMMARY.md
│   ├── DOCUMENTATION_INDEX.md
│   ├── FEATURE_MAPPING.md
│   ├── IMPLEMENTATION_COMPLETE.md
│   ├── PROJECT_COMPLETE.md
│   ├── PROJECT_COMPLETION_CHECKLIST.md
│   ├── PROJECT_OVERVIEW.md
│   ├── PROJECT_STATUS.md
│   ├── QUICKSTART.md
│   ├── QUICK_REFERENCE.md
│   ├── README.md
│   ├── README_NEW.md
│   ├── SESSION_COMPLETE.md
│   ├── SETUP_GUIDE.md
│   ├── STARTUP_GUIDE.md
│   ├── docker-compose.yml
│   ├── package.json
│   ├── package-lock.json
│   ├── requirements.txt
│   ├── render.yaml
│   └── backend.zip
│
├── .github/
│   └── copilot-instructions.md
│
├── backend/
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── requirements.txt
│   ├── reset_db.bat
│   ├── reset_db.sh
│   ├── run_and_debug.txt
│   ├── start_server.bat
│   ├── start_server.sh
│   └── app/
│       ├── __init__.py
│       ├── auth.py
│       ├── database.py
│       ├── dependencies.py
│       ├── main.py
│       ├── models.py
│       ├── models_proctor.py
│       ├── proctor.py
│       ├── schemas.py
│       ├── routes/
│       │   ├── exam.py
│       │   ├── proctor.py
│       │   ├── question.py
│       │   ├── submission.py
│       │   └── user.py
│       └── services/
│           └── face_utils.py
│
└── frontend/
    ├── admin-add-question.html
    ├── admin-create-exam.html
    ├── admin-dashboard.html
    ├── admin-monitor.html
    ├── admin-submissions.html
    ├── config.js
    ├── dashboard.html
    ├── exam-results.html
    ├── exam-taking.html
    ├── index.html
    ├── login.html
    ├── register.html
    ├── student-dashboard.html
    ├── student-profile.html
    └── styles.css
