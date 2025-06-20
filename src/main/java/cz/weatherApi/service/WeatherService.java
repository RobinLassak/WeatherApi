package cz.weatherApi.service;

import cz.weatherApi.connector.WeatherApiConnector;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {
    public String getWeatherForCity(String city){
        WeatherApiConnector connector = new WeatherApiConnector();
        return connector.getWeatherForCity(city);
    }
}
