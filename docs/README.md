# WeatherScope – dokumentace projektu

WeatherScope je full-stack webová aplikace zobrazující aktuální počasí ve vybraných světových metropolích. Backend poskytuje REST API napojené na externí službu [WeatherAPI](https://www.weatherapi.com/), frontend je jednostránková React aplikace s moderním UI.

---

## Obsah dokumentace

| Soubor | Popis |
|---|---|
| [README.md](./README.md) | Tento soubor – přehled projektu a rychlý start |
| [backend.md](./backend.md) | Dokumentace Spring Boot backendu |
| [frontend.md](./frontend.md) | Dokumentace React frontendu |
| [api.md](./api.md) | REST API reference |
| [architecture.md](./architecture.md) | Architektura systému a datový tok |

---

## Struktura monorepa

```
WeatherApi/                  <- kořen git repozitáře
├── docs/                    <- tato dokumentace
├── backend/                 <- Spring Boot (Java 17, Maven)
│   ├── pom.xml
│   └── src/main/java/cz/weatherApi/
│       ├── Main.java
│       ├── City.java
│       ├── controller/
│       ├── service/
│       ├── connector/
│       └── dto/
└── frontend/                <- React 19 + Tailwind CSS v4 + Vite
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    └── src/
        ├── App.tsx
        ├── index.css
        ├── main.tsx
        ├── components/
        ├── config/
        └── types/
```

---

## Rychlý start

### Požadavky

| Nástroj | Minimální verze |
|---|---|
| Java (JDK) | 17 |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |

### 1. Spuštění backendu

```bash
cd backend
mvn spring-boot:run
```

Backend poběží na `http://localhost:8080`.

> Pokud příkaz `mvn` není dostupný, nainstalujte Maven přes Homebrew:
> ```bash
> brew install maven
> ```

### 2. Spuštění frontendu

```bash
cd frontend
npm install    # pouze poprvé
npm run dev
```

Frontend poběží na `http://localhost:5173`.  
Vite dev server automaticky přesměrovává požadavky na `/api/*` na backend `:8080`.

### 3. Build pro produkci

```bash
# backend
cd backend && mvn clean package
java -jar target/WeatherApi-1.0-SNAPSHOT.jar

# frontend
cd frontend && npm run build
# výstup je ve frontend/dist/
```

---

## Technologický stack

### Backend
- **Java 17**
- **Spring Boot 3.1** – REST API
- **springdoc-openapi 2.3** – automatická Swagger UI dokumentace
- **SLF4J** – logování
- **WeatherAPI** – externí zdroj dat o počasí

### Frontend
- **React 19** – UI framework
- **TypeScript 6** – typová bezpečnost
- **Tailwind CSS v4** – utility-first CSS
- **Vite 8** – build nástroj a dev server
- **lucide-react** – ikony

---

## Dostupná města

| Klíč (API) | Zobrazený název | Stát |
|---|---|---|
| `ostrava` | Ostrava | Česká republika |
| `helsinki` | Helsinki | Finsko |
| `tokyo` | Tokyo | Japonsko |
| `madrid` | Madrid | Španělsko |
| `sydney` | Sydney | Austrálie |

---

## Swagger UI

Po spuštění backendu je interaktivní API dokumentace dostupná na:

```
http://localhost:8080/swagger-ui.html
```
