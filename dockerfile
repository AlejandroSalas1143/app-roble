FROM node:20-alpine

WORKDIR /app

# Instalamos bash y curl para poder usar wait-for-it.sh
RUN apk add --no-cache bash curl

# Copiamos dependencias
COPY package*.json ./
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Copiamos directorios de Prisma
COPY prisma ./prisma

# Generamos el cliente de Prisma
RUN npx prisma generate --schema=prisma/main/schema.prisma
RUN npx prisma generate --schema=prisma/tenant/schema.prisma

# Compilamos TypeScript
RUN npm run build

# Descargamos wait-for-it y le damos permisos de ejecución
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

# Comando de inicio: espera a que la DB esté disponible antes de continuar
CMD [ "sh", "-c", "/wait-for-it.sh postgres-bd:5432 -- npx prisma migrate deploy --schema=prisma/main/schema.prisma && npx prisma migrate deploy --schema=prisma/tenant/schema.prisma && npm run seed && node dist/main.js" ]
