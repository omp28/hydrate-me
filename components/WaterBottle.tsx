
import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Image, Animated, Easing } from 'react-native';
import { getIsBottleOnDock, getCurrentBottleLevel } from '@/api/api_v1';

type PropsType = {
  waterBottleLevel: number;
};

const WaterBottle: React.FC<PropsType> = () => {
  const [isBottlePlaced, setIsBottlePlaced] = useState<boolean>(true);
  const [waterBottleLevel, setWaterBottleLevel] = useState<number>(0); // Manage the water bottle level state
  const [mode, setMode] = useState<'solid' | 'breath'>('solid');
  const [lightColor, setLightColor] = useState<string>('yellow'); // Default color when the bottle is placed

  const glowAnimation = useRef(new Animated.Value(0)).current;
  const bottlePosition = useRef(new Animated.Value(0)).current; // Control the vertical movement of the bottle

  // Fetch bottle status and water level every second
  useEffect(() => {
    const interval = setInterval(async () => {
      // Fetch if the bottle is placed on the dock
      const isBottleOnDock = await getIsBottleOnDock();

      if (isBottleOnDock === false) {
        // If the bottle is picked up, set breath mode with yellow color
        setIsBottlePlaced(false);
        setMode('breath');
        setLightColor('yellow');
      } else {
        // If the bottle is placed, set solid mode with green color
        setIsBottlePlaced(true);
        setMode('solid');
        setLightColor('#008000'); // green
      }

      // Fetch the current water bottle level
      const currentLevel = await getCurrentBottleLevel();
      if (currentLevel !== null) {
        setWaterBottleLevel(currentLevel); // Update water level state
      }
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mode === 'breath') {
      // Start breathing animation if mode is "breath"
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnimation, {
            toValue: 1, // Max opacity
            duration: 1000, // Duration of fade-in
            easing: Easing.inOut(Easing.sin), // Smooth sine easing
            useNativeDriver: true,
          }),
          Animated.timing(glowAnimation, {
            toValue: 0, // Min opacity
            duration: 1000, // Duration of fade-out
            easing: Easing.inOut(Easing.sin), // Smooth sine easing
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      // Stop animation in solid mode and set the opacity to full (1)
      glowAnimation.setValue(1);
    }
  }, [mode, glowAnimation]);

  // Animate bottle up and down if it is placed
  useEffect(() => {
    if (!isBottlePlaced) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bottlePosition, {
            toValue: -10, // Move up by 10 pixels
            duration: 1000,
            easing: Easing.inOut(Easing.quad), // Smooth easing
            useNativeDriver: true,
          }),
          Animated.timing(bottlePosition, {
            toValue: 0, // Move back down to the original position
            duration: 1000,
            easing: Easing.inOut(Easing.quad), // Smooth easing
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      bottlePosition.setValue(0); // Reset position if bottle is placed
    }
  }, [isBottlePlaced, bottlePosition]);

  // 160 is the max height of water level in bottle
  const waterHeight = (waterBottleLevel / 1000) * 160;

  return (
    <View style={styles.waterBottleCard}>
      {/* Bottle Container with animated position */}
      <Animated.View
        style={[
          styles.bottleContainer,
          { transform: [{ translateY: bottlePosition }] }, // Bottle moves up and down based on the animation
        ]}
      >
        <View style={[styles.imageWaterLevel, { height: waterHeight }]} />
        <Image
          style={styles.bottleImage}
          source={require("../assets/images/bottle_1.png")}
        />
      </Animated.View>

      {/* Status Light */}
      <Animated.View
        style={[
          styles.statusLight,
          {
            backgroundColor: lightColor, // Color passed via state
            opacity: mode === 'breath' ? glowAnimation : 1, // Animation or solid light
            shadowColor: lightColor, // Shadow matches light color
            shadowOpacity: mode === 'breath' ? glowAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [0.2, 0.8], // Vary shadow opacity for breathing
            }) : 0.8, // Solid shadow in solid mode
          },
        ]}
      />

      <Image
        style={styles.dockImage}
        source={require("../assets/images/Dock.png")}
      />
    </View>
  );
};

export default WaterBottle;

const styles = StyleSheet.create({
  statusLight: {
    position: "absolute",
    height: 5,
    width: 88.4,
    bottom: 14.5,
    left: 0.9,
    zIndex: 2,
    shadowOffset: { width: 0, height: 0 }, // Center the shadow
    shadowRadius: 100, // The blur radius of the shadow to make it look like a glow
  },

  dockImage: {
    height: 25,
    width: 90,
    position: "absolute",
    bottom: 0,
  },

  waterBottleCard: {
    height: 230,
    width: 100,
  },
  imageWaterLevel: {
    position: "absolute",
    width: 64,
    backgroundColor: "#2DCDF9",
    bottom: 6,
    left: 13,

    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },

  bottleContainer: {
    position: "absolute",
    height: 200,
    width: 100,
    bottom: 21,
  },
  bottleImage: {
    height: 200,
    width: 90,
    transform: [{ skewY: "-1deg" }],
  },
});
