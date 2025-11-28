FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production
COPY . .

# Document environment vars that the app expects
ENV NODE_ENV=production
ENV PORT=5050
ENV GEMINI_API_KEY=""

EXPOSE 5000
ENTRYPOINT [ "node" ]
CMD ["server.js"]

