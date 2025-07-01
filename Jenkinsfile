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

        stage('Docker Push') {
            steps {
                withDockerRegistry([credentialsId: 'docker-hub-credentials', url: 'https://index.docker.io/v1/']) {
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }
    }
}
