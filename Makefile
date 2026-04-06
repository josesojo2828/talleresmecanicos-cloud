.PHONY: up down build logs install qa

# Levanta en producción
up:
	docker compose --profile prod up -d --build

# Levanta en desarrollo con logs (Hot-reload activo)
qa:
	docker compose --profile dev up --build

# Levanta en desarrollo de fondo (Hot-reload activo)
dev:
	docker compose --profile dev up -d --build

# Baja TODO (Cualquier perfil)
down:
	docker compose --profile dev --profile prod down

# Build de producción
build:
	docker compose --profile prod build

# Logs de producción
logs:
	docker compose --profile prod logs -f

install:
	cd backend && npm install
	cd frontend && npm install
	cd mobile && npm install
