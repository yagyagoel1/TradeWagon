# Stage 1: Build TypeScript code
FROM node:20-alpine as build

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build TypeScript code
RUN npm run build

# Stage 2: Create a production image
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --only=production
USER node

# Copy built code from the previous stage
COPY --from=build  --chown=node:node /usr/src/app/dist ./src
COPY --from=build --chown=node:node /usr/src/app/node_modules ./node_modules

COPY --from=build /usr/src/app/.env ./
# Expose the port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
