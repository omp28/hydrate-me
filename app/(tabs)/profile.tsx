import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Location from "expo-location";
import { Picker } from "@react-native-picker/picker"; // For the dropdown
import useUserInfoStore from "@/store/useUserDataStore";
import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const BASE_PROFILE_URL = "192.168.0.102";

interface FormData {
  name: string;
  email: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
  dailyGoal: string;
  wakeupTime: string;
  sleepTime: string;
  latitude: string;
  longitude: string;
}

interface Errors {
  name?: string | null;
  email?: string | null;
  age?: string | null;
  weight?: string | null;
  height?: string | null;
  dailyGoal?: string | null;
  wakeupTime?: string | null;
  sleepTime?: string | null;
}

type FormErrorKeys = Extract<keyof FormData, keyof Errors>;

const diseasesList = [
  { label: "None", value: "none" },
  { label: "Diabetes", value: "diabetes" },
  { label: "Kidney Disease", value: "kidney" },
  { label: "Hypertension", value: "hypertension" },
  { label: "Heart Disease", value: "heart" },
  { label: "Thyroid Disorder", value: "thyroid" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [formData, setFormData] = useState<FormData>({
    name: "Om Patel",
    email: "dummy@gmail.com",
    age: "20",
    weight: "55",
    height: "170",
    gender: "male",
    dailyGoal: "2000",
    wakeupTime: "07:00",
    sleepTime: "23:00",
    latitude: "",
    longitude: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const { selectedDisease, setSelectedDisease } = useUserInfoStore(); // Disease state

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location access is required to provide location data."
        );
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      handleChange("latitude", loc.coords.latitude.toString());
      handleChange("longitude", loc.coords.longitude.toString());
    } catch (error) {
      console.error("Error getting location: ", error);
      Alert.alert("Error", "Failed to get location.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://${BASE_PROFILE_URL}:3005/user/1`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();

        // Update formData state with fetched user data
        setFormData({
          name: data.name || "",
          email: data.email || "",
          age: data.age?.toString() || "",
          weight: data.weight?.toString() || "",
          height: data.height?.toString() || "",
          gender: data.gender || "",
          dailyGoal: data.dailyGoal?.toString() || "",
          wakeupTime: data.wakeupTime || "",
          sleepTime: data.sleepTime || "",
          latitude: data.latitude?.toString() || "",
          longitude: data.longitude?.toString() || "",
        });
      } catch (error) {
        console.error("Error fetching user data: ", error);
        Alert.alert("Error", "Failed to load user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = useCallback(
    (name: keyof FormData, value: string) => {
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      if ((name as FormErrorKeys) && errors[name as FormErrorKeys]) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name as FormErrorKeys]: null,
        }));
      }
    },
    [errors]
  );

  const validateForm = useCallback(() => {
    let newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (isNaN(Number(formData.age)) || Number(formData.age) < 1)
      newErrors.age = "Age must be a valid number";
    if (isNaN(Number(formData.weight)) || Number(formData.weight) < 1)
      newErrors.weight = "Weight must be a valid number";
    if (isNaN(Number(formData.height)) || Number(formData.height) < 1)
      newErrors.height = "Height must be a valid number";
    if (isNaN(Number(formData.dailyGoal)) || Number(formData.dailyGoal) < 1)
      newErrors.dailyGoal = "Daily Goal must be a valid number";
    if (!formData.wakeupTime) newErrors.wakeupTime = "Wakeup time is required";
    if (!formData.sleepTime) newErrors.sleepTime = "Sleep time is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Keyboard.dismiss();
    try {
      const response = await fetch(`http://${BASE_PROFILE_URL}:3005/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Do not send `selectedDisease` here
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert(
          "Profile Updated",
          "Your profile has been successfully updated."
        );
        setIsEditing(false);
      } else {
        const errorData = await response.json();
        console.error("Error submitting form: ", errorData);
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form: ", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm]);

  const toggleEdit = useCallback(() => {
    if (isEditing) {
      handleSubmit();
    } else {
      setIsEditing(true);
    }
  }, [isEditing, handleSubmit]);

  const renderInput = useCallback(
    (label: string, name: keyof FormData, keyboardType: any = "default") => (
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            errors[name as FormErrorKeys] ? styles.inputError : null,
          ]}
          value={formData[name]}
          onChangeText={(text) => handleChange(name, text)}
          editable={isEditing}
          keyboardType={keyboardType}
        />
        {!!errors[name as FormErrorKeys] && (
          <Text style={styles.errorText}>{errors[name as FormErrorKeys]}</Text>
        )}
      </View>
    ),
    [formData, errors, isEditing, handleChange]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Ionicons name="arrow-back" size={28} color="#00bfff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity onPress={toggleEdit}>
            <Ionicons
              name={isEditing ? "save-outline" : "pencil"}
              size={24}
              color="#00bfff"
            />
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          {renderInput("Name", "name")}
          {renderInput("Email Address", "email", "email-address")}
          {renderInput("Age", "age", "numeric")}
          {renderInput("Weight (in kg)", "weight", "numeric")}
          {renderInput("Height (in cm)", "height", "numeric")}
          {renderInput("Daily Goal (in ml)", "dailyGoal", "numeric")}
          {renderInput("Wakeup Time", "wakeupTime", "default")}
          {renderInput("Sleep Time", "sleepTime", "default")}
          {renderInput("Latitude", "latitude", "numeric")}
          {renderInput("Longitude", "longitude", "numeric")}

          {/* Disease Selection */}
          <Text style={styles.label}>Select a Condition (Optional)</Text>
          <Picker
            selectedValue={selectedDisease}
            onValueChange={(itemValue) => setSelectedDisease(itemValue)}
            enabled={isEditing}
            style={styles.picker}
          >
            {diseasesList.map((disease) => (
              <Picker.Item
                key={disease.value}
                label={disease.label}
                value={disease.value}
              />
            ))}
          </Picker>

          <Text style={styles.label}>Gender</Text>
          <RadioButton.Group
            onValueChange={(value) => handleChange("gender", value)}
            value={formData.gender}
          >
            <View style={styles.radioContainer}>
              {["male", "female", "other"].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.radioItem}
                  onPress={() => isEditing && handleChange("gender", option)}
                >
                  <RadioButton.Android value={option} disabled={!isEditing} />
                  <Text style={styles.radioLabel}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </RadioButton.Group>

          {isEditing && (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#eaf7ff",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputError: {
    borderColor: "#ff0000",
  },
  errorText: {
    color: "#ff0000",
    fontSize: 12,
    marginTop: 5,
  },
  picker: {
    backgroundColor: "#afb4b6",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: "#00bfff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
// ProfileScreen.js;
