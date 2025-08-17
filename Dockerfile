# Dockerfile
FROM node:18 AS production

WORKDIR /app
ENV NODE_ENV=production

# Atualiza npm
RUN npm install -g npm

# Dependências
COPY package.json package-lock.json ./
RUN npm install --only=production

# Código compilado (JS) e assets
COPY build ./build

EXPOSE 3333

# API por padrão (o worker/scheduler sobrescrevem via docker-compose 'command')
CMD ["node", "build/index.js"]
