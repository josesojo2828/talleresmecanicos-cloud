#!/bin/bash
echo "--- LEYENDO VARIABLES DE ENTORNO ---"
# Opcional: cargar variables si el entorno lo requiere manualmente, pero npx prisma lo hace solo
# export $(grep -v '^#' .env | xargs)

echo "--- RESETEANDO BASE DE DATOS (PRISMA) ---"
npx prisma migrate reset --force

echo "--- BASE DE DATOS LIMPIA Y RE-SEED FINALIZADA ---"
