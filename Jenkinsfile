pipeline {
  agent {
    docker {
      image 'ramanismael/node-docker:latest'
      args '-v /var/run/docker.sock:/var/run/docker.sock'
    }
  }
  environment {
    DOCKER_IMAGE = 'ramanismael/devops-project'
    JIRA_ISSUE  = 'DA-5'
  }
  stages {
    stage('Checkout') {
      steps {
        git branch: 'main',
            credentialsId: 'github-credentials',
            url: 'https://github.com/RamanIsmael/devops-pipeline-project.git'
      }
    }
    stage('Install Dependencies') {
      steps {
        dir('src') {
          sh 'npm install'
        }
      }
    }
    stage('Unit Tests') {
      steps {
        dir('src') {
          script {
            def testResult = sh(script: 'npm test', returnStatus: true)
            if (testResult != 0) {
              echo 'Tests failed or not configured. Continuing pipeline...'
              currentBuild.result = 'UNSTABLE'
            }
          }
        }
      }
    }
    stage('Performance Testing with JMeter') {
      steps {
        script {
          if (fileExists('src/performance-tests/test-plan.jmx')) {
            sh '''
              jmeter -n \
                -t src/performance-tests/test-plan.jmx \
                -l src/performance-tests/results.jtl
            '''
            perfReport sourceDataFiles: 'src/performance-tests/results.jtl'
          } else {
            echo 'JMeter test plan not found. Skipping performance tests...'
          }
        }
      }
    }
    stage('Docker Build') {
      steps {
        dir('src') {
          script {
            if (fileExists('Dockerfile')) {
              sh "docker build -t ${DOCKER_IMAGE} ."
            } else {
              echo 'Dockerfile not found. Skipping Docker build...'
              currentBuild.result = 'UNSTABLE'
            }
          }
        }
      }
    }
    stage('Docker Push') {
      steps {
        withDockerRegistry(
          credentialsId: 'docker-hub-credentials',
          url: 'https://index.docker.io/v1/'
        ) {
          sh "docker push ${DOCKER_IMAGE}"
        }
      }
    }
  }
}
