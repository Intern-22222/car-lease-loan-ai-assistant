### Section 1 — What Docker Is
Docker is a tool that packages an application and everything it needs into a single unit called a container.

### Section 2 — Why Docker Is Needed in This Project
Docker is needed in this project to ensure that the backend and OCR services run in the same way on every system and environment.

### Section 3 — Install Docker (Windows)
This section documents the steps required to install Docker Desktop on a Windows system using the official Docker website.


### Section 4 — First Docker Command
This section verifies that Docker is installed correctly by running a basic Docker command from the command line.

### Section 5 — Docker Image vs Docker Container
A Docker image is a blueprint, while a Docker container is a running instance created from that blueprint.

### Section 6 — What a Dockerfile Is
A Dockerfile is a text file that contains step-by-step instructions telling Docker how to build a Docker image.

### Section 7 — Dockerfile: FROM Instruction
The FROM instruction specifies the base image that Docker will use to build a new image.

### Section 8 — Dockerfile: WORKDIR Instruction
The WORKDIR instruction sets the working directory inside the container for all subsequent instructions.

### Section 9 — Dockerfile: COPY Instruction
The COPY instruction copies files and folders from your local project into the container’s filesystem.

### Section 10 — Dockerfile: RUN Instruction
The RUN instruction executes commands inside the image while it is being built.

### Section 11 — Dockerfile: CMD Instruction
The CMD instruction specifies the default command that runs when a container starts.

### Section 12 — Putting It All Together
This section explains how Dockerfile instructions work together as a single flow to build and run an application.

### Section 13 — Docker Build vs Docker Run
This section explains the difference between building a Docker image and running a Docker container.

### Section 14 — Docker Containers Lifecycle
This section explains how Docker containers are created, started, stopped, and removed during their lifecycle.

### Section 15 — Docker + Environment Variables
Environment variables are used to pass configuration values into a container without hardcoding them into the image.

