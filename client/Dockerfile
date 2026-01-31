# 🏗 Build Stage
FROM node:20 AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all files and build the project
COPY . .
RUN npm run build

# 🚀 Serve Stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx config (Kubernetes will mount a new one)
RUN rm /etc/nginx/conf.d/default.conf

# ✅ Copy built files from `/dist` (Make sure your React app builds into this folder)
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 and start Nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
