import React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface DataPoint {
  date: string;
  value: number;
}

interface ArimaChartProps {
  data: DataPoint[]; // Accepts data as a prop
}

const ArimaChart: React.FC<ArimaChartProps> = ({ data }) => {
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
