# Estágio base para instalar dependências e fazer o build
FROM node:18-alpine AS base
WORKDIR /app

# Copia os arquivos de configuração de dependências
COPY package*.json ./

# Instala as dependências, incluindo as de desenvolvimento
RUN npm install

# Copia o restante do código para o contêiner
COPY . .

# Executa o build do TypeScript
RUN npm run build

# Estágio final de produção
FROM node:18-alpine AS production
WORKDIR /app

# Copia apenas os arquivos necessários para a execução
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/index.js"]
