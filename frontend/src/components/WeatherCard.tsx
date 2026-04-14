import { Droplets, Wind, Compass, Clock, AlertCircle } from 'lucide-react';
import type { CityConfig, WeatherData } from '../types/weather';

interface Props {
  city: CityConfig;
  data: WeatherData | null;
  error: string | null;
}

function tempColorClass(temp: number): string {
  if (temp < 0) return 'text-blue-300';
  if (temp < 8) return 'text-cyan-300';
  if (temp < 18) return 'text-green-300';
  if (temp < 28) return 'text-yellow-300';
  return 'text-orange-400';
}

function formatTimestamp(raw: string): string {
  if (!raw) return '';
  const parts = raw.split(' ');
  return parts.length >= 2 ? parts[1] : raw;
}

export default function WeatherCard({ city, data, error }: Props) {
  if (error || !data) {
    return (
      <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 flex flex-col">
        <div className="relative h-52 overflow-hidden">
          <img
            src={city.image}
            alt={city.name}
            className="w-full h-full object-cover opacity-50"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <h2 className="text-white text-xl font-bold leading-tight">{city.name}</h2>
            <p className="text-white/50 text-xs mt-0.5">{city.country}</p>
          </div>
        </div>
        <div className="p-5 flex-1 flex flex-col items-center justify-center gap-2 text-center">
          <AlertCircle size={22} className="text-red-400/70" />
          <p className="text-red-400/80 text-sm">{error ?? 'Chyba při načítání dat'}</p>
        </div>
      </div>
    );
  }

  const windSpeed = data.wind_mps.toFixed(1);
  const tempRounded = Math.round(data.temp_celsius);
  const timeOnly = formatTimestamp(data.timestap);

  return (
    <div className="group rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:bg-white/[0.07] hover:border-white/20 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300">
      <div className="relative h-52 overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
        <div className="absolute bottom-0 left-0 p-5">
          <h2 className="text-white text-xl font-bold leading-tight drop-shadow-lg">
            {city.name}
          </h2>
          <p className="text-white/55 text-xs mt-0.5">{city.country}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-5">
          <div className="leading-none">
            <span className={`text-6xl font-black tabular-nums ${tempColorClass(data.temp_celsius)}`}>
              {tempRounded}
            </span>
            <span className="text-white/40 text-2xl font-light ml-1">°C</span>
          </div>
          <p className="text-white/60 text-sm text-right max-w-[130px] leading-snug mt-1">
            {data.weather_description}
          </p>
        </div>

        <div className="space-y-2.5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2.5">
            <Droplets size={14} className="text-blue-400 shrink-0" />
            <span className="text-white/50 text-xs flex-1">Vlhkost</span>
            <span className="text-white text-xs font-medium tabular-nums">{data.humidity} %</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Wind size={14} className="text-cyan-400 shrink-0" />
            <span className="text-white/50 text-xs flex-1">Vítr</span>
            <span className="text-white text-xs font-medium tabular-nums">{windSpeed} m/s</span>
          </div>

          <div className="flex items-center gap-2.5">
            <Compass size={14} className="text-violet-400 shrink-0" />
            <span className="text-white/50 text-xs flex-1">Směr větru</span>
            <span className="text-white text-xs font-medium">{data.wind_dir}</span>
          </div>

          {timeOnly && (
            <div className="flex items-center gap-2.5 pt-1 border-t border-white/[0.07]">
              <Clock size={13} className="text-white/25 shrink-0" />
              <span className="text-white/30 text-xs">Měřeno v {timeOnly}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
