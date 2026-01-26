FROM maven:3.9.6-eclipse-temurin-21

WORKDIR /app

# Copy pom first (better caching)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source
COPY src ./src

EXPOSE 8080

CMD ["mvn", "spring-boot:run"]
