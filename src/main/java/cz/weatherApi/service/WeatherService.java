package cz.weatherApi.service;

import cz.weatherApi.connector.WeatherApiConnector;
import cz.weatherApi.dto.WeatherApiDto;
import cz.weatherApi.dto.WeatherDto;
import org.springframework.stereotype.Service;

@Service
public class WeatherService {
    public WeatherDto getWeatherForCity(String city){
        WeatherApiConnector connector = new WeatherApiConnector();
        WeatherApiDto weatherApiDto = connector.getWeatherForCity(city);
        WeatherDto weatherDto = transformDto(weatherApiDto);
        return weatherDto;
    }

    private WeatherDto transformDto(WeatherApiDto weatherApiDto) {
        WeatherDto wdto = new WeatherDto();
        wdto.setHumidity(weatherApiDto.getCurrent().getHumidity());
        wdto.setLocation(weatherApiDto.getLocation().getName());
        wdto.setTimestap(weatherApiDto.getCurrent().getLast_updated());
        wdto.setWeather_description(weatherApiDto.getCurrent().getCondition().getText());
        wdto.setWind_dir(weatherApiDto.getCurrent().getWind_dir());
        wdto.setWind_mps(weatherApiDto.getCurrent().getWind_kph()/3.6);
        wdto.setTemp_celsius(weatherApiDto.getCurrent().getTemp_c());
        return wdto;
    }
}
