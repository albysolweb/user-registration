pipeline {
  agent any
  tools {nodejs "node"}
  stages {
    stage('Build') {
      steps {
        git branch: 'main', url: 'https://github.com/albysolweb/user-registration.git'
        bat 'npm install'
      }
    }
  }
}
