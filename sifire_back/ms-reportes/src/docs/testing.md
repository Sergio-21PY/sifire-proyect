# Testing microservicio Reportes

Se implementa jacoco, que es una libreria que mide que porcentaje del codigo fuente es ejecutado cuando se corren los test. Después genera un reporte en HMTL con los indicadores de cobertura por paquete, clase y linea

Se integra como un plugin en Maven, se añaden los archivos necesarios en el pom.xml del ms, por lo que no requiere instalación y la forma de ejecutarlo es ejecutar en la terminal => ./mvnw test (si asi tal cual)

## Cómo funciona Jacoco

JaCoCo trabaja en dos fases:

1. **`prepare-agent`** — antes de correr los tests, instrumenta el bytecode
   compilado (`.class`) para registrar qué líneas son ejecutadas.
2. **`report`** — después de los tests, lee el archivo `target/jacoco.exec`
   generado y produce el reporte HTML en `target/site/jacoco/index.html`.

--

./mvnw test
    ↓
Compila clases + tests
    ↓
JaCoCo instrumenta el bytecode  ← prepare-agent
    ↓
JUnit ejecuta los tests
    ↓
JaCoCo genera el reporte HTML   ← report

--- 

# como ver los cambios de cobertura tras añadir nuevos tests?

Si el html esta abierto, solo debes presionar F5.

* en caso que no hubiese cambios en el reporte ejecutar: 
./mvnw clean test
Asi se genera una ejecución "limpia" de los tests

# que agregamos al pom
<plugin>
    <groupId>org.jacoco</groupId>
    <artifactId>jacoco-maven-plugin</artifactId>
    <version>0.8.11</version>
    <executions>
        <execution>
            <id>prepare-agent</id>
            <goals><goal>prepare-agent</goal></goals>
        </execution>
        <execution>
            <id>report</id>
            <phase>test</phase>
            <goals><goal>report</goal></goals>
        </execution>
    </executions>
    <configuration>
        <excludes>
            <!-- Clases sin lógica de negocio: no tiene sentido medirlas -->
            <exclude>cl/sifire/reportes/ReportesApplication.class</exclude>
            <exclude>cl/sifire/reportes/dto/**</exclude>
            <exclude>cl/sifire/reportes/model/**</exclude>
            <exclude>cl/sifire/reportes/config/**</exclude>
        </excludes>
    </configuration>
</plugin>

