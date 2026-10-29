FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /build
COPY pom.xml .
COPY src src
RUN mvn -B -DskipTests package
FROM eclipse-temurin:21-jre
WORKDIR /app
RUN groupadd --system lirio && useradd --system --gid lirio lirio && mkdir -p /app/.data && chown -R lirio:lirio /app
COPY --from=build /build/target/gestion-inventario-lirio-1.0.0.jar app.jar
COPY uploads/productos uploads/productos
USER lirio
EXPOSE 8080
ENTRYPOINT ["java","-Djava.awt.headless=true","-jar","app.jar"]
