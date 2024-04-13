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
                    def hostIp = null

                    // Check the operating system
                    if (isUnix()) {
                        // Unix-like system detected
                        // Define the network interface you want to use (e.g., "eth0")
                        def networkInterface = 'eth0'
                        
                        // Run a shell command to retrieve the host IP address
                        hostIp = sh (
                            script: "ip -4 addr show ${networkInterface} | grep inet | awk '{print \$2}' | cut -d/ -f1",
                            returnStdout: true
                        ).trim()
                        
                    } else {
                        // Windows system detected
                        // Define the network interface you want to use (e.g., "Wi-Fi")
                        def interfaceName = "Wi-Fi"

                        // Run PowerShell to execute ipconfig and filter the output
                        def ipconfigOutput = powershell(
                            returnStdout: true,
                            script: "ipconfig"
                        ).trim()

                        // Split the ipconfig output into lines
                        def lines = ipconfigOutput.split('\n')
                        
                        // Iterate through the lines and extract the IP address for the specified interface
                        def currentInterface = null
                        for (line in lines) {
                            line = line.trim()
                            // Check if the line is an interface header
                            if (line.contains("adapter")) {
                                currentInterface = line
                            } else if (currentInterface != null && currentInterface.contains(interfaceName)) {
                                // Look for the IPv4 Address line
                                if (line.startsWith("IPv4 Address")) {
                                    // Extract the IP address from the line
                                    hostIp = line.split(":")[1].trim()
                                    break
                                }
                            }
                        }

                        // Check if host IP was found
                        if (hostIp == null) {
                            error("Could not find IPv4 Address for interface ${interfaceName}")
                        }
                    }

                    // Print the retrieved IP address for debugging (optional)
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