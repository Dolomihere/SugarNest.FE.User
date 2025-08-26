# Giai đoạn build
FROM node:18-alpine AS builder
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# Giai đoạn chạy preview
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app /app

EXPOSE 4174
CMD ["npm", "run", "preview"]