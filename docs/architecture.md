# Architektura systému

---

## Přehled

WeatherScope je **monorepo** s klasickou třívrstvou architekturou rozdělenou na oddělený backend a frontend.

```
[ Prohlížeč / uživatel ]
         |
         | HTTP (port 5173 v dev, nebo přímé volání v prod)
         v
[ React Frontend (Vite) ]
         |
         | HTTP GET /api/weather/{city}
         | (Vite proxy přesměruje na :8080 v dev módu)
         v
[ Spring Boot Backend (port 8080) ]
         |
         | HTTP GET api.weatherapi.com/v1/current.json
         v
[ WeatherAPI.com (externí služba) ]
```

---

## Datový tok – krok za krokem

### 1. Inicializace frontendu

Při načtení stránky `App.tsx` zavolá `fetchAll()` přes `useEffect`. Stav všech 5 měst je nastaven na `loading: true` a zobrazí se `WeatherCardSkeleton` komponenty s animací pulsování.

### 2. Paralelní HTTP požadavky

`fetchAll()` spustí `Promise.all` – všechna 5 volání backendu proběhnou paralelně:

```
GET /api/weather/ostrava
GET /api/weather/helsinki
GET /api/weather/tokyo
GET /api/weather/madrid
GET /api/weather/sydney
```

Každé město se aktualizuje ve stavu ihned po přijetí odpovědi – karty se vykreslují postupně, jak data přicházejí.

### 3. Zpracování v backendu

Pro každý požadavek:

```
WeatherController.getWeatherForCity(city)
  └── City.valueOf(city.toUpperCase())        <- validace + převod na enum
  └── WeatherService.getWeatherForCity(city)
        └── WeatherApiConnector.getWeatherForCity(city)
              └── RestTemplate.getForEntity(uri, WeatherApiDto.class)
                    <- HTTP GET na WeatherAPI.com
                    <- JSON deserializace → WeatherApiDto
        └── WeatherService.transformDto(weatherApiDto)
              <- WeatherApiDto → WeatherDto
              <- wind_kph / 3.6 → wind_mps
  └── return WeatherDto jako JSON
```

### 4. Vykreslení ve frontendu

Po přijetí `WeatherDto` JSON:
- `loading` se nastaví na `false`
- `WeatherCardSkeleton` se nahradí `WeatherCard`
- Karta zobrazí fotografii, teplotu, popis počasí a detailní metriky

---

## Vrstvy aplikace

### Backend

```
Controller (HTTP vrstva)
  └── přijímá HTTP požadavky, validuje city parametr
Service (business logika)
  └── orchestruje volání a transformaci dat
Connector (integrace)
  └── volá externí WeatherAPI, deserializuje JSON
DTO vrstva
  └── WeatherApiDto  – interní mapování odpovědi WeatherAPI
  └── WeatherDto     – veřejné DTO vracené klientovi
```

### Frontend

```
App.tsx (orchestrátor)
  └── globální stav všech měst
  └── fetchování dat (useEffect + useCallback)
  └── předává data komponentám
Header.tsx
  └── UI prvek – název, refresh
WeatherCard.tsx
  └── zobrazení jednoho města (fotka + data)
WeatherCardSkeleton.tsx
  └── placeholder při načítání
config/cities.ts
  └── statická konfigurace měst (klíč, název, foto)
types/weather.ts
  └── TypeScript typy sdílené mezi komponentami
```

---

## Proxy v dev módu

Vite dev server je nakonfigurován jako proxy:

```
Prohlížeč → localhost:5173/api/weather/ostrava
                              |
                      Vite proxy (vite.config.ts)
                              |
                    localhost:8080/api/weather/ostrava
```

To eliminuje CORS problémy při vývoji. V produkci by frontend byl servírován buď ze stejné domény jako backend, nebo je nutné nakonfigurovat CORS na backendu (v současnosti je `@CrossOrigin` pouze na metodě, nikoli globálně).

---

## Správa stavu

Aplikace nepoužívá žádnou knihovnu pro správu stavu (Redux, Zustand apod.). Stav je uchován v `App.tsx` pomocí základního `useState` – to je dostačující pro tuto jednoduchou aplikaci.

```
App.tsx
  cities: CityWeather[]    <- pole 5 objektů { city, data, loading, error }
  refreshing: boolean      <- true během fetchování
  lastFetched: Date | null <- čas poslední úspěšné aktualizace
```

Stav `cities` se aktualizuje funkčním updatorem (`setCities(prev => ...)`) aby nedocházelo k přepsání ostatních měst při souběžném načítání.

---

## Diagram závislostí

```
index.html
  └── main.tsx
        └── App.tsx
              ├── config/cities.ts
              ├── types/weather.ts
              ├── components/Header.tsx
              │     └── lucide-react (RefreshCw)
              ├── components/WeatherCard.tsx
              │     ├── types/weather.ts
              │     └── lucide-react (Droplets, Wind, Compass, Clock, AlertCircle)
              └── components/WeatherCardSkeleton.tsx
                    └── types/weather.ts
```

---

## Rozšiřitelnost

### Přidání nového města

1. **Backend** – přidat hodnotu do enumu `City.java`:
   ```java
   public enum City {
       OSTRAVA, HELSINKI, TOKYO, MADRID, SYDNEY, LONDON
   }
   ```
2. **Frontend** – přidat záznam do `frontend/src/config/cities.ts`:
   ```ts
   {
     key: 'london',
     name: 'Londýn',
     country: 'Velká Británie',
     image: 'https://images.unsplash.com/...',
   }
   ```
   Grid se automaticky přizpůsobí.

### Přidání nové metriky

1. Přidat pole do `WeatherDto.java` (getter + setter).
2. Namapovat hodnotu v `WeatherService.transformDto()`.
3. Přidat pole do TypeScript interface `WeatherData` ve `weather.ts`.
4. Zobrazit v komponentě `WeatherCard.tsx`.

---

## Bezpečnostní poznámky

| Riziko | Popis | Doporučení |
|---|---|---|
| API klíč ve zdrojovém kódu | `WeatherApiConnector.java` obsahuje klíč natvrdo | Přesunout do env proměnné, načítat přes `@Value` |
| HTTP místo HTTPS | Volání WeatherAPI probíhá přes `http://` | Změnit na `https://api.weatherapi.com/...` |
| Bez error handlingu | `IllegalArgumentException` vrací `500` místo `400` | Přidat `@ControllerAdvice` s `ExceptionHandler` |
| `@CrossOrigin` bez omezení | Povoluje CORS ze všech domén | V produkci omezit na konkrétní origin |
