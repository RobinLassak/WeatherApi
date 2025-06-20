package cz.weatherApi.connector;

import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;

public class WeatherApiConnector {
    //http://api.weatherapi.com/v1/current.json?key=7b99e5120ffa45e5b71110830251905&q=Osrava&aqi=no

    private static String baseUrl = "http://api.weatherapi.com/v1/";
    private static String urlParams = "current.json?key=";
    private static String apiKey = "7b99e5120ffa45e5b71110830251905";
    private static String url = baseUrl + urlParams + apiKey + "&q=";

    public String getWeatherForCity(String city){
        RestTemplate template = new RestTemplate();
        URI uri = null;
        try {
            uri = new URI(url + city);
        } catch (URISyntaxException e){
            e.printStackTrace();
        }
        ResponseEntity<String> response = template.getForEntity(uri, String.class);
        return response.getBody();
    }
}
