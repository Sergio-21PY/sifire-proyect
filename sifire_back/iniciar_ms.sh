#!/bin/bash
echo "Levantando SIFIRE Backend..."

BASE="$(cd "$(dirname "$0")" && pwd)"

echo "[1/5] Iniciando ms-usuarios (8081)..."
cd "$BASE/ms-usuarios" && ./mvnw spring-boot:run &

echo "[2/5] Iniciando ms-reportes (8082)..."
cd "$BASE/ms-reportes" && ./mvnw spring-boot:run &

echo "[3/5] Iniciando ms-monitoreo (8083)..."
cd "$BASE/ms-monitoreo" && ./mvnw spring-boot:run &

echo "[4/5] Iniciando ms-alertas (8084)..."
cd "$BASE/ms-alertas" && ./mvnw spring-boot:run &

echo "[5/5] Iniciando ms-bff (8080)..."
sleep 20
cd "$BASE/ms-bff" && ./mvnw spring-boot:run &

echo "Todos los microservicios iniciando... espera ~30 segundos"
wait