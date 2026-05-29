# platform-app

Application repository for Platform Starter Kit.

## Scope
- `backend`: Spring Boot API
- `frontend`: React Web
- `Jenkinsfile`: CI pipeline entrypoint

## CI Responsibilities
- Run backend tests
- Run frontend tests/lint
- Build backend and frontend container images
- Push images to GHCR
- Update image tags in `platform-deploy`

## Planned Image Names
```text
ghcr.io/<owner>/platform-api:<git-sha>
ghcr.io/<owner>/platform-web:<git-sha>
```
