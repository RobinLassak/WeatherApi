import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {WeatherModel} from '../models';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private http = inject(HttpClient);
  private base = '/api'; // proxy přesměruje na backend:8080

  getWeather(city: string): Observable<WeatherModel> {
    return this.http.get<WeatherModel>(
      `${this.base}/weather/${encodeURIComponent(city)}`
    );
  }
}
