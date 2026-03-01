# Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

RUN pnpm install

COPY . .

RUN pnpm build

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
