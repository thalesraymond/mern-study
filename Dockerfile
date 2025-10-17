# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY . .
RUN npm run setup-project

# Stage 2: Production environment
FROM node:22-alpine AS production

WORKDIR /app

# Copy package files and install only production dependencies
COPY dist ./dist
COPY client/dist ./client/dist
COPY package.json package-lock.json ./dist/
COPY client/package.json client/package-lock.json ./client/dist/

RUN cd dist && npm install --omit=dev

RUN cd client/dist && npm install --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/dist ./client/dist


EXPOSE 80

CMD ["node", "./dist/server.js"]
