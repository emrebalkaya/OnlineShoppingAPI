# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build TypeScript source code
RUN npm run build

# Expose the port your application will run on
EXPOSE 3000

# Start your Node.js application
#CMD ["npm", "start"]
