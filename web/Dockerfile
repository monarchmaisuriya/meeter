# syntax=docker/dockerfile:1.4

# Stage 1: Development stage with hot-reload
FROM node:20-slim AS development

ENV COMPOSE_BAKE=true
WORKDIR /app

# Copy package.json and package-lock.json for the dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code
COPY . .

# Expose development port
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev:host"]

# Stage 2: Build stage for creating optimized assets
FROM node:20-slim AS builder

ENV COMPOSE_BAKE=true
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Stage 3: Production stage with Node.js
FROM node:20-slim AS production

ENV COMPOSE_BAKE=true
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json .

# Install serve globally and production dependencies
RUN npm install -g serve && npm install --production

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]