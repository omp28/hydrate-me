import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import WaterLevelCard from "../../components/WaterLevelCard"; // Import the new component
import LottieView from "lottie-react-native";
import useUserInfoStore from "@/store/useUserDataStore";
import getGreeting from "../../utils/GetGreetMessage";
import WaterBottle from "@/components/WaterBottle";
import AppContainer from "@/components/DailyWaterConsumptionGraph";
import * as Notifications from "expo-notifications";
import { Button } from "react-native";

export default function HomeScreen() {
  let [fontsLoading] = useFonts({
    "poppins-regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "poppins-medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "poppins-semi-bold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "poppins-bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "roboto-medium": require("../../assets/fonts/Roboto-Medium.ttf"),
    "roboto-regular": require("../../assets/fonts/Roboto-Regular.ttf"),
  });

  const UserName = useUserInfoStore((state) => state.userName);
  const updateUserInfo = useUserInfoStore((state) => state.updateUserInfo);

  useEffect(() => {
    updateUserInfo(); // Fetch user data
  }, []);

  if (!fontsLoading) {
    return <AppLoading />;
  }

  const triggerNotification = async () => {
    console.log("123");
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hydrate Reminder!",
        body: "Remember to drink water and stay hydrated.",
      },
      trigger: { seconds: 1 }, // Schedule after 3 seconds
    });
    console.log("done");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingMessage}>{getGreeting()},</Text>
        <Text style={styles.greetingName}>{UserName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.lastTimeText}>11:00 AM</Text>
        <Text style={styles.amountOfWaterDrinkText}>
          200 ml water (1 Glass)
        </Text>
        <LottieView
          source={require("../../assets/water_wave.json")}
          style={{ width: 340, height: 100, position: "absolute", bottom: -14 }}
          autoPlay
          loop
        />
      </View>

      <WaterLevelCard />

      <View style={styles.graphAndBottleCard}>
        <AppContainer />
        <WaterBottle
          waterBottleLevel={30}
          mode="breath"
          lightColor="green"
          isBottlePlaced={true}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  graphAndBottleCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  container: {
    backgroundColor: "#F2F7FA",
    flex: 1,
    justifyContent: "flex-start",
  },
  greeting: {
    marginLeft: 30,
    marginTop: 15,
  },
  greetingMessage: {
    fontSize: 18,
    fontFamily: "poppins-regular",
    color: "#90A5B4",
  },
  greetingName: {
    fontSize: 23,
    fontFamily: "poppins-semi-bold",
    fontWeight: "semibold",
    color: "#141A1E",
  },
  card: {
    width: 340,
    height: 160,
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 2,
    overflow: "hidden",
  },
  lastTimeText: {
    fontFamily: "poppins-semi-bold",
    fontSize: 20,
    color: "#141A1E",
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  amountOfWaterDrinkText: {
    fontFamily: "poppins-medium",
    fontSize: 14,
    color: "#141A1E",
    paddingHorizontal: 20,
  },
});
