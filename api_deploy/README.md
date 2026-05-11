# MiniAssignment

This repository contains a simple Express REST API with JWT authentication, Docker containerization, unit tests, and a GitHub Actions CI workflow.

## Endpoints

- `POST /login` - authenticates a user and returns a JWT token.
- `GET /public` - public endpoint that does not require authentication.
- `GET /tasks` - protected route that returns task data and requires a valid `Authorization: Bearer <token>` header.
- `GET /status` - optional health/status endpoint.

## Run Locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the API:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000/public` or use `POST /login` to get a token.

## Run Tests

```bash
npm test
```

## Docker

Build the Docker image:

```bash
docker build -t miniassignment-api .
```

Run the container:

```bash
docker run -p 3000:3000 miniassignment-api
```

## Swagger Documentation

Open the Swagger UI in your browser after starting the app:

```bash
http://localhost:3000/api-docs
```

## CI/CD

A GitHub Actions workflow is defined in `.github/workflows/ci.yml`. It installs dependencies, runs unit tests, and builds the Docker image on push or pull request.

