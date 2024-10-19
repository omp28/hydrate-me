import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const WaterLevelCard = () => {
  const animationRef = useRef<LottieView>(null);

  // Function to stop the animation at a specific frame
  const stopAtFrame = () => {
    if (animationRef.current) {
      animationRef.current.pause();
      animationRef.current.play(0, 70); // Play from frame 0 to frame 110
    }
  };

  useEffect(() => {
    if (animationRef.current) {
      animationRef.current.play();
    }

    setTimeout(() => {
      stopAtFrame();
    }, 1000); // Stop the animation after 1 second
  }, []);

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
        <Text style={styles.targetValueText}>2000ml</Text>
      </View>

      <View style={styles.lottieWaterLevelContainer}>
        <Text style={styles.waterLevelText}>500ml</Text>
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
