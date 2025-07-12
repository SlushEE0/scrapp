FROM oven/bun:1-slim AS base

ARG PB_VERSION=0.28.2

RUN apt-get update && apt-get install -y \
  supervisor \
  curl \
  unzip \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# Set environment variables for PocketBase CORS
ENV PB_CORS_ENABLED=true
ENV PB_CORS_ORIGINS="*"

RUN mkdir -p /etc/supervisor/conf.d

# Create supervisor config file
RUN echo "[supervisord]" > /etc/supervisor/conf.d/supervisord.conf && \
  echo "nodaemon=true" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "user=root" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "[program:pocketbase]" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "command=./pocketbase/pocketbase serve --http=0.0.0.0:8090 --origins=*" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "directory=/app" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "autostart=true" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "autorestart=true" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "stdout_logfile=/dev/stdout" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "stdout_logfile_maxbytes=0" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "stderr_logfile=/dev/stderr" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "stderr_logfile_maxbytes=0" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "[program:nextjs]" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "command=bun run start" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "directory=/app" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "autostart=true" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "autorestart=true" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "stdout_logfile=/dev/stdout" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "stdout_logfile_maxbytes=0" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "stderr_logfile=/dev/stderr" >> /etc/supervisor/conf.d/supervisord.conf && \
  echo "stderr_logfile_maxbytes=0" >> /etc/supervisor/conf.d/supervisord.conf

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d ./pocketbase/ && rm /tmp/pb.zip
RUN chmod +x ./pocketbase/pocketbase

# Create startup script
RUN echo '#!/bin/bash' > /app/start.sh && \ 
  echo 'set -e' >> /app/start.sh && \
  echo '' >> /app/start.sh && \
  echo '# Create admin user' >> /app/start.sh && \
  echo 'cd /app/pocketbase' >> /app/start.sh && \
  echo './pocketbase superuser upsert superuser@gmail.com KMUFsIDTnFmyG3nMiGM6H9FNFUR' >> /app/start.sh && \
  echo '' >> /app/start.sh && \
  echo '# Start supervisor to run both processes' >> /app/start.sh && \
  echo 'cd /app' >> /app/start.sh && \
  echo 'exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf' >> /app/start.sh && \
  chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 8090

# Start the application
CMD ["/app/start.sh"]