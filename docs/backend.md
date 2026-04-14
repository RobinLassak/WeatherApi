# Backend – dokumentace

Spring Boot aplikace poskytující REST API pro získávání dat o aktuálním počasí z externího poskytovatele [WeatherAPI.com](https://www.weatherapi.com/).

---

## Technologie

| Technologie | Verze | Účel |
|---|---|---|
| Java | 17 | Programovací jazyk |
| Spring Boot | 3.1.0 | Aplikační framework |
| Maven | 3.8+ | Správa závislostí a build |
| springdoc-openapi | 2.3.0 | Swagger UI + OpenAPI spec |
| SLF4J | 2.0.11 | Logování |

---

## Struktura balíčků

```
cz.weatherApi/
├── Main.java                  <- vstupní bod aplikace (@SpringBootApplication)
├── City.java                  <- enum povolených měst
├── controller/
│   └── WeatherController.java <- REST controller, mapování HTTP požadavků
├── service/
│   └── WeatherService.java    <- obchodní logika, transformace dat
├── connector/
│   └── WeatherApiConnector.java <- volání externí WeatherAPI
└── dto/
    ├── WeatherDto.java         <- výstupní DTO (odpověď klientovi)
    ├── WeatherApiDto.java      <- mapování JSON odpovědi z WeatherAPI
    ├── Current.java            <- vnořený objekt – aktuální počasí
    ├── Location.java           <- vnořený objekt – informace o lokalitě
    └── Condition.java          <- vnořený objekt – popis počasí
```

---

## Popis tříd

### `Main.java`

Vstupní bod Spring Boot aplikace. Spouští celý aplikační kontext.

```java
@SpringBootApplication
public class Main {
    public static void main(String[] args) {
        SpringApplication.run(Main.class, args);
    }
}
```

---

### `City.java`

Enum definující povolená města. Hodnota enumu se používá jako parametr při volání WeatherAPI (převádí se na řetězec, např. `OSTRAVA` → `"OSTRAVA"`).

```java
public enum City {
    OSTRAVA, HELSINKI, TOKYO, MADRID, SYDNEY
}
```

Příchozí řetězec z URL se převede pomocí `City.valueOf(city.toUpperCase())` – vstup je tedy case-insensitive.

---

### `WeatherController.java`

REST controller. Přijímá HTTP GET požadavky na `/api/weather/{city}` a vrací JSON.

```java
@RestController
@RequestMapping("/api")
public class WeatherController {

    @CrossOrigin
    @GetMapping("/weather/{city}")
    public WeatherDto getWeatherForCity(@PathVariable String city) {
        City cityEnum = City.valueOf(city.toUpperCase());
        return service.getWeatherForCity(cityEnum);
    }
}
```

- `@CrossOrigin` – povoluje CORS pro volání z jiné domény (vývojový frontend).
- `City.valueOf(city.toUpperCase())` – pokud `city` neodpovídá žádné hodnotě enumu, Spring automaticky vrátí `500 Internal Server Error`.

---

### `WeatherService.java`

Servisní vrstva. Vytváří instanci konektoru, zavolá API a transformuje odpověď do výstupního DTO.

```java
@Service
public class WeatherService {

    public WeatherDto getWeatherForCity(City city) {
        WeatherApiConnector connector = new WeatherApiConnector();
        WeatherApiDto weatherApiDto = connector.getWeatherForCity(city);
        return transformDto(weatherApiDto);
    }

    private WeatherDto transformDto(WeatherApiDto weatherApiDto) {
        WeatherDto wdto = new WeatherDto();
        wdto.setHumidity(weatherApiDto.getCurrent().getHumidity());
        wdto.setLocation(weatherApiDto.getLocation().getName());
        wdto.setTimestap(weatherApiDto.getCurrent().getLast_updated());
        wdto.setWeather_description(weatherApiDto.getCurrent().getCondition().getText());
        wdto.setWind_dir(weatherApiDto.getCurrent().getWind_dir());
        wdto.setWind_mps(weatherApiDto.getCurrent().getWind_kph() / 3.6);
        wdto.setTemp_celsius(weatherApiDto.getCurrent().getTemp_c());
        return wdto;
    }
}
```

Převod jednotek: `wind_kph / 3.6` → m/s.

---

### `WeatherApiConnector.java`

Volá externí REST API na `http://api.weatherapi.com/v1/current.json` pomocí `RestTemplate` a mapuje JSON odpověď do `WeatherApiDto`.

```java
public class WeatherApiConnector {
    private static String url =
        "http://api.weatherapi.com/v1/current.json?key=<API_KEY>&q=";

    public WeatherApiDto getWeatherForCity(City city) {
        RestTemplate template = new RestTemplate();
        URI uri = new URI(url + city.toString());
        ResponseEntity<WeatherApiDto> response =
            template.getForEntity(uri, WeatherApiDto.class);
        return response.getBody();
    }
}
```

> **Poznámka:** API klíč je aktuálně uložen přímo ve zdrojovém kódu. Pro produkční nasazení je doporučeno přesunout ho do environment proměnné a načíst přes `@Value("${WEATHER_API_KEY}")`.

---

### `WeatherDto.java`

Výstupní DTO – co dostane klient v JSON odpovědi.

| Pole | Typ | Popis |
|---|---|---|
| `location` | `String` | Název lokality (z WeatherAPI) |
| `timestap` | `String` | Datum a čas posledního měření (`yyyy-MM-dd HH:mm`) |
| `temp_celsius` | `double` | Teplota ve stupních Celsia |
| `weather_description` | `String` | Textový popis počasí v angličtině |
| `wind_mps` | `double` | Rychlost větru v m/s |
| `wind_dir` | `String` | Směr větru (zkratka, např. `NW`, `SSE`) |
| `humidity` | `int` | Relativní vlhkost vzduchu v % |

> Název pole `timestap` je překlep (správně by bylo `timestamp`). Při případném refaktoringu je nutné synchronizovat s frontendem.

---

## Konfigurace (`application.properties`)

```properties
server.port=${PORT:8080}
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.path=/swagger-ui.html
```

- Port lze přepsat přes environment proměnnou `PORT` (vhodné pro nasazení v cloudu).
- Swagger UI je dostupné na `/swagger-ui.html`.

---

## Build a spuštění

```bash
# Spuštění vývojového serveru
cd backend
mvn spring-boot:run

# Produkční build (vytvoří spustitelný JAR)
mvn clean package
java -jar target/WeatherApi-1.0-SNAPSHOT.jar
```

---

## Swagger UI

```
http://localhost:8080/swagger-ui.html
http://localhost:8080/v3/api-docs         <- OpenAPI JSON spec
```
