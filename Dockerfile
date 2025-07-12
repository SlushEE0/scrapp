FROM oven/bun:1-slim AS base

ARG PB_VERSION=0.28.2

ENV PB_CORS_ENABLED=true
ENV PB_CORS_ORIGINS="*"

RUN apt-get update && apt-get install -y \
  supervisor \
  curl \
  unzip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .
COPY .env /app/pocketbase/.env

RUN mkdir -p /etc/supervisor/conf.d
COPY ./supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN bun run build

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d ./pocketbase/ && rm /tmp/pb.zip
RUN chmod +x ./pocketbase/pocketbase

RUN echo '#!/bin/bash' > /app/start.sh && \ 
  echo 'cd /app' >> /app/start.sh && \
  echo 'set -a' >> /app/start.sh && \
  echo 'source .env' >> /app/start.sh && \
  echo 'set +a' >> /app/start.sh && \
  echo 'exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf' >> /app/start.sh

RUN chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 8090

# Start the application
CMD ["/app/start.sh"]