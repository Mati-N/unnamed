# Project Title

A brief description of the project and its purpose.

## Backend Setup

1. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. **Install Python dependencies:**
   ```bash
   pip install pipenv
   pipenv install
   ```
3. **Run database migrations:**
   ```bash
   python manage.py migrate
   ```
4. **Run the Django development server:**
   ```bash
   python manage.py runserver
   ```

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```
3. **Build the frontend:**
   ```bash
   npm run build
   ```
   Alternatively, for development with live reloading:
   ```bash
   npm run dev
   ```

## Running the Project Locally

To run the project locally, you'll need to have both the backend and frontend development servers running.

1. **Start the Django backend server:**
   Open a terminal in the project root directory and run:
   ```bash
   python manage.py runserver
   ```
   The backend will typically be available at `http://127.0.0.1:8000/`.

2. **Start the frontend development server:**
   Open another terminal, navigate to the `frontend` directory, and run:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will typically be available at `http://localhost:8080/` and will proxy API requests to the Django backend.

Now you should be able to access the application in your browser at the address provided by the frontend development server.

## Other Useful Information

### Technology Stack

*   **Backend:** Django, Django REST framework, Graphene-Django (for GraphQL)
*   **Frontend:** React, Apollo Client
*   **Database:** PostgreSQL (configured for Heroku, adaptable for local development)
*   **Dependency Management:** Pipenv (Python), npm (Node.js)

### Project Structure

*   `api/`: Contains the Django app for the backend API (models, views, GraphQL schema).
*   `frontend/`: Contains the React frontend application.
*   `feel/`: Contains the main Django project settings and configuration.
*   `manage.py`: Django's command-line utility.
*   `Pipfile`, `Pipfile.lock`: Python dependencies.
*   `frontend/package.json`, `frontend/package-lock.json`: Node.js dependencies.
*   `requirements.txt`: Heroku deployment dependency list (generated from Pipfile).
