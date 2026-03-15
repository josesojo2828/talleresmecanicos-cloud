#!/bin/bash

# Script para desplegar la aplicación

docker compose -f docker-compose.prod.yml down

git pull origin main

docker compose -f docker-compose.prod.yml up -d --build

echo 'DEPLOY SUCCESS'

