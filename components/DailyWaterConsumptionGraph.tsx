import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { getTodayWaterConsumption } from "@/api/api_v1";

type GraphData = {
  value: number;
  label: string;
};

// const App = ({ barData }: { barData: GraphData[] }) => {

//   return (
//     <View style={styles.container}>
//       <View style={styles.chartContainer}>
//         <BarChart
//           data={barData}
//           barWidth={12}
//           noOfSections={5}
//           barBorderRadius={4}
//           frontColor="#177AD5"
//           yAxisThickness={0} // Hide Y-axis
//           xAxisThickness={0} // Hide X-axis
//           hideRules
//           spacing={8}
//           maxValue={300}
//           height={110}
//           isAnimated
//           hideYAxisText
//           initialSpacing={0}
//           endSpacing={5}
//         />
//       </View>
//       <Image
//         style={styles.image}
//         source={require("../assets/images/water_wave.png")}
//       />
//     </View>
//   );
// };

// const App = ({ barData }: { barData: GraphData[] }) => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.chartContainer}>
//         <BarChart
//           data={barData.map((item) => ({
//             value: item.value,
//             label: item.label,
//             frontColor: item.value < 0 ? "#FF0000" : "#177AD5", // Red for negative, Blue for positive
//           }))}
//           barWidth={12}
//           noOfSections={5}
//           barBorderRadius={4}
//           yAxisThickness={0} // Hide Y-axis
//           xAxisThickness={0} // Hide X-axis
//           hideRules
//           spacing={8}
//           maxValue={300}
//           height={110}
//           isAnimated
//           hideYAxisText
//           initialSpacing={0}
//           endSpacing={5}
//         />
//       </View>
//       <Image
//         style={styles.image}
//         source={require("../assets/images/water_wave.png")}
//       />
//     </View>
//   );
// };

const App = ({ barData }: { barData: GraphData[] }) => {
  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <BarChart
          data={barData.map((item) => ({
            value: Math.abs(item.value), // Convert negative values to positive
            label: item.label,
            frontColor: item.value > 0 ? "#FF0000" : "#177AD5", // Red for originally negative, Blue for positive
          }))}
          barWidth={12}
          noOfSections={5}
          barBorderRadius={4}
          yAxisThickness={0} // Hide Y-axis
          xAxisThickness={0} // Hide X-axis
          hideRules
          spacing={8}
          maxValue={300}
          height={110}
          isAnimated
          hideYAxisText
          initialSpacing={0}
          endSpacing={5}
        />
      </View>
      <Image
        style={styles.image}
        source={require("../assets/images/water_wave.png")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 165,
    height: 235,
    justifyContent: "flex-start", // Align items at the top
    borderWidth: 2,
    borderRadius: 18,
    borderColor: "#D0D0D0",
    backgroundColor: "white",
    overflow: "hidden",
  },
  chartContainer: {
    width: 160,
    height: 150,
    padding: 4,
    marginBottom: 20, // Space below the chart for the image
    alignSelf: "flex-start", // Align the chart at the top of the container
  },

  image: {
    position: "absolute",
    bottom: -55,
    width: 170,
    height: 150,
    alignSelf: "center", // Center the image horizontally
  },
});

const AppContainer = () => {
  const [barData, setBarData] = useState<GraphData[]>([]);
  const [loading, setLoading] = useState(true);

  // Chill man i know this is http polling.. i will later change it to websocket
  // (but if u see this comment that's just bacause i am lazy af)

  const fetchData = async () => {
    try {
      const data = await getTodayWaterConsumption();
      setBarData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    setInterval(() => {
      fetchData();
    }, 1000);
  }, []);

  // if (loading) {
  //   return <View><Text>Loading...</Text></View>;
  // }

  return <App barData={barData} />;
};

export default AppContainer;
