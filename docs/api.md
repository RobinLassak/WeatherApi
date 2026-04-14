# REST API – reference

Backend vystavuje jedno veřejné REST API. Swagger UI s interaktivní dokumentací je dostupné na `http://localhost:8080/swagger-ui.html` po spuštění backendu.

---

## Základní URL

```
http://localhost:8080/api
```

---

## Endpointy

### GET `/api/weather/{city}`

Vrátí aktuální meteorologická data pro zadané město.

#### Parametry

| Parametr | Umístění | Typ | Povinný | Popis |
|---|---|---|---|---|
| `city` | path | string | ano | Název města (case-insensitive) |

#### Povolené hodnoty `city`

| Hodnota | Město |
|---|---|
| `ostrava` | Ostrava, Česká republika |
| `helsinki` | Helsinki, Finsko |
| `tokyo` | Tokyo, Japonsko |
| `madrid` | Madrid, Španělsko |
| `sydney` | Sydney, Austrálie |

Hodnota je case-insensitive – `Ostrava`, `OSTRAVA` i `ostrava` jsou ekvivalentní.

---

#### Příklady požadavků

```http
GET /api/weather/ostrava
GET /api/weather/Tokyo
GET /api/weather/HELSINKI
```

```bash
# curl
curl http://localhost:8080/api/weather/ostrava
```

---

#### Úspěšná odpověď `200 OK`

```json
{
  "location": "Ostrava",
  "timestap": "2026-04-14 13:45",
  "temp_celsius": 12.3,
  "weather_description": "Partly cloudy",
  "wind_mps": 4.2,
  "wind_dir": "NW",
  "humidity": 68
}
```

#### Schéma odpovědi

| Pole | Typ | Popis |
|---|---|---|
| `location` | `string` | Název lokality vrácený WeatherAPI |
| `timestap` | `string` | Datum a čas posledního měření ve formátu `yyyy-MM-dd HH:mm` |
| `temp_celsius` | `number` (double) | Teplota ve stupních Celsia |
| `weather_description` | `string` | Slovní popis počasí v angličtině (z WeatherAPI) |
| `wind_mps` | `number` (double) | Rychlost větru v m/s (přepočteno z km/h) |
| `wind_dir` | `string` | Světová strana směru větru (např. `N`, `NW`, `SSE`) |
| `humidity` | `integer` | Relativní vlhkost vzduchu v % |

> **Poznámka k názvu pole `timestap`:** Jedná se o překlep (správně `timestamp`). Pole je takto pojmenované jak v backendu (`WeatherDto.java`), tak ve frontendu (`WeatherData` interface). Při změně je nutné aktualizovat obě strany.

---

#### Chybové odpovědi

| HTTP kód | Situace | Popis |
|---|---|---|
| `500 Internal Server Error` | Neznámé město | `City.valueOf()` hodí `IllegalArgumentException` pro neplatný název města |
| `500 Internal Server Error` | Nedostupná WeatherAPI | `RestTemplate` hodí výjimku při selhání HTTP volání |

> **Doporučení pro budoucí verze:** Přidat `@ExceptionHandler` / `@ControllerAdvice` pro zachytávání `IllegalArgumentException` a vrácení smysluplného `400 Bad Request` s popisem chyby.

---

## Hlavičky odpovědi

```
Content-Type: application/json
```

CORS je povoleno pro všechny originy pomocí anotace `@CrossOrigin` na metodě controlleru.

---

## Swagger UI

Interaktivní dokumentace je automaticky generována knihovnou **springdoc-openapi**.

```
http://localhost:8080/swagger-ui.html   <- Swagger UI
http://localhost:8080/v3/api-docs       <- OpenAPI 3.0 JSON spec
```

---

## Interní volání WeatherAPI

Backend interně volá tuto URL pro každé město:

```
http://api.weatherapi.com/v1/current.json?key=<API_KEY>&q=<CITY>
```

Odpověď WeatherAPI je deserializována do `WeatherApiDto` a transformována do `WeatherDto` v servisní vrstvě. Klientovi se vrací pouze zjednodušené `WeatherDto` – surová odpověď WeatherAPI není nikdy odeslána klientovi.
