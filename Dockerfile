FROM node:18 AS production

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Atualiza o npm para a versão mais recente
RUN npm install -g npm

# Copia apenas os arquivos necessários para instalar dependências
COPY package.json package-lock.json ./ 

# Instala apenas as dependências necessárias para produção
RUN npm install --only=production

# Copia o restante dos arquivos do projeto para o contêiner
COPY build ./build

# Expõe a porta onde o serviço estará disponível
EXPOSE 80

# Comando para iniciar o servidor
CMD ["node", "build/index.js"]
