FROM node:lts AS builder
WORKDIR /web
COPY frontend .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /web/dist /usr/share/nginx/html
