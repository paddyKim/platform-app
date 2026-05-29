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
- Run frontend tests/lint
- Build backend and frontend container images
- Push images to GHCR
- Update image tags in `platform-deploy`

## Planned Image Names
```text
ghcr.io/paddyKim/platform-api:<git-sha>
ghcr.io/paddyKim/platform-web:<git-sha>
```
