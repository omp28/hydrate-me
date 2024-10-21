
type RawData = {
  data: number;
  timestamp: string;
};

type TransformedData = {
  value: number;
  label: string;
};

function transformData(rawData: RawData[]): TransformedData[] {
  return rawData
    .filter((item) => item.data >= 0)
    .map((item) => {
      const date = new Date(item.timestamp);
      const hour = date.getHours();
      return {
        value: item.data,
        label: hour.toString(),
      };
    });
}

export default transformData;
