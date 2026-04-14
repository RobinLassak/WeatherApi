import type { CityConfig } from '../types/weather';

interface Props {
  city: CityConfig;
}

export default function WeatherCardSkeleton({ city }: Props) {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 animate-pulse">
      <div className="relative h-52 bg-white/10">
        <div className="absolute bottom-0 left-0 p-5 space-y-2">
          <div className="h-5 w-24 bg-white/20 rounded" />
          <div className="h-3 w-32 bg-white/15 rounded" />
        </div>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="h-12 w-20 bg-white/10 rounded" />
          <div className="h-4 w-28 bg-white/10 rounded mt-2" />
        </div>
        <div className="space-y-3 border-t border-white/10 pt-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-3 w-3 bg-white/15 rounded-full shrink-0" />
              <div className="h-3 bg-white/10 rounded flex-1" />
              <div className="h-3 w-10 bg-white/10 rounded" />
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">Nacitam data pro {city.name}</span>
    </div>
  );
}
