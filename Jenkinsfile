pipeline {
    agent any
    
    environment {
        docker_image_name = "configuration.server"
        docker_image_tag = "latest"
        docker_username = "catalystbuild"
        docker_hub_cred = "catalyst_docker_development_hub_credentials"
        version = "latest"
        folder_path = "."
        repo_url = "https://github.com/Netra-Development-Solutions/catalyst.configuration.server"
    }
    
    stages {
        stage("Cloning GitHub Repo") {
            steps {
                echo "Cloning code from GitHub"
                git branch: 'RELEASE', url: "${repo_url}"
            }
        }
    
        stage("Manual approval") {
            steps {
                script {
                    def packageJsonContents = readFile("${folder_path}/package.json")
                    def packageJson = readJSON text: packageJsonContents    
                    
                    def packageName = packageJson.name
                    def packageVersion = packageJson.version
                    
                    // Deploy to "name/version" path in S3
                    def deployPath = "${packageName}/${packageVersion}"
                    
                    // Display extracted information
                    echo "Package Name: ${packageName}"
                    echo "Package Version: ${packageVersion}"
                    
                    // Manual approval step
                    input(message: "Proceed with deploying to ${deployPath}?", ok: "Deploy")
                }
            }
        }
        
        stage("Install npm packages") {
            steps {
                dir("${folder_path}") {
                    echo "Installing npm dependencies"
                    bat "npm install"
                }
            }
        }
        
        stage("Run Tests") {
            steps {
                echo "Running tests"
                // bat "npm test"
            }
        }
        
        stage("Building docker image") {
            steps {
                dir("${folder_path}") {
                    // Build Docker image
                    bat "docker build -t ${docker_image_name}:${env.BUILD_NUMBER} ."
                }
            }
        }
        
         stage('Push to Registry') {
            steps {
                dir("${folder_path}") {
                    script {
                        // Log in to Docker Hub using Jenkins credentials
                        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: "${docker_hub_cred}", usernameVariable: 'DOCKER_HUB_USERNAME', passwordVariable: 'DOCKER_HUB_PASSWORD']]) {
                            // Log in to Docker Hub
                            try {
                                bat "docker login -u ${DOCKER_HUB_USERNAME} -p ${DOCKER_HUB_PASSWORD}"
                            } catch (err) {
                                echo "Error logging in to Docker Hub: ${err}"
                                error "Error logging in to Docker Hub: ${err}"
                            }
                        }
                        // remove latest local image if exists
                        try {
                            bat "docker rmi ${docker_username}/${docker_image_name}:latest"
                        } catch (err) {
                            echo "No local image to remove: ${docker_username}/${docker_image_name}:latest"
                        }

                        // Push Docker image to registry
                        bat "docker tag ${docker_image_name}:${env.BUILD_NUMBER} ${docker_username}/${docker_image_name}:${env.BUILD_NUMBER}"
                        bat "docker tag ${docker_image_name}:${env.BUILD_NUMBER} ${docker_username}/${docker_image_name}:latest"

                        bat "docker push ${docker_username}/${docker_image_name}:${env.BUILD_NUMBER}"
                        bat "docker push ${docker_username}/${docker_image_name}:latest"

                        // remove local image
                        bat "docker rmi ${docker_username}/${docker_image_name}:${env.BUILD_NUMBER}"
                        bat "docker rmi ${docker_image_name}:${env.BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('Get Host IP Address') {
    steps {
        script {
            def hostIp

            // Check if the operating system is Windows
            if (isUnix()) {
                // Debug print statement
                echo "Using shell commands"
                
                // Use shell commands for Unix-like systems
                def networkInterface = 'eth0' // Adjust as needed
                try {
                    hostIp = sh (
                        script: "ip -4 addr show ${networkInterface} | grep inet | awk '{print \$2}' | cut -d/ -f1",
                        returnStdout: true
                    ).trim()
                } catch (e) {
                    echo "Error in shell script: ${e.getMessage()}"
                }
                
            } else {
                // Debug print statement
                echo "Using PowerShell commands"
                
                // Use PowerShell commands for Windows
                def networkInterface = 'Ethernet' // Adjust as needed
                try {
                    hostIp = powershell(
                        returnStdout: true,
                        script: """
                        (Get-NetIPAddress -InterfaceAlias '${networkInterface}' | Where-Object { $_.AddressFamily -eq 'IPv4' }).IPAddress
                        """
                    ).trim()
                } catch (e) {
                    echo "Error in PowerShell script: ${e.getMessage()}"
                }
            }

            // Debug print statement
            echo "Host IP Address: ${hostIp}"
            
            // Store the IP address as a Jenkins environment variable
            env.HOST_IP = hostIp
        }
    }
}


        stage('Run Docker Container') {
            steps {
                script {
                    // Run Docker container
                    bat "docker run -d -p ${env.HOST_IP}3000:3000 --name dinecloud_server_usermanagement dinecloud_server_usermanagement:${env.BUILD_NUMBER}"
                }
            }
        }
    }
}