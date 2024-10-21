import { View, Text, StyleSheet } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useUserInfoStore from '@/store/useUserDataStore';

const WaterLevelCard = () => {
  const animationRef = useRef<LottieView>(null);
  const [previousWaterIntake, setPreviousWaterIntake] = useState(0);

  const DailyGoal = useUserInfoStore((state) => state.dailyGoal);
  const TodayWaterIntake = useUserInfoStore((store) => store.todayWaterIntake);
  const updateUserInfo = useUserInfoStore((state) => state.updateUserInfo);

  // Function to calculate water intake percentage
  const getWaterConsumePercent = (current: number, goal: number): number => {
    if (goal === 0) return 0;
    return (current / goal) * 100;
  };

  // Function to stop animation at a specific percentage of frames
  const playFromPreviousToNewFrame = (prevPercent: number, newPercent: number) => {
    if (animationRef.current) {
      const totalFrames = 110; // water gets full thill 110th frame 
      const frameStart = Math.floor((prevPercent / 100) * totalFrames);
      const frameEnd = Math.floor((newPercent / 100) * totalFrames);

      console.log(`Playing from frame ${frameStart} to frame ${frameEnd}`);

      animationRef.current.play(frameStart, frameEnd);
    }
  };

  useEffect(() => {
    const percentagePrevious = getWaterConsumePercent(previousWaterIntake, DailyGoal);
    const percentageNew = getWaterConsumePercent(TodayWaterIntake, DailyGoal);

    // Play animation from previous water intake frame to new one
    if (animationRef.current) {
      playFromPreviousToNewFrame(percentagePrevious, percentageNew);
    }

    setPreviousWaterIntake(TodayWaterIntake);

    const intervalId = setInterval(() => {
      updateUserInfo();
    }, 2000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [TodayWaterIntake, DailyGoal]);

  return (
    <View style={styles.waterLevelCard}>
      <View style={styles.nextSessionCard}>
        <Text style={styles.nextSessionTime}>Next 9:20 AM</Text>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome6 name="bottle-water" size={22} color="blue" />
          <Text style={styles.waterAmountText}>200ml</Text>
        </View>
      </View>

      <View style={styles.targetCard}>
        <Text style={styles.targetText}>Today's Target</Text>
        <Text style={styles.targetValueText}>{DailyGoal}ml</Text>
      </View>

      <View style={styles.lottieWaterLevelContainer}>
        <Text style={styles.waterLevelText}>{Math.floor(TodayWaterIntake)}ml</Text>
        <LottieView
          ref={animationRef}
          source={require('../assets/animation_water_levelll.json')}
          style={styles.lottie}
          loop={false} // Disable looping
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  waterLevelCard: {
    width: 330,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 16,
  },
  nextSessionCard: {
    position: 'absolute',
    width: 190,
    height: 76,
    elevation: 5,
    borderRadius: 14,
    backgroundColor: '#fff',
    zIndex: 3,
    right: 0,
    padding: 9,
  },
  nextSessionTime: {
    fontFamily: 'poppins-medium',
    fontSize: 14,
    color: '#90A5B4',
  },
  waterAmountText: {
    paddingHorizontal: 10,
    fontFamily: 'poppins-semi-bold',
    fontSize: 16,
  },
  targetCard: {
    height: 76,
    width: 130,
    position: 'absolute',
    zIndex: 3,
    bottom: 20,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 3,
  },
  targetText: {
    padding: 7,
    fontFamily: 'poppins-medium',
    fontSize: 14,
    color: '#90A5B4',
  },
  targetValueText: {
    paddingLeft: 9,
    fontSize: 18,
    color: '#141A1E',
    fontFamily: 'poppins-semi-bold',
  },
  lottieWaterLevelContainer: {
    margin: 3,
    height: 175,
    width: 175,
    borderWidth: 8,
    borderColor: '#ADE5FC',
    borderRadius: 100,
    marginVertical: 20,
    backgroundColor: '#fff',
    elevation: 3,
  },
  waterLevelText: {
    position: 'absolute',
    fontFamily: 'poppins-semi-bold',
    fontSize: 20,
    zIndex: 2,
    marginTop: 90,
    marginLeft: 50,
    color: '#141A1E',
  },
  lottie: {
    height: 159,
    width: 159,
    position: 'absolute',
  },
});

export default WaterLevelCard;
