import { View, Text, StyleSheet } from "react-native";

export default function Analysis() {
  return (
    <View style={styles.container}>
      <Text>
        Analysis
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }

})

