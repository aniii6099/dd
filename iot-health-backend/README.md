# IoT Health Backend

This is the backend service for the IoT Health project, built with [FastAPI](https://fastapi.tiangolo.com/). It handles data processing, API endpoints, and database interactions, utilizing MongoDB and Machine Learning libraries.

## Prerequisites
- [Python 3.8+](https://www.python.org/)
- MongoDB (running locally or a cluster URL)

## Setup & Installation

1. Navigate to the backend directory:
   ```bash
   cd iot-health-backend
   ```

2. (Optional but recommended) Create and activate a Python virtual environment:
   - On Windows:
     ```bash
     python -m venv venv
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Environment Variables:
   Create a `.env` file in the root of the backend directory and configure your environment variables (e.g., MongoDB URI). For example:
   ```env
   # Add your environment variables here
   PORT=8000
   ```

## Running the Application

To start the FastAPI development server with auto-reload:
```bash
uvicorn main:app --reload
```
By default, the server will be available at `http://127.0.0.1:8000`.
You can access the interactive API documentation (Swagger UI) at `http://127.0.0.1:8000/docs`.
