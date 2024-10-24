type RawData = {
  data: number;
  timestamp: string;
};

type TransformedData = {
  value: number;
  label: string;
};

function transformData(rawData: RawData[]): TransformedData[] {
  let previousValue = rawData.length > 0 ? rawData[0].data : 0; // Initialize with the first data point

  return rawData
    .slice(1) // Skip the first data point as there's no previous value for it
    .filter((item) => item.data >= 0) // Filter out any negative data
    .map((item) => {
      const date = new Date(item.timestamp);
      const hour = date.getHours();

      // Calculate the difference from the previous value
      const relativeValue = previousValue - item.data;

      // Update the previous value to the current one for the next iteration
      previousValue = item.data;

      return {
        value: relativeValue, // The value is now relative to the previous data point (can be positive or negative)
        label: hour.toString(), // The label remains as the hour
      };
    });
}

export default transformData;
