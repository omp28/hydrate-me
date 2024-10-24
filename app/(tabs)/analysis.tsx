import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { WEATHER_API_KEY } from "../../config";

export default function Analysis() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // OpenWeather API key (replace with your own API key)
  const API_KEY = WEATHER_API_KEY;

  // Fetch weather data based on latitude and longitude
  const fetchWeather = async (latitude: number, longitude: number) => {
    console.log("latitudes", latitude, longitude);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
      Alert.alert("Error", "Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  // Get location permission and fetch user's location
  const getLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is required to provide weather data."
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      fetchWeather(loc.coords.latitude, loc.coords.longitude);
    } catch (error) {
      console.error("Error getting location: ", error);
      Alert.alert("Error", "Failed to get location.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weatherData ? (
        <View>
          <Text style={styles.header}>Analysis</Text>
          <Text style={styles.text}>Location: {weatherData.name}</Text>
          <Text style={styles.text}>
            Temperature: {weatherData.main.temp}°C
          </Text>
          <Text style={styles.text}>
            Humidity: {weatherData.main.humidity}%
          </Text>
          <Text style={styles.text}>
            Condition: {weatherData.weather[0].description}
          </Text>
        </View>
      ) : (
        <Text>No weather data available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});
