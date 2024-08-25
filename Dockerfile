# Use Node.js LTS (Long Term Support) version
FROM node:lts-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Build the app
RUN export PUBLIC_APP_MODE=production && \
  export PUBLIC_GO_SERVER_URL_PROD=https://api.stablecog.com && \
  export PUBLIC_GO_SERVER_URL_DEV=https://api.stablecog.com && \ 
  export PUBLIC_GO_SERVER_URL_QA=https://qa-api.stablecog.com && \ 
  export PUBLIC_AUTH_SERVER_URL=https://auth.stablecog.com && \ 
  npm run build

# Remove dev dependencies
RUN npm prune --production

# Create production image
FROM node:lts-alpine

WORKDIR /app

# Copy built assets from build stage
COPY --from=build /app/build build/
COPY --from=build /app/node_modules node_modules/
COPY package.json .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["node", "build"]