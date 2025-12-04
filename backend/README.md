# SmartSync Backend Documentation

## Overview
This is the backend for the SmartSync food delivery application, built with Django and Django REST Framework. It handles user authentication, data management, and API responses for the frontend.

## Prerequisites
- Python 3.8+
- pip (Python package manager)

## Installation

1.  **Clone the repository** (if applicable) or navigate to the `backend` directory.
2.  **Create a virtual environment** (recommended):
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```
3.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

## Configuration
The project settings are located in `smartsync_backend/settings.py`.

### Key Settings
-   **INSTALLED_APPS**: Includes `rest_framework`, `djoser`, `rest_framework_simplejwt`, `corsheaders`, and `core`.
-   **REST_FRAMEWORK**: Configured to use `JWTAuthentication`.
-   **DJOSER**: Configured for user management (registration, login).
-   **CORS_ALLOWED_ORIGINS**: Allows requests from `http://localhost:5173` (React frontend).

## Running the Server

1.  **Apply migrations**:
    ```bash
    python manage.py migrate
    ```
2.  **Start the development server**:
    ```bash
    python manage.py runserver
    ```
    The server will start at `http://127.0.0.1:8000/`.

## API Endpoints

### Authentication (Djoser & JWT)
-   **Register User**: `POST /auth/users/`
    -   Payload: `{ "username": "...", "email": "...", "password": "...", "re_password": "..." }`
-   **Login (Get Token)**: `POST /auth/jwt/create/`
    -   Payload: `{ "username": "...", "password": "..." }`
    -   Response: `{ "access": "...", "refresh": "..." }`
-   **Refresh Token**: `POST /auth/jwt/refresh/`
    -   Payload: `{ "refresh": "..." }`

### Core
-   **Home**: `GET /`
    -   Response: `{ "message": "Hello World from Django!" }`

## Project Structure
```
backend/
├── core/                   # Core application (views, models)
├── smartsync_backend/      # Project configuration (settings, urls)
├── manage.py               # Django management script
├── requirements.txt        # Project dependencies
└── db.sqlite3              # SQLite database (default)
```
