# Stage 1: Build the Application
FROM --platform=linux/amd64 node:24-slim

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Add deps
RUN apt-get update && apt-get install -y curl

# Install all dependencies (including devDependencies for building)
# Using 'npm ci' is faster and more reliable if you have a lockfile,
# otherwise it falls back to install.
RUN npm install

# Copy source code
COPY . .

# CRITICAL FIX: Matches fly.toml internal_port = 3000
ENV PORT=3069
EXPOSE 3069

# Start the application
CMD [ "npm", "run",  "start" ]
