# Week 1 Verification Checklist

## Infra
- [ ] `infra/docker-compose.yml` defines `db` (Postgres) and `backend` services
- [ ] `db` has credentials and healthcheck
- [ ] `backend` builds from `backend/Dockerfile` and maps port 8000

## Backend Stub
- [ ] FastAPI app returns 200 for `/health`
- [ ] `uvicorn` starts on port 8000
- [ ] `/docs` renders Swagger UI

## CI
- [ ] Workflow file at `.github/workflows/ci.yml`
- [ ] Lint job installs deps and runs ruff/black
- [ ] Docker build job succeeds

## Acceptance
- [ ] `docker compose up` (from `infra/`) starts both services
- [ ] Mentor can open http://localhost:8000/docs
