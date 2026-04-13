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

# 4. Actualización de Base de Datos
echo "🗄️ ¿Cómo deseas actualizar la base de datos? (m: migration / s: sync-db-push / n: nada)"
read -r response
if [[ "$response" =~ ^([mM])$ ]]; then
    echo "🔄 Ejecutando prisma migrate deploy..."
    docker compose --profile prod exec backend npx prisma migrate deploy
elif [[ "$response" =~ ^([sS])$ ]]; then
    echo "🔄 Ejecutando prisma db push (Sincronización directa)..."
    docker compose --profile prod exec backend npx prisma db push --accept-data-loss
fi

# 5. Limpiar imágenes huérfanas
echo "🧹 Limpiando imágenes antiguas..."
docker image prune -f

echo "✅ ¡Actualización completada con éxito!"
