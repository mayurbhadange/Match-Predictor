# ⚽ EPL Match Outcome Predictor

An AI-powered fullstack web application that predicts the outcome of English Premier League matches using historical data and machine learning.

---

## 📂 Project Structure
/workspace/
│
├── matches.csv, matchesYT.csv # Historical match data
├── Untitled.ipynb # Jupyter notebook for prototyping
│
├── /Backend/ # Flask backend
│ ├── app.py # Main backend application
│ └── matchesYT.csv # Training data
│
└── /project/ # React + Vite + Tailwind frontend
├── index.html
├── package.json
├── tsconfig.json
└── /src/ # Main frontend logic (TypeScript)
---

## 🔙 Backend

- **Framework**: Flask (Python)
- **ML Model**: Random Forest Classifier (scikit-learn)
- **Libraries**: `pandas`, `numpy`, `scikit-learn`, `flask`, `flask_cors`

### 🔗 Endpoints

- `GET /` – Health check ("Server Started!")
- `POST /predict` – Accepts match input, trains model on-the-fly, returns result (`0`: Draw, `1`: Home Win, `2`: Away Win)

---

## 🖥️ Frontend

- **Framework**: React (Vite + TypeScript)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

### 🎮 Features

- Select teams, venue, formation, date, time
- Click **Predict** → Calls backend `/predict` endpoint
- Displays predicted match result (Home Win, Away Win, Draw)

---

## 🚀 Workflow

1. User enters match details in frontend.
2. Frontend sends POST request to `/predict`.
3. Backend trains model on recent data and returns prediction.
4. Frontend displays the result.

---

## 🧠 Model Inputs

- Teams (Home & Away)
- Match Venue
- Opponent Strength
- Team Formation
- Rolling averages from historical matches

---

## 📦 Getting Started

### Backend
```bash
cd Backend
pip install -r requirements.txt
python app.py

### Frontend
```bash

cd project
npm install
npm run dev