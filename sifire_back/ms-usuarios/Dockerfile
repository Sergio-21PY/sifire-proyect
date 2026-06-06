# --- Fase 1: Construcción (Build) ---
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copiar el pom.xml para descargar las dependencias
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copiar el código fuente y compilar el JAR
COPY src ./src
RUN mvn clean package -DskipTests

# --- Fase 2: Imagen de Ejecución (Runtime) ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# JAR generado
COPY --from=build /app/target/*.jar app.jar

# ENTRYPOINT optimizado para Java 21
ENTRYPOINT ["java", "-XX:+UseG1GC", "-jar", "app.jar"]