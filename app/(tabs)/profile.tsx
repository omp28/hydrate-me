import React, { useState, useCallback } from "react";
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
import { useRouter } from "expo-router"; // Import the router

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  weight: string;
  height: string;
  gender: string;
}

interface Errors {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  age?: string | null;
  weight?: string | null;
  height?: string | null;
}

// Extract keys that are common between FormData and Errors
type FormErrorKeys = Extract<keyof FormData, keyof Errors>;

export default function ProfileScreen() {
  const router = useRouter(); // Initialize the router for navigation
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "Om",
    lastName: "Patel",
    email: "dummy@gmail.com",
    age: "20",
    weight: "5507",
    height: "170",
    gender: "male",
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = useCallback(
    (name: keyof FormData, value: string) => {
      setFormData((prevData) => ({ ...prevData, [name]: value }));

      // Only reset error if the name is in FormErrorKeys
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
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (isNaN(Number(formData.age)) || Number(formData.age) < 1)
      newErrors.age = "Age must be a valid number";
    if (isNaN(Number(formData.weight)) || Number(formData.weight) < 1)
      newErrors.weight = "Weight must be a valid number";
    if (isNaN(Number(formData.height)) || Number(formData.height) < 1)
      newErrors.height = "Height must be a valid number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    Keyboard.dismiss();
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form Data Submitted: ", formData);
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated."
      );
      setIsEditing(false);
    } catch (error) {
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
          {renderInput("First Name", "firstName")}
          {renderInput("Last Name", "lastName")}
          {renderInput("Email Address", "email", "email-address")}
          {renderInput("Age", "age", "numeric")}
          {renderInput("Weight (in kg)", "weight", "numeric")}
          {renderInput("Height (in cm)", "height", "numeric")}

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
