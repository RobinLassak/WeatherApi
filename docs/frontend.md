# Frontend – dokumentace

Jednostránková React aplikace zobrazující dlaždice s fotografií města a aktuálním počasím získaným z backendu.

---

## Technologie

| Technologie | Verze | Účel |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 6 | Typová bezpečnost |
| Tailwind CSS | v4 | Utility-first CSS styly |
| Vite | 8 | Dev server a build nástroj |
| lucide-react | 1.x | Vektorové ikony |

---

## Struktura souborů

```
frontend/
├── index.html                 <- HTML šablona, lang="cs", title="WeatherScope"
├── vite.config.ts             <- Vite konfigurace (Tailwind plugin, API proxy)
├── package.json               <- závislosti a npm skripty
├── tsconfig.json              <- TypeScript konfigurace
└── src/
    ├── main.tsx               <- vstupní bod – montuje <App /> do #root
    ├── index.css              <- @import "tailwindcss"
    ├── App.tsx                <- hlavní komponenta, fetchování dat, stav
    ├── types/
    │   └── weather.ts         <- TypeScript rozhraní (WeatherData, CityConfig, CityWeather)
    ├── config/
    │   └── cities.ts          <- konfigurace pěti měst (klíč, název, země, URL fotky)
    └── components/
        ├── Header.tsx         <- hlavička s názvem aplikace a tlačítkem Obnovit
        ├── WeatherCard.tsx    <- karta jednoho města s počasím
        └── WeatherCardSkeleton.tsx <- animovaný placeholder při načítání
```

---

## Konfigurace Vite (`vite.config.ts`)

```ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

Vite dev server přeposílá všechny požadavky na `/api/*` na backend běžící na portu `8080`. Díky tomu frontend volá jednoduše `/api/weather/ostrava` bez nutnosti řešit CORS při vývoji.

---

## TypeScript typy (`src/types/weather.ts`)

### `WeatherData`

Odpovídá JSON struktuře vracené backendem.

```ts
interface WeatherData {
  location: string;          // název lokality
  timestap: string;          // čas měření "yyyy-MM-dd HH:mm"
  temp_celsius: number;      // teplota ve °C
  weather_description: string; // popis počasí (anglicky)
  wind_mps: number;          // rychlost větru v m/s
  wind_dir: string;          // světová strana (NW, SSE, ...)
  humidity: number;          // vlhkost v %
}
```

### `CityConfig`

Statická konfigurace každého města definovaná ve `cities.ts`.

```ts
interface CityConfig {
  key: string;     // klíč pro URL volání API (malá písmena)
  name: string;    // zobrazený název
  country: string; // název státu česky
  image: string;   // URL fotky z Unsplash
}
```

### `CityWeather`

Kombinovaný stav jednoho města v React state.

```ts
interface CityWeather {
  city: CityConfig;
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}
```

---

## Konfigurace měst (`src/config/cities.ts`)

Pole `CITIES` obsahuje statickou konfiguraci pěti měst. Fotografie jsou ze služby Unsplash (volná licence).

| `key` | `name` | `country` |
|---|---|---|
| `ostrava` | Ostrava | Česká republika |
| `helsinki` | Helsinki | Finsko |
| `tokyo` | Tokyo | Japonsko |
| `madrid` | Madrid | Španělsko |
| `sydney` | Sydney | Austrálie |

Chcete-li přidat nové město: (1) přidejte záznam do `CITIES`, (2) přidejte odpovídající hodnotu do enumu `City` v backendu.

---

## Komponenty

### `App.tsx`

Hlavní komponenta. Řídí globální stav a fetchování dat.

**State:**
- `cities: CityWeather[]` – pole stavů pro každé město
- `refreshing: boolean` – příznak probíhajícího načítání
- `lastFetched: Date | null` – čas poslední úspěšné aktualizace

**Fetchování:**
- `fetchAll()` – spustí paralelní volání backendu pro všechna města pomocí `Promise.all`.
- Každé město se aktualizuje samostatně ihned po přijetí odpovědi (optimistické vykreslování).
- Při chybě se pro dané město uloží chybová zpráva.
- `fetchAll` se zavolá automaticky při prvním renderu (`useEffect`) a dále na vyžádání tlačítkem Obnovit.

**Rozložení:**

```
min-h-screen (tmavý gradient)
├── <Header />
├── <main>  (grid 1 / 2 / 3 / 5 sloupců)
│   ├── <WeatherCardSkeleton /> (loading=true)
│   └── <WeatherCard />         (loading=false)
└── <footer>
```

---

### `Header.tsx`

Props: `onRefresh: () => void`, `refreshing: boolean`, `lastFetched: Date | null`

Zobrazuje:
- Název **WeatherScope** (modrý akcent na „Scope")
- Podtitulek „Aktuální počasí ve světových metropolích"
- Tlačítko **Obnovit data** – při kliknutí zavolá `onRefresh`, během načítání zobrazí rotující ikonu a text „Načítám…"
- Čas poslední aktualizace (lokalizovaný formát `HH:mm`, `cs-CZ`)

---

### `WeatherCard.tsx`

Props: `city: CityConfig`, `data: WeatherData | null`, `error: string | null`

**Chybový stav** (`error !== null`): zobrazí fotografii se sníženou opacitou, ikonu upozornění a text chyby.

**Úspěšný stav**: zobrazí:
- Fotografii města (hover efekt – zoom 105 %)
- Název a stát přes gradient overlay
- Velkou barevnou teplotu (barva závisí na hodnotě):
  - `< 0 °C` → modrá
  - `0–7 °C` → azurová
  - `8–17 °C` → zelená
  - `18–27 °C` → žlutá
  - `≥ 28 °C` → oranžová
- Textový popis počasí (z WeatherAPI, anglicky)
- Vlhkost, rychlost větru, směr větru, čas měření

Hover efekt karty: mírné zvětšení + modrý shadow.

---

### `WeatherCardSkeleton.tsx`

Props: `city: CityConfig`

Animovaný placeholder s `animate-pulse` třídou Tailwindu. Napodobuje rozložení `WeatherCard` – šedé obdélníky místo obsahu. Zobrazuje se po dobu načítání dat.

Skrytý text pro screenreadery: `Načítám data pro {city.name}` (třída `sr-only`).

---

## npm skripty

```bash
npm run dev      # spustí Vite dev server (http://localhost:5173)
npm run build    # TypeScript kompilace + Vite produkční build → dist/
npm run preview  # lokální náhled produkčního buildu
npm run lint     # ESLint kontrola
```

---

## Produkční build

```bash
npm run build
```

Výstup je ve složce `frontend/dist/`. Tuto složku lze nasadit na libovolný statický hosting (Nginx, Apache, Vercel, Netlify apod.). Backend musí být dostupný na stejné doméně nebo je nutné nastavit CORS.
