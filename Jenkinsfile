pipeline {
    agent {
        docker {
            image 'node:20-alpine'  // or any node image with npm
        }
    }

    environment {
        DOCKER_IMAGE = 'ramanismael/devops-project'
        JIRA_ISSUE  = 'DA-5' // update with actual Jira issue key
    }

    stages {
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Unit Tests') {
            steps {
                sh 'npm test'
            }
        }

        stage('Performance Testing with JMeter') {
            steps {
                sh '''
                    jmeter -n \
                      -t performance-tests/test-plan.jmx \
                      -l performance-tests/results.jtl
                '''
                perfReport sourceDataFiles: 'performance-tests/results.jtl'
            }
        }

        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        steps {
                sh 'docker build -t my-image .'
                withDockerRegistry([credentialsId: 'docker-hub-credentials']) {
                    sh 'docker push my-image'
                }
        }
    }
}
