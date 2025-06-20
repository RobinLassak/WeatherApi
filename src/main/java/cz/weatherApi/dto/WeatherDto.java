package cz.weatherApi.dto;

public class WeatherDto {

    private String location;
    private String timestap;
    private double temp_celsius;
    private String weather_description;
    private double wind_mps;
    private String wind_dir;
    private int humidity;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getTimestap() {
        return timestap;
    }

    public void setTimestap(String timestap) {
        this.timestap = timestap;
    }

    public double getTemp_celsius() {
        return temp_celsius;
    }

    public void setTemp_celsius(double temp_celsius) {
        this.temp_celsius = temp_celsius;
    }

    public String getWeather_description() {
        return weather_description;
    }

    public void setWeather_description(String weather_description) {
        this.weather_description = weather_description;
    }

    public double getWind_mps() {
        return wind_mps;
    }

    public void setWind_mps(double wind_mps) {
        this.wind_mps = wind_mps;
    }

    public String getWind_dir() {
        return wind_dir;
    }

    public void setWind_dir(String wind_dir) {
        this.wind_dir = wind_dir;
    }

    public int getHumidity() {
        return humidity;
    }

    public void setHumidity(int humidity) {
        this.humidity = humidity;
    }
}
