#!/bin/bash

# --- COLORES ---
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 VERIFICANDO COMUNICACIÓN DEL SISTEMA (DOCKER)...${NC}\n"

# 1. Verificar si Nginx está respondiendo en el puerto 7700
echo -e "1️⃣  Probando Nginx en el puerto 7700 (Frontend & API Bridge)..."
if curl -s -f http://localhost:7700 > /dev/null; then
    echo -e "   [${GREEN}OK${NC}] Nginx está vivo en http://localhost:7700"
else
    echo -e "   [${RED}FAIL${NC}] Nginx no responde en el puerto 7700 (¿Levantaste los contenedores?)"
fi

# 2. Verificar si la API responde a través de Nginx
echo -e "\n2️⃣  Probando ruteo de API a través de Nginx..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:7700/api/v1/public/stats)
if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "   [${GREEN}OK${NC}] Nginx redirige correctamente a la API (Status 200)"
else
    echo -e "   [${RED}FAIL${NC}] Nginx devolvió status $HTTP_STATUS al intentar llegar a la API"
fi

# 3. Verificar comunicación INTERNA del Frontend al Backend
echo -e "\n3️⃣  Probando comunicación INTERNA (Front -> Back) entre contenedores..."
INTERNAL_CHECK=$(docker exec frontend_talleres curl -s -o /dev/null -w "%{http_code}" http://backend:9999/api/v1/public/stats 2>/dev/null)
if [ "$INTERNAL_CHECK" -eq 200 ]; then
    echo -e "   [${GREEN}OK${NC}] El contenedor Frontend llega al Backend por la red interna"
else
    echo -e "   [${RED}FAIL${NC}] El contenedor Frontend NO llega al Backend (Checkea el nombre de servicio 'backend')"
    echo -e "          (Status recibido: $INTERNAL_CHECK)"
fi

echo -e "\n${BLUE}🏁 CONCLUSIÓN:${NC}"
if [ "$HTTP_STATUS" -eq 200 ] && [ "$INTERNAL_CHECK" -eq 200 ]; then
    echo -e "${GREEN}¡FANTÁSTICO! Todo está en orden. Usá http://localhost:7700 para ver la app.${NC}"
else
    echo -e "${RED}Hay un problema en el tunelamiento. Checkea 'docker compose logs -f nginx'.${NC}"
fi
