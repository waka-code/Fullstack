# Frontend Dockerfile
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código de la aplicación
COPY . .

# Exponer puerto
EXPOSE 5173

# Comando por defecto - servidor de desarrollo con host 0.0.0.0
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
