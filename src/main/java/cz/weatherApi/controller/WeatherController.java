package cz.weatherApi.controller;

import cz.weatherApi.dto.WeatherApiDto;
import cz.weatherApi.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class WeatherController {

    WeatherService service;

    @Autowired
    public WeatherController(WeatherService service){
        this.service = service;
    }

    @GetMapping("/weather/{city}")
    public WeatherApiDto getWeatherForCity(@PathVariable("city") String city){
        return service.getWeatherForCity(city);
    }
}
