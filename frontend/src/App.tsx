import { useState, useEffect, useCallback } from 'react';
import type { CityWeather } from './types/weather';
import { CITIES } from './config/cities';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import WeatherCardSkeleton from './components/WeatherCardSkeleton';

async function fetchWeatherForCity(cityKey: string) {
  const res = await fetch(`/api/weather/${cityKey}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function buildInitialState(): CityWeather[] {
  return CITIES.map((city) => ({ city, data: null, loading: true, error: null }));
}

export default function App() {
  const [cities, setCities] = useState<CityWeather[]>(buildInitialState);
  const [refreshing, setRefreshing] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    setCities(buildInitialState());

    await Promise.all(
      CITIES.map(async (cityConfig, index) => {
        try {
          const data = await fetchWeatherForCity(cityConfig.key);
          setCities((prev) =>
            prev.map((item, i) =>
              i === index ? { ...item, data, loading: false } : item,
            ),
          );
        } catch {
          setCities((prev) =>
            prev.map((item, i) =>
              i === index
                ? { ...item, loading: false, error: 'Nepodařilo se načíst data' }
                : item,
            ),
          );
        }
      }),
    );

    setLastFetched(new Date());
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Header onRefresh={fetchAll} refreshing={refreshing} lastFetched={lastFetched} />

      <main className="max-w-screen-2xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {cities.map(({ city, data, loading, error }) =>
            loading ? (
              <WeatherCardSkeleton key={city.key} city={city} />
            ) : (
              <WeatherCard key={city.key} city={city} data={data} error={error} />
            ),
          )}
        </div>
      </main>

      <footer className="text-center py-8 text-white/20 text-xs">
        Data poskytuje WeatherAPI &middot; WeatherScope
      </footer>
    </div>
  );
}
