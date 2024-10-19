import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import WaterLevelCard from '../../components/WaterLevelCard'; // Import the new component
import LottieView from "lottie-react-native";

export default function HomeScreen() {
  let [fontsLoading] = useFonts({
    'poppins-regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'poppins-medium': require('../../assets/fonts/Poppins-Medium.ttf'),
    'poppins-semi-bold': require('../../assets/fonts/Poppins-SemiBold.ttf'),
    'poppins-bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    'roboto-medium': require('../../assets/fonts/Roboto-Medium.ttf'),
    'roboto-regular': require('../../assets/fonts/Roboto-Regular.ttf'),
  });

  if (!fontsLoading) {
    return <AppLoading />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.greeting}>
        <Text style={styles.greetingMessage}>Good Morning,</Text>
        <Text style={styles.greetingName}>Abhinav Prajapati</Text>


      </View>

      <View style={styles.card}>
        <Text style={styles.lastTimeText}>11:00 AM</Text>
        <Text style={styles.amountOfWaterDrinkText}>200 ml water (1 Glass)</Text>
        <LottieView
          source={require("../../assets/water_wave.json")}
          style={{ width: 340, height: 100, position: "absolute", bottom: -14 }}
          autoPlay
          loop
        />
      </View>

      <WaterLevelCard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F2F7FA',
    flex: 1,
    justifyContent: 'flex-start',
  },
  greeting: {
    marginLeft: 30,
    marginTop: 15,
  },
  greetingMessage: {
    fontSize: 18,
    fontFamily: 'poppins-regular',
    color: '#90A5B4',
  },
  greetingName: {
    fontSize: 23,
    fontFamily: 'poppins-semi-bold',
    fontWeight: 'semibold',
    color: '#141A1E',
  },
  card: {
    width: 340,
    height: 160,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    overflow: 'hidden',
  },
  lastTimeText: {
    fontFamily: 'poppins-semi-bold',
    fontSize: 20,
    color: '#141A1E',
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  amountOfWaterDrinkText: {
    fontFamily: 'poppins-medium',
    fontSize: 14,
    color: '#141A1E',
    paddingHorizontal: 20,
  },
});
