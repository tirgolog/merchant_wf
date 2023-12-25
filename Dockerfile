# Use the official Node.js image as a base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the built application files to the container
COPY dist/ .

# Expose the port on which the application will run
EXPOSE 3000

# Command to run the application
CMD ["node", "main.js"]
