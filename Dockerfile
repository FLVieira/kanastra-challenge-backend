# Use a Node.js base image
FROM node:16-alpine

# Create a working directory for the application
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source files to the working directory
COPY src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY ormconfig.json ./

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
