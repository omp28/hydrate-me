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
import { Picker } from "@react-native-picker/picker"; // Dropdown for disease selection
import useUserInfoStore from "@/store/useUserDataStore";

// Water intake calculation function
function calculateWaterIntake({
  gender,
  bmi,
  baseWaterIntake = 2,
  temperature,
  humidity,
  weatherCondition,
  disease,
}) {
  let waterIntake = baseWaterIntake;
  let additionalIntake = 0;

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

  // Adjust based on disease
  if (disease === "diabetes") {
    additionalIntake = 0.5;
    waterIntake += additionalIntake;
  } else if (disease === "kidney") {
    additionalIntake = 0.6;
    waterIntake += additionalIntake;
  } else if (disease === "hypertension") {
    additionalIntake = 0.4;
    waterIntake += additionalIntake;
  } else if (disease === "heart") {
    additionalIntake = 0.3;
    waterIntake += additionalIntake;
  } else if (disease === "thyroid") {
    additionalIntake = 0.7;
    waterIntake += additionalIntake;
  }

  if (waterIntake < 1.5) {
    waterIntake = 1.5;
  } else if (waterIntake > 5) {
    waterIntake = 5;
  }

  return {
    totalWaterIntake: `Recommended water intake: ${waterIntake.toFixed(
      1
    )} liters/day.`,
    additionalWaterIntake: additionalIntake
      ? `Due to your condition (${disease}), we have added ${additionalIntake.toFixed(
          1
        )} liters to your water intake recommendation.`
      : "",
  };
}

export default function Analysis() {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [weatherData, setWeatherData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [waterIntake, setWaterIntake] = useState<string>("");
  const [additionalWaterIntake, setAdditionalWaterIntake] =
    useState<string>("");
  const [clothingSuggestion, setClothingSuggestion] = useState<string>("");
  const [exerciseAdvice, setExerciseAdvice] = useState<string>("");
  // const [selectedDisease, setSelectedDisease] = useState<string>("none"); // Disease state
  const { selectedDisease } = useUserInfoStore(); // Zustand store to get selected disease

  const API_KEY = WEATHER_API_KEY;

  const diseasesList = [
    { label: "None", value: "none" },
    { label: "Diabetes", value: "diabetes" },
    { label: "Kidney Disease", value: "kidney" },
    { label: "Hypertension", value: "hypertension" },
    { label: "Heart Disease", value: "heart" },
    { label: "Thyroid Disorder", value: "thyroid" },
  ];

  const fetchWeather = async (latitude, longitude) => {
    console.log("Selected Disease: ", selectedDisease); // Log to check if disease is correct
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);

      const weatherCondition = response.data.weather[0].main;
      const temperature = response.data.main.temp;
      const humidity = response.data.main.humidity;

      // User data for water intake calculation
      const user = {
        gender: "male", // Placeholder value, you can modify it according to your user data
        bmi: 24, // Placeholder BMI value, you can replace with actual BMI from store
        temperature: temperature,
        humidity: humidity,
        weatherCondition: weatherCondition,
        disease: selectedDisease, // Use selectedDisease from Zustand
      };

      const { totalWaterIntake, additionalWaterIntake } =
        calculateWaterIntake(user);

      setWaterIntake(totalWaterIntake);
      setAdditionalWaterIntake(additionalWaterIntake);

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
  }, [selectedDisease]); // Fetch weather data again when disease is changed

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
          <View style={styles.weatherInfo}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color="#4A90E2"
            />
            <Text style={styles.locationText}>{weatherData.name}</Text>
          </View>
          <View style={styles.weatherDetails}>
            <WeatherDetail
              icon="thermometer"
              value={`${weatherData.main.temp.toFixed(1)}°C`}
              label="Temperature"
            />
            <WeatherDetail
              icon="water-percent"
              value={`${weatherData.main.humidity}%`}
              label="Humidity"
            />
            <WeatherDetail
              icon="weather-partly-cloudy"
              value={weatherData.weather[0].description}
              label="Condition"
            />
          </View>

          <View style={styles.divider} />

          <RecommendationSection
            icon="water"
            color="#4A90E2"
            title="Water Intake"
            recommendation={waterIntake}
            additionalInfo={additionalWaterIntake}
          />

          <RecommendationSection
            icon="tshirt-crew"
            color="#2ECC71"
            title="Clothing Recommendation"
            recommendation={clothingSuggestion}
          />

          <RecommendationSection
            icon="run"
            color="#F39C12"
            title="Exercise Advice"
            recommendation={exerciseAdvice}
          />
        </View>
      ) : (
        <Text style={styles.errorText}>No weather data available.</Text>
      )}
    </ScrollView>
  );
}

const WeatherDetail = ({ icon, value, label }) => (
  <View style={styles.weatherDetailItem}>
    <MaterialCommunityIcons name={icon} size={28} color="#4A90E2" />
    <Text style={styles.weatherDetailValue}>{value}</Text>
    <Text style={styles.weatherDetailLabel}>{label}</Text>
  </View>
);

const RecommendationSection = ({
  icon,
  color,
  title,
  recommendation,
  additionalInfo,
}) => (
  <View style={styles.recommendationSection}>
    <View style={styles.recommendationHeader}>
      <MaterialCommunityIcons name={icon} size={24} color={color} />
      <Text style={styles.recommendationTitle}>{title}</Text>
    </View>
    <Text style={styles.recommendationText}>{recommendation}</Text>
    {additionalInfo && (
      <Text style={styles.additionalInfoText}>{additionalInfo}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4A90E2",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 20,
  },
  weatherInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#34495E",
    marginLeft: 10,
  },
  weatherDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  weatherDetailItem: {
    alignItems: "center",
  },
  weatherDetailValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginTop: 5,
  },
  weatherDetailLabel: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  recommendationSection: {
    marginBottom: 20,
  },
  recommendationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2C3E50",
    marginLeft: 10,
  },
  recommendationText: {
    fontSize: 16,
    color: "#34495E",
    lineHeight: 24,
  },
  additionalInfoText: {
    fontSize: 14,
    color: "#E74C3C",
    marginTop: 5,
  },
  errorText: {
    fontSize: 16,
    color: "#E74C3C",
    textAlign: "center",
  },
});
