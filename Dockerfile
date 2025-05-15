# Use official Node image
FROM node:18 as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the app and build it
COPY . .
RUN npm run build

# Use lightweight image to serve build
FROM node:18-slim

# Install serve globally
RUN npm install -g serve

# Copy build artifacts
COPY --from=build /app/build /app/build

# Set working directory and port
WORKDIR /app/build
EXPOSE 8041

# Serve the app
CMD ["serve", "-s", ".", "-l", "8041"]
