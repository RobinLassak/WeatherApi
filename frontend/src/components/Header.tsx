import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  lastFetched: Date | null;
}

export default function Header({ onRefresh, refreshing, lastFetched }: HeaderProps) {
  const formattedTime = lastFetched
    ? lastFetched.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <header className="pt-14 pb-10 px-6 text-center relative">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-3">
          Weather<span className="text-blue-400">Scope</span>
        </h1>
        <p className="text-white/50 text-lg mb-6">
          Aktualni pocasi ve svetovych metropolich
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white/80 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw
              size={15}
              className={refreshing ? 'animate-spin' : ''}
            />
            {refreshing ? 'Nacitam...' : 'Obnovit data'}
          </button>
          {formattedTime && (
            <span className="text-white/30 text-sm">
              Posledni aktualizace: {formattedTime}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
