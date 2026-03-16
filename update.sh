#!/bin/bash

# Abortar en caso de error
set -e

echo "🚀 Iniciando actualización en producción..."

# 1. Bajar últimos cambios de Git
echo "⬇️ Obteniendo cambios de Git..."
git pull origin main

# 2. Detener contenedores actuales
echo "🛑 Deteniendo contenedores..."
docker compose down frontend backend

# 3. Construir y levantar servicios
echo "🏗️ Construyendo y levantando servicios..."
docker compose up -d --build frontend backend

# 4. Limpiar imágenes huérfanas
echo "🧹 Limpiando imágenes antiguas..."
docker image prune -f

echo "✅ ¡Actualización completada con éxito!"
