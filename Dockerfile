# ================================
# 🏗️ 1️⃣ Builder Stage
# ================================
FROM node:24-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy dependency files first (for layer caching)
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build the Next.js app (output goes to .next)
RUN npm run build


# ================================
# 🌐 2️⃣ Runner Stage (Production Image)
# ================================
FROM node:24-alpine AS runner

WORKDIR /app

# Copy only the necessary output from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/tailwind.config.js ./
COPY --from=builder /app/src ./src

# Install only production dependencies
RUN npm ci --only=production

# Expose Next.js port
EXPOSE 3000

# Run the app in production mode
ENTRYPOINT ["npm"]
CMD ["run", "start"]
