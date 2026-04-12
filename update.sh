#!/bin/bash

# Abortar en caso de error
set -e

echo "🚀 Iniciando actualización en producción..."

# 1. Bajar últimos cambios de Git
echo "⬇️ Obteniendo cambios de Git..."
git pull origin main

# 2. Detener contenedores actuales
echo "🛑 Deteniendo servicios..."
docker compose --profile prod down

# 3. Construir y levantar servicios
echo "🏗️ Construyendo servicios (sin caché)..."
docker compose --profile prod build --no-cache
echo "🚀 Levantando servicios..."
docker compose --profile prod up -d

# 4. Actualización de Base de Datos (Opcional)
echo "🗄️ ¿Deseas aplicar las migraciones de la base de datos ahora mismo? (s/n)"
read -r response
if [[ "$response" =~ ^([sS][yY]|[sS])$ ]]; then
    echo "🔄 Ejecutando prisma migrate deploy..."
    # Usamos el nombre del contenedor de producción
    docker compose --profile prod exec backend npx prisma migrate deploy
fi

# 5. Limpiar imágenes huérfanas
echo "🧹 Limpiando imágenes antiguas..."
docker image prune -f

echo "✅ ¡Actualización completada con éxito!"
