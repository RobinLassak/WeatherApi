import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WeatherModel} from '../models';

@Component({
  selector: "app-weather-detail",
  templateUrl: "weather-detail.html",
  standalone: true
})
export class WeatherDetailComponent {
  @Input() weatherData: WeatherModel | null = null;

  //Metoda pro ziskani obrazku mesta
  getCityImage(): string {
    const cityName = this.weatherData?.location?.toLowerCase() || ""
    return `/assets/images/${cityName}.jpg`
  }
}
