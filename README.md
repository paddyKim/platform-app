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

## CI/CD Flow
This repository owns the build artifact creation part of the platform.

```text
Git commit -> Jenkins -> tests/builds -> Docker images -> GHCR
```

The deployment itself is intentionally not performed from this repository. Deployment state is owned by `platform-deploy` and synchronized by ArgoCD.

## Current Verified Image Tag
Day 7 and Day 8 used this image tag:

```text
ghcr.io/paddykim/platform-api:1fd847c
ghcr.io/paddykim/platform-web:1fd847c
```

## Operational Boundary
- This repo decides what application code is built.
- Jenkins decides whether the app is testable and buildable.
- GHCR stores the immutable image artifacts.
- `platform-deploy` decides which image tag is deployed.
- ArgoCD applies the desired deployment state to Kubernetes.

## Metrics Endpoint
The backend exposes Spring Boot actuator metrics for Prometheus:

```bash
curl http://localhost:8080/actuator/health
curl http://localhost:8080/actuator/prometheus
```

In Kubernetes, Prometheus scrapes this endpoint through a ServiceMonitor defined in `platform-deploy`.

## Day 11 Image Security Scan
Day 11 adds Trivy image scanning between Docker build and GHCR push.

Target flow:
```text
Docker build -> Trivy image scan -> GHCR push
```

Initial scan policy:
- `CRITICAL`: fail Jenkins pipeline
- `HIGH`: report only
- `MEDIUM/LOW`: out of Day 11 scope

The Jenkins agent must provide:
```bash
trivy --version
docker ps
```

Jenkins archives these scan reports:
```text
trivy-reports/platform-api.txt
trivy-reports/platform-web.txt
```

Trivy is installed on the external Jenkins agent as a prerequisite. Agent provisioning is not automated in this repository.

Detailed policy is documented in `../docs/security-scan-policy.md`.

## Day 12 CRITICAL Remediation
Day 12 remediates the CRITICAL findings that blocked the Day 11 pipeline.

Changes:
- API: override `tomcat.version` to `11.0.22` to remediate `tomcat-embed-core` CRITICAL findings.
- Web: run `apk upgrade --no-cache` in the nginx Alpine runtime stage to update vulnerable runtime packages such as `libcrypto3` and `libssl3`.

HIGH findings remain report-only under the current policy.
