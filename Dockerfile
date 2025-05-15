# Use official Node.js image with version 20
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install && npm install -g serve

# Copy all app files
COPY . .

# Build the React app
RUN npm run build

# Expose port the app will run on
EXPOSE 8041

# Run the app using serve
CMD ["serve", "-s", "build", "-l", "8041"]

