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
EXPOSE 3030

# Start development server
CMD ["npm", "run", "dev"]

# Stage 2: Build stage for creating optimized assets
FROM node:20-slim AS builder

ENV COMPOSE_BAKE=true
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and compile
COPY src ./src
COPY config ./config
COPY tsconfig.json ./tsconfig.json
COPY package.json package-lock.json ./
RUN npm run compile

# Stage 3: Production stage with Node.js
FROM node:20-slim AS production

ENV COMPOSE_BAKE=true
WORKDIR /app

# Copy compiled code from builder stage
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/config ./config
COPY --from=builder /app/package.json .

# Install production dependencies
RUN npm install --production

EXPOSE 3030

CMD ["npm", "start"]