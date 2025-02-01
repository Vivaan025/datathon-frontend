import React, { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DataPoint {
  date: string;
  value: number;
}

const ArimaChart: React.FC = () => {
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    // Dummy data
    const dummyData: DataPoint[] = [
      { date: "2023-01-01", value: 100 },
      { date: "2023-02-01", value: 110 },
      { date: "2023-03-01", value: 105 },
      { date: "2023-04-01", value: 115 },
      { date: "2023-05-01", value: 120 },
    ];
    setData(dummyData);
  }, []);

  return (
    <div className="w-full p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">ARIMA Model Predictions</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ArimaChart;