# Pydantic AI Server

A real-time chat application that combines FastAPI, React, and AI capabilities using [pydantic-ai](https://ai.pydantic.dev/).

## Features

- Real-time streaming chat interface
- AI-powered responses using GPT models
- Modern React frontend with responsive design
- FastAPI backend with Pydantic validation
- Docker containerization for easy deployment

## Prerequisites

- Docker and Docker Compose
- Node.js 22+ (for local development)
- Python 3.11+ (for local development)
- OpenAI API key

## Quick Start

1. Clone the repository
2. Create a `.env` file in the root directory with:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

3. Start the application:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Development Setup

### Backend

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
   or
   ```bash
   conda create -n pydantic-ai-server python=3.11
   conda activate pydantic-ai-server
   pip install -r backend/requirements.txt
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

### Running the application

```bash
docker-compose up --build
```
