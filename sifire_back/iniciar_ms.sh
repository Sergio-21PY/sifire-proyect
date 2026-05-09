#!/bin/bash

BASE="$(cd "$(dirname "$0")" && pwd)"
PIDS=()

# ─── Limpia puertos ocupados antes de iniciar ─────────────────────
limpiar_puerto() {
    local puerto=$1
    local pid=$(lsof -ti tcp:$puerto 2>/dev/null)
    if [ -n "$pid" ]; then
        echo "  ⚠ Puerto $puerto ocupado (PID $pid), cerrando..."
        kill -9 $pid 2>/dev/null
        sleep 0.5
    fi
}

# ─── Al hacer Ctrl+C, mata todo ───────────────────────────────────
cleanup() {
    echo ""
    echo "⏹ Deteniendo microservicios..."
    for pid in "${PIDS[@]}"; do
        kill $pid 2>/dev/null && echo "  ✓ PID $pid detenido"
    done
    exit 0
}
trap cleanup SIGINT SIGTERM

# ─── Función de inicio ────────────────────────────────────────────
start_ms() {
    local nombre=$1
    local puerto=$2
    local dir=$3

    limpiar_puerto $puerto
    echo "▶ Iniciando $nombre (puerto $puerto)..."
    cd "$BASE/$dir" && ./mvnw spring-boot:run > "$BASE/logs/${nombre}.log" 2>&1 &
    PIDS+=($!)
    echo "  PID: ${PIDS[-1]} → logs/${nombre}.log"
}

mkdir -p "$BASE/logs"

echo "=============================="
echo "  SIFIRE Backend - Iniciando  "
echo "=============================="

start_ms "ms-usuarios"  8081 "ms-usuarios"
start_ms "ms-reportes"  8082 "ms-reportes"
start_ms "ms-monitoreo" 8083 "ms-monitoreo"
start_ms "ms-alertas"   8084 "ms-alertas"

echo ""
echo "4 microservicios levantando en background."
echo "Logs disponibles en: $BASE/logs/"
echo ""
echo "Para ver un log en tiempo real:"
echo "  tail -f $BASE/logs/ms-alertas.log"
echo ""
echo "Ctrl+C para detener todo."
echo ""

wait