import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

interface DataItem {
  timestamp: string;
  data: number;
}

interface DataListProps {
  data: DataItem[];
}

const DataList: React.FC<DataListProps> = ({ data }) => {
  // Render a single item in the list
  const renderItem = ({ item }: { item: DataItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      <Text style={styles.data}>{item.data}</Text>
    </View>
  );

  // Format the timestamp for better readability
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

// Sample styles to make the list look nice
const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timestamp: {
    fontSize: 14,
    color: "#333",
  },
  data: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007BFF",
  },
});

export default DataList;
