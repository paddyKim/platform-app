pipeline {
  agent any

  environment {
    REGISTRY = 'ghcr.io'
    API_IMAGE = 'ghcr.io/paddykim/platform-api'
    WEB_IMAGE = 'ghcr.io/paddykim/platform-web'
  }

  stages {
    stage('Prepare') {
      steps {
        script {
          env.GIT_SHORT_SHA = sh(
            script: 'git rev-parse --short HEAD',
            returnStdout: true
          ).trim()

          env.API_IMAGE_TAG = "${env.API_IMAGE}:${env.GIT_SHORT_SHA}"
          env.WEB_IMAGE_TAG = "${env.WEB_IMAGE}:${env.GIT_SHORT_SHA}"
        }

        echo "API image: ${env.API_IMAGE_TAG}"
        echo "Web image: ${env.WEB_IMAGE_TAG}"
      }
    }

    stage('Backend Test') {
      steps {
        dir('backend') {
          sh './gradlew test --no-daemon'
        }
      }
    }

    stage('Backend Package') {
      steps {
        dir('backend') {
          sh './gradlew bootJar --no-daemon'
        }
      }
    }

    stage('Frontend Install') {
      steps {
        dir('frontend') {
          sh 'npm ci'
        }
      }
    }

    stage('Frontend Build') {
      steps {
        dir('frontend') {
          sh 'npm run build'
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh 'docker build -t "$API_IMAGE_TAG" backend'
        sh 'docker build -t "$WEB_IMAGE_TAG" frontend'
      }
    }

    stage('Image Security Scan') {
      steps {
        sh '''
          mkdir -p trivy-reports

          trivy image \
            --severity HIGH,CRITICAL \
            --format table \
            --output trivy-reports/platform-api.txt \
            "$API_IMAGE_TAG"

          trivy image \
            --severity HIGH,CRITICAL \
            --format table \
            --output trivy-reports/platform-web.txt \
            "$WEB_IMAGE_TAG"

          trivy image \
            --severity CRITICAL \
            --exit-code 1 \
            "$API_IMAGE_TAG"

          trivy image \
            --severity CRITICAL \
            --exit-code 1 \
            "$WEB_IMAGE_TAG"
        '''
      }
    }

    stage('GHCR Login') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'ghcr-token',
          usernameVariable: 'GHCR_USERNAME',
          passwordVariable: 'GHCR_PASSWORD'
        )]) {
          sh 'echo "$GHCR_PASSWORD" | docker login "$REGISTRY" -u "$GHCR_USERNAME" --password-stdin'
        }
      }
    }

    stage('Docker Push') {
      steps {
        sh 'docker push "$API_IMAGE_TAG"'
        sh 'docker push "$WEB_IMAGE_TAG"'
      }
    }

    stage('Push Latest') {
      when {
        branch 'main'
      }
      steps {
        sh 'docker tag "$API_IMAGE_TAG" "$API_IMAGE:latest"'
        sh 'docker tag "$WEB_IMAGE_TAG" "$WEB_IMAGE:latest"'
        sh 'docker push "$API_IMAGE:latest"'
        sh 'docker push "$WEB_IMAGE:latest"'
      }
    }
  }

  post {
    always {
      archiveArtifacts artifacts: 'trivy-reports/*.txt', allowEmptyArchive: true
      sh 'docker logout "$REGISTRY" || true'
    }
  }
}
