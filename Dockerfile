# Use official Node.js image as base image
FROM node:latest

# Set the working directory in the container
WORKDIR /app 

# Copy package.json and package-lock.json to the working directory
COPY package.json .

# Install dependencies
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD [ "npm", "start" ]