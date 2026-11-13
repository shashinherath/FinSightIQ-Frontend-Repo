# ==============================================================================
# FinSightIQ Web Frontend — Multi-stage Containerfile (React / Vite)
# ==============================================================================

# Stage 1: Build static assets
FROM node:20-alpine AS build
WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Cache dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# Public, non-secret build-time configuration (Vite inlines import.meta.env.VITE_*).
ARG VITE_API_BASE_URL
ARG VITE_SIGNALR_URL
ARG VITE_USE_MOCKS=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SIGNALR_URL=$VITE_SIGNALR_URL \
    VITE_USE_MOCKS=$VITE_USE_MOCKS

# Copy source and build
COPY . .
RUN pnpm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=3 --start-period=5s \
    CMD wget -q --spider http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
