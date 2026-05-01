#!/bin/bash
echo "Levantando SIFIRE Backend..."

# Guarda la ruta base
BASE="$(cd "$(dirname "$0")" && pwd)"

cd "$BASE/ms-usuarios" && ./mvnw spring-boot:run &
sleep 8
cd "$BASE/ms-reportes" && ./mvnw spring-boot:run &
sleep 8
cd "$BASE/ms-monitoreo" && ./mvnw spring-boot:run &
sleep 8
cd "$BASE/ms-alertas" && ./mvnw spring-boot:run &
sleep 8
cd "$BASE/ms-bff" && ./mvnw spring-boot:run &

echo "Todos los microservicios iniciando en paralelo..."
wait