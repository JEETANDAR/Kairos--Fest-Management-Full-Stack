# Use Node.js 20.18.2 as the base image
FROM node:20.18.2

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker cache)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 9000
EXPOSE 9000

# Start the application properly
CMD ["npm", "run", "start"]

