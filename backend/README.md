# WeatherScope – Backend

Spring Boot REST API poskytující aktuální meteorologická data z externí služby [WeatherAPI.com](https://www.weatherapi.com/).

## Technologie

- **Java 17**
- **Spring Boot 3.1**
- **Maven**
- **springdoc-openapi 2.3** (Swagger UI)

## Spuštění

```bash
mvn spring-boot:run
```

Backend běží na `http://localhost:8080`.

> Pokud příkaz `mvn` není dostupný, nainstalujte Maven:
> ```bash
> brew install maven
> ```

## Build

```bash
mvn clean package
java -jar target/WeatherApi-1.0-SNAPSHOT.jar
```

## API

```
GET /api/weather/{city}
```

Povolené hodnoty `city`: `ostrava`, `helsinki`, `tokyo`, `madrid`, `sydney` (case-insensitive).

Příklad:

```bash
curl http://localhost:8080/api/weather/ostrava
```

## Swagger UI

```
http://localhost:8080/swagger-ui.html
```

## Podrobná dokumentace

Viz [`docs/backend.md`](../docs/backend.md) a [`docs/api.md`](../docs/api.md) v kořenu projektu.
