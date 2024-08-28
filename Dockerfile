# Use a imagem oficial do Node.js como base
FROM node:18-alpine

# Configuração do diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie apenas os arquivos de dependências para aproveitar o cache do Docker
COPY package*.json ./

# Instale as dependências de produção
RUN npm install --production

# Copie o código compilado para o diretório de trabalho
COPY dist/ ./dist

# Defina variáveis de ambiente necessárias para produção
ENV NODE_ENV=production

# Exponha a porta em que a API será executada
EXPOSE 3000

# Comando padrão para rodar a aplicação
CMD ["node", "dist/index.js"]
