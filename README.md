# Build Applications with GitHub Copilot Agent Mode

<img src="https://octodex.github.com/images/Professortocat_v2.png" align="right" height="200px" />

Hey JhonyVargas!

Mona here. I'm done preparing your exercise. Hope you enjoy! 💚

Remember, it's self-paced so feel free to take a break! ☕️

[![](https://img.shields.io/badge/Go%20to%20Exercise-%E2%86%92-1f883d?style=for-the-badge&logo=github&labelColor=197935)](https://github.com/UPT-FAING-EPIS/VargasLuque_skills-build-applications-w-copilot-agent-mode/issues/1)

---

## OctoFit Tracker App

A new full-stack fitness tracker app has been added under `octofit-tracker/`.

### Backend

- Django + Django REST Framework
- API endpoints for students, activities, teams, leaderboard, and summary
- Seeded sample students, teams, and activities automatically after migration

### Frontend

- React + Vite
- Runs on port `3000`
- Connects to backend API on `http://127.0.0.1:8000`

### Setup

1. Create the backend virtual environment:
   ```bash
   python -m venv octofit-tracker/backend/venv
   ```
2. Install backend requirements:
   ```bash
   octofit-tracker/backend/venv/Scripts/python -m pip install -r octofit-tracker/backend/requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   npm install --prefix octofit-tracker/frontend
   ```

### Run locally

1. Run Django migrations and start the backend:
   ```bash
   octofit-tracker/backend/venv/Scripts/python octofit-tracker/backend/manage.py migrate
   octofit-tracker/backend/venv/Scripts/python octofit-tracker/backend/manage.py runserver 0.0.0.0:8000
   ```
2. Start the frontend dev server:
   ```bash
   npm run dev --prefix octofit-tracker/frontend
   ```
3. Open the app in your browser:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000/api/`

&copy; 2025 GitHub &bull; [Code of Conduct](https://www.contributor-covenant.org/version/2/1/code_of_conduct/code_of_conduct.md) &bull; [MIT License](https://gh.io/mit)

