import React, { useState, useEffect } from 'react';
import './App.css'; // Import your CSS file
const WeatherApp = () => {
  // State variables
  const [weather, setWeather] = useState({
    temperature: {
      value: undefined,
      unit: 'celsius',
    },
    description: '',
    iconId: '',
    city: '',
    country: '',
  });

  const [notification, setNotification] = useState({
    display: 'none',
    message: '',
  });

  // Constants
  const KELVIN = 273;
  const key = '82005d27a116c2880c8f0fcb866998a0';

  // Get weather based on geolocation
  useEffect(() => {
    const getPosition = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        const { latitude, longitude } = position.coords;
        getWeather(latitude, longitude);
      } catch (error) {
        setNotification({
          display: 'block',
          message: "Browser doesn't Support Geolocation",
        });
      }
    };

    getPosition();
  }, []);

  // Get weather data from API
  const getWeather = async (latitude, longitude) => {
    const api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    try {
      const response = await fetch(api);
      const data = await response.json();

      const temperatureValue = Math.floor(data.main.temp - KELVIN);
      const description = data.weather[0].description;
      const iconId = data.weather[0].icon;
      const city = data.name;
      const country = data.sys.country;

      setWeather({
        temperature: { value: temperatureValue, unit: 'celsius' },
        description,
        iconId,
        city,
        country,
      });

    } catch (error) {
      setNotification({
        display: 'block',
        message: error.message,
      });
    }
  };
  
   // Celsius to Fahrenheit conversion
  const celsiusToFahrenheit = (temperature) => {
    return (temperature * 9) / 5 + 32;
  };

  // Handle temperature unit conversion
  const handleTemperatureClick = () => {
    if (weather.temperature.value === undefined) return;

    if (weather.temperature.unit === 'celsius') {
      const fahrenheit = celsiusToFahrenheit(weather.temperature.value);
      setWeather({
        ...weather,
        temperature: { value: Math.floor(fahrenheit), unit: 'fahrenheit' },
      });
    } else {
      setWeather({
        ...weather,
        temperature: { value: weather.temperature.value, unit: 'celsius' },
      });
    }
  };

  return (
    <div className="container">
      <div className="app-title">
        <p>Weather</p>
      </div>
      <div className="notification" style={{ display: notification.display }}>
        <p>{notification.message}</p>
      </div>
      <div className="weather-container">
        <div className="weather-icon">
          <img src={`icons/${weather.iconId}.png`} alt="Weather Icon" />
        </div>
        <div className="temperature-value" onClick={handleTemperatureClick}>
          <p>
            {weather.temperature.value}°<span>{weather.temperature.unit.toUpperCase()}</span>
          </p>
        </div>
        <div className="temperature-description">
          <p>{weather.description}</p>
        </div>
        <div className="location">
          <p>
            {weather.city}, {weather.country}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
