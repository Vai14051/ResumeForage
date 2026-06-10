# Use the official Node.js 20 image based on Alpine Linux.
# Alpine is a tiny Linux distro (~5MB) — keeps the image small and fast.
FROM node:20-alpine

# Set the working directory inside the container.
# Think of this as "cd /app" — all commands below run from here.
# Docker creates this folder if it doesn't exist.
WORKDIR /app

# Copy package.json and package-lock.json into the container.
# We copy these BEFORE the source code so Docker can cache the
# npm install layer — if only your code changes (not package.json),
# Docker skips re-running npm install on the next build.
COPY package*.json ./

# Install all dependencies listed in package.json.
# "npm ci" is like "npm install" but:
#   - Uses package-lock.json exactly (no version surprises)
#   - Faster in CI/Docker environments
#   - Fails if package-lock.json is out of sync
RUN npm ci

# Copy the rest of your source code into the container.
# The dot on the left means "everything in your current folder"
# The dot on the right means "paste it into WORKDIR (/app)"
COPY . .

# ARG receives the build argument passed from docker-compose (args: VITE_API_URL).
# ENV makes it available during the build process.
# Vite bakes all VITE_* env vars into the JS bundle at build time —
# so this must be set BEFORE npm run build runs.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Expose port 4173 — this is the port Vite's preview server uses.
# This is just documentation for other developers.
# You still need to map it with -p when running the container.
EXPOSE 5173

RUN npm run build

# Start Vite dev server.
# "--host 0.0.0.0" makes it accessible outside the container.
# Without this, Vite only listens on localhost inside the container
# and your browser on the host machine can't reach it.
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
