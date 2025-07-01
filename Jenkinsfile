pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ramanismael/devops-project'
        JIRA_ISSUE  = 'DA-5'                      // ← Update this to your new issue key
    }
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
                // Separate Performance report step:
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
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login \
                          -u "$DOCKER_USER" --password-stdin
                        docker push '${DOCKER_IMAGE}'
                    '''
                }
            }
        }
    }
}
