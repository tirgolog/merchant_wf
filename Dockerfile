# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the application source code to the working directory
COPY . .

# Expose the port on which your Nest.js application will run
EXPOSE 3000

# Define the command to run your application
CMD ["node", "dist/main.js"]
