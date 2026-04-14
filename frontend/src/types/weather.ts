export interface WeatherData {
  location: string;
  timestap: string;
  temp_celsius: number;
  weather_description: string;
  wind_mps: number;
  wind_dir: string;
  humidity: number;
}

export interface CityConfig {
  key: string;
  name: string;
  country: string;
  image: string;
}

export interface CityWeather {
  city: CityConfig;
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}
