import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieCharts";
import StatCard from "@/components/charts/InfoCards";

const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      
      {/* Stat Cards inside one common Card */}
      <Card className="p-4 shadow-md sm:w-full md:col-span-2 xl:col-span-3">
        <CardHeader>
          <CardTitle>Stats Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Stat Card for Total Revenue */}
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            description="Total revenue this month"
            trend={20.1}
            trendLabel="vs last month"
          />
          {/* Stat Card for Active Users */}
          <StatCard
            title="Active Users"
            value="2,350"
            description="Active users this week"
            trend={-4.5}
            trendLabel="vs last week"
          />
          {/* Stat Card for Conversion Rate */}
          <StatCard
            title="Conversion Rate"
            value="3.2%"
            description="Current conversion rate"
            trend={12.3}
            trendLabel="vs last quarter"
          />
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card className="p-4 shadow-md">
        <CardHeader>
          <CardTitle>Line Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-40">
          <LineChart />
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="p-4 shadow-md">
        <CardHeader>
          <CardTitle>Bar Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-40">
          <BarChart labels={["Label1", "Label2", "Label3"]} data={[10, 20, 30]} />
        </CardContent>
      </Card>

      {/* Pie Chart (Full Width on Small Screens) */}
      <Card className=" sm:w-full p-4 shadow-md md:col-span-2">
        <CardHeader>
          <CardTitle>Pie Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-40">
          <PieChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
