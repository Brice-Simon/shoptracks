# 1. BASE IMAGE
# Uses a lightweight version of Node.js 18 based on Alpine Linux.
# Alpine is used to keep the final image size as small as possible.
FROM node:18-alpine

# 2. WORK DIRECTORY
# Sets the internal folder where our app will live inside the container.
WORKDIR /app

# 3. DEPENDENCY INSTALLATION
# Copy only the package files first.
# This is a Docker "best practice": it allows Docker to cache your 
# 'npm install' layer so it doesn't re-run every time you change a line of code.
COPY package*.json ./
RUN npm install

# 4. COPY SOURCE CODE
# Copies all remaining files from your local project into the container folder.
COPY . .

# 5. NETWORKING
# Informs Docker that the container listens on port 5000 at runtime.
# This should match the port your Express server is listening on.
EXPOSE 5000

# 6. EXECUTION
# The command to start your application when the container launches.
CMD ["npm", "start"]