# platform-app

Application repository for Platform Starter Kit.

## Scope
- `backend`: Spring Boot API
- `frontend`: React Web
- `docker-compose.yml`: local MariaDB/API/Web integration
- `Jenkinsfile`: CI pipeline entrypoint

## Local Run
```bash
docker compose up --build -d
```

## Verification
```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/api/tasks
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Verify Day 2 compose flow"}'
```

Open the web UI:

```text
http://localhost:3000
```

## Local Stop
```bash
docker compose down
```

Use this if you also want to remove the MariaDB volume:

```bash
docker compose down -v
```

## CI Responsibilities
- Run backend tests
- Build frontend static assets
- Build backend and frontend container images
- Push images to GHCR

Deploy repo image tag updates are handled in Day 4 or later.

## Jenkins Requirements
The Jenkins agent that runs this repository must have access to:

```bash
git --version
docker --version
java -version
node --version
npm --version
docker ps
```

`docker ps` must succeed because the pipeline builds and pushes container images.

## Jenkins Credential
Create this credential before running the pipeline:

- Kind: `Username with password`
- ID: `ghcr-token`
- Username: `paddyKim`
- Password: GitHub PAT with GHCR package write permission

Do not store the PAT in this repository.

## Image Names
```text
ghcr.io/paddykim/platform-api:<git-short-sha>
ghcr.io/paddykim/platform-web:<git-short-sha>
```

Successful `main` branch builds also push:

```text
ghcr.io/paddykim/platform-api:latest
ghcr.io/paddykim/platform-web:latest
```
