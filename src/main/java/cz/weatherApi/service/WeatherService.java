package cz.weatherApi.service;

import cz.weatherApi.connector.WeatherApiConnector;
import cz.weatherApi.dto.WeatherApiDto;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {
    public WeatherApiDto getWeatherForCity(String city){
        WeatherApiConnector connector = new WeatherApiConnector();
        return connector.getWeatherForCity(city);
    }
}
