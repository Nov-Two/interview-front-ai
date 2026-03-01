# Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

# Use Taobao mirror for faster installation in China
RUN npm config set registry https://registry.npmmirror.com/

COPY package.json pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/

RUN pnpm install

COPY . .

# Build the app
RUN pnpm build

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html/interview_ai

RUN chmod -R 755 /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]
