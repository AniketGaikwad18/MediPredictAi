# MediPredict AI — Setup Guide

## Quick Start (Frontend Only — Demo Mode)

The frontend works on its own without the backend. Registration, login, symptom prediction and reports all work using **local browser storage** in Demo Mode.

```bash
cd frontend
npm install
npm run dev
```

Open → http://localhost:3000

---

## Full Stack Setup (with Real ML & Database)

### 1. Python Environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
```

### 2. MongoDB

Install MongoDB Community Edition: https://www.mongodb.com/try/download/community  
Start the service:
```bash
mongod --dbpath C:\data\db
```

### 3. Generate Dataset & Train Model

```bash
cd backend
python ml/dataset/generate_mock_data.py
python ml/train_model.py
```

### 4. Configure Email (Optional)

Edit `backend/.env`:
```
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_DEFAULT_SENDER=your_gmail@gmail.com
```
> For Gmail: Enable 2FA → Generate an App Password → use that as `MAIL_PASSWORD`

### 5. Start Backend

```bash
cd backend
python app.py
```

API runs at → http://localhost:5000

### 6. Start Frontend

```bash
cd frontend
npm run dev
```

Open → http://localhost:3000

---

## Project Structure

```
Disease Project/
├── frontend/              # Next.js 14 + Tailwind CSS
│   ├── app/
│   │   ├── page.tsx           # Login / Register
│   │   └── dashboard/
│   │       ├── page.tsx           # Dashboard Home
│   │       ├── symptom-checker/   # Symptom Input + Results
│   │       ├── reports/           # Prediction History
│   │       ├── health-tips/       # Wellness Guide
│   │       └── profile/           # User Profile
│   └── lib/api.ts             # API client with demo fallback
│
└── backend/               # Python Flask API
    ├── app.py             # Main Flask app
    ├── config.py          # Configuration
    ├── models.py          # MongoDB models
    ├── routes/
    │   ├── auth.py        # JWT auth endpoints
    │   ├── predict.py     # ML prediction endpoint
    │   └── reports.py     # Report history endpoint
    ├── ml/
    │   ├── train_model.py # Model training (Random Forest)
    │   └── predict.py     # Prediction logic
    └── utils/
        └── email_service.py  # HTML email reports
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Python Flask, JWT, bcrypt |
| ML | Scikit-learn (Random Forest) |
| Database | MongoDB |
| Email | Gmail SMTP |
