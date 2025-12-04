# SmartSync API Documentation

**Base URL**: `http://127.0.0.1:8000/`

## Authentication
The API uses **JWT (JSON Web Token)** authentication.
To access protected endpoints, include the `Authorization` header:
```
Authorization: JWT <access_token>
```

## Endpoints

### 1. User Registration (Signup)
Create a new user account.

-   **URL**: `/auth/users/`
-   **Method**: `POST`
-   **Content-Type**: `application/json`
-   **Body Parameters**:
    | Parameter | Type | Required | Description |
    | :--- | :--- | :--- | :--- |
    | `username` | string | Yes | Unique username |
    | `email` | string | Yes | Valid email address |
    | `password` | string | Yes | Password (min 8 chars) |
    | `re_password` | string | Yes | Password confirmation |

-   **Success Response (201 Created)**:
    ```json
    {
        "email": "user@example.com",
        "username": "newuser",
        "id": 1
    }
    ```
-   **Error Response (400 Bad Request)**:
    ```json
    {
        "username": ["A user with that username already exists."],
        "password": ["This password is too short. It must contain at least 8 characters."]
    }
    ```

### 2. Login (Obtain Token)
Authenticate a user and receive access and refresh tokens.

-   **URL**: `/auth/jwt/create/`
-   **Method**: `POST`
-   **Content-Type**: `application/json`
-   **Body Parameters**:
    | Parameter | Type | Required | Description |
    | :--- | :--- | :--- | :--- |
    | `username` | string | Yes | User's username |
    | `password` | string | Yes | User's password |

-   **Success Response (200 OK)**:
    ```json
    {
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
    ```
-   **Error Response (401 Unauthorized)**:
    ```json
    {
        "detail": "No active account found with the given credentials"
    }
    ```

### 3. Refresh Token
Obtain a new access token using a valid refresh token.

-   **URL**: `/auth/jwt/refresh/`
-   **Method**: `POST`
-   **Content-Type**: `application/json`
-   **Body Parameters**:
    | Parameter | Type | Required | Description |
    | :--- | :--- | :--- | :--- |
    | `refresh` | string | Yes | The refresh token obtained during login |

-   **Success Response (200 OK)**:
    ```json
    {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
    }
    ```

### 4. Home (Test Endpoint)
A simple endpoint to verify backend connectivity.

-   **URL**: `/`
-   **Method**: `GET`
-   **Authentication**: None required
-   **Success Response (200 OK)**:
    ```json
    {
        "message": "Hello World from Django!"
    }
    ```
