import { Tabs, } from "expo-router";
import { StyleSheet } from "react-native";

import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: sytles.tabs,
      }}
    >
      <Tabs.Screen name="index"
        options={{
          title: "Home",
          tabBarLabelStyle: sytles.lableText,
          tabBarIcon: ({ color, size }) => <Feather name="home" size={28} color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen name="analysis"
        options={{
          title: "Analysis",

          tabBarLabelStyle: sytles.lableText,
          tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={28} color={color} />
        }}
      />

      <Tabs.Screen name="alarm"
        options={{
          tabBarLabel: '',

          tabBarIcon: ({ color }) => (
            <View style={{
              height: 65,
              width: 65,
              borderRadius: 100,
              backgroundColor: "#fff",
              elevation: 3,
              padding: 14
            }}>
              <Ionicons name="alarm-outline" size={35} color={color} />
            </View>
          )
        }}
      />

      <Tabs.Screen name="settings"
        options={{
          title: "Setting",

          tabBarLabelStyle: sytles.lableText,
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={28} color={color} />,
        }}
      />

      <Tabs.Screen name="profile"
        options={{
          title: "Profile",
          tabBarLabelStyle: sytles.lableText,
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="face-man-profile" size={28} color={color} />,
        }}
      />
    </Tabs>
  )
}

const sytles = StyleSheet.create({
  tabs: {
    height: 62,
    paddingBottom: 10,
  },
  lableText: {
    color: "black",
    fontFamily: "roboto-regular",
    fontSize: 13,
  }
})
