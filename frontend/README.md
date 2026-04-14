# WeatherScope – Frontend

React frontend pro aplikaci WeatherScope. Zobrazuje aktuální počasí ve světových metropolích formou dlaždic s fotografií města.

## Technologie

- **React 19** + **TypeScript 6**
- **Tailwind CSS v4**
- **Vite 8** (dev server + build)
- **lucide-react** (ikony)

## Spuštění

```bash
npm install
npm run dev
```

Frontend běží na `http://localhost:5173`. Požadavky na `/api/*` jsou automaticky přesměrovány na backend (`http://localhost:8080`) – backend musí být spuštěný.

## Dostupné příkazy

```bash
npm run dev      # vývojový server
npm run build    # produkční build → dist/
npm run preview  # náhled produkčního buildu
npm run lint     # ESLint
```

## Podrobná dokumentace

Viz [`docs/frontend.md`](../docs/frontend.md) v kořenu projektu.
