import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import { WEATHER_API_KEY } from "../../config";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // For icons

// Water intake calculation function
function calculateWaterIntake({
  gender,
  bmi,
  baseWaterIntake = 2,
  temperature,
  humidity,
  weatherCondition,
}) {
  let waterIntake = baseWaterIntake;

  // Adjust based on gender
  if (gender === "male") {
    waterIntake += 0.5;
  } else if (gender === "female") {
    waterIntake += 0.3;
  }

  // Adjust based on BMI
  if (bmi > 25) {
    waterIntake += 0.5;
  } else if (bmi < 18.5) {
    waterIntake += 0.2;
  }

  // Adjust based on temperature
  if (temperature > 15 && temperature <= 25) {
    waterIntake += 0.5;
  } else if (temperature > 25) {
    waterIntake += 1;
  }

  // Adjust based on humidity
  if (humidity > 60) {
    waterIntake += 0.5;
  }

  // Adjust based on weather condition
  if (weatherCondition === "Clear" || weatherCondition === "Sunny") {
    waterIntake += 0.5;
  } else if (weatherCondition === "Rain" || weatherCondition === "Cloudy") {
    waterIntake -= 0.2;
  }

  if (waterIntake < 1.5) {
    waterIntake = 1.5;
  } else if (waterIntake > 5) {
    waterIntake = 5;
  }

  return `Recommended water intake: ${waterIntake.toFixed(1)} liters/day.`;
}

export default function Analysis() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [waterIntake, setWaterIntake] = useState<string>("");
  const [clothingSuggestion, setClothingSuggestion] = useState<string>("");
  const [exerciseAdvice, setExerciseAdvice] = useState<string>("");

  const API_KEY = WEATHER_API_KEY;

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);

      const weatherCondition = response.data.weather[0].main;
      const temperature = response.data.main.temp;
      const humidity = response.data.main.humidity;

      const user = {
        gender: "male",
        bmi: 24,
        temperature: temperature,
        humidity: humidity,
        weatherCondition: weatherCondition,
      };

      const intake = calculateWaterIntake(user);
      setWaterIntake(intake);

      // Clothing suggestion based on temperature
      if (temperature < 10) {
        setClothingSuggestion("Wear warm clothing like jackets and scarves.");
      } else if (temperature > 25) {
        setClothingSuggestion("Wear light clothing like shorts and T-shirts.");
      } else {
        setClothingSuggestion("Wear comfortable clothing.");
      }

      // Exercise advice based on weather
      if (weatherCondition === "Clear" || weatherCondition === "Sunny") {
        setExerciseAdvice("Great weather for outdoor exercise! Stay hydrated.");
      } else if (weatherCondition === "Rain") {
        setExerciseAdvice("Consider indoor exercises as it's rainy.");
      } else {
        setExerciseAdvice("Mild weather, exercise as usual.");
      }
    } catch (error) {
      console.error("Error fetching weather data: ", error);
      Alert.alert("Error", "Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

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
    <ScrollView contentContainerStyle={styles.container}>
      {weatherData ? (
        <View style={styles.card}>
          <Text style={styles.header}>Weather Analysis</Text>
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

          <View style={styles.section}>
            <MaterialCommunityIcons name="water" size={24} color="blue" />
            <Text style={styles.text}>{waterIntake}</Text>
          </View>

          <View style={styles.section}>
            <MaterialCommunityIcons
              name="tshirt-crew"
              size={24}
              color="green"
            />
            <Text style={styles.text}>
              Clothing Recommendation: {clothingSuggestion}
            </Text>
          </View>

          <View style={styles.section}>
            <MaterialCommunityIcons name="run" size={24} color="orange" />
            <Text style={styles.text}>Exercise Advice: {exerciseAdvice}</Text>
          </View>
        </View>
      ) : (
        <Text>No weather data available.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
});
