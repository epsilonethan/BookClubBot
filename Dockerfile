# Use the official Node.js image as a base
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY index.js ./
COPY commands ./commands
COPY helpers ./helpers
COPY deploy-commands.js ./

# Expose the port the app will run on (if applicable)
# (Typically, Discord.js bots don’t use ports, but if you have a web server, set it accordingly)
# EXPOSE 3000

# Set the default command to run your app (replace 'index.js' with the entry file of your bot)
CMD node deploy-commands.js && node index.js