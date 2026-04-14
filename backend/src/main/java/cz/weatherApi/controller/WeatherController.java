package cz.weatherApi.controller;

import cz.weatherApi.City;
import cz.weatherApi.dto.WeatherDto;
import cz.weatherApi.service.WeatherService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class WeatherController {

    WeatherService service;

    @Autowired
    public WeatherController(WeatherService service){
        this.service = service;
    }
    @CrossOrigin
    @GetMapping("/weather/{city}")
    public WeatherDto getWeatherForCity(@PathVariable("city")
                                            @Parameter(name = "city",
                                                    description = "Zadejte mesta: Ostrava, Helsinky, Sydney, Madrid, Tokyo")
                                            String city){
        City cityEnum = City.valueOf(city.toUpperCase());
        return service.getWeatherForCity(cityEnum);
    }
}
