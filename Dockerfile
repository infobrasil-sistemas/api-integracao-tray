FROM node:18 AS production

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Instala o pnpm
RUN npm install -g pnpm

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json pnpm-lock.yaml ./

# Instala apenas as dependências necessárias para produção
RUN pnpm install --prod --frozen-lockfile

# Copia o restante dos arquivos do projeto para o contêiner
COPY build ./build
COPY src/public /app/public

# Expõe a porta onde o serviço estará disponível
EXPOSE 3333

# Comando para iniciar o servidor
CMD ["node", "build/shared/http/server.js"]
