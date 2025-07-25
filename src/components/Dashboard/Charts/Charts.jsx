import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import "./Charts.css";

// Define color scheme for pie chart slices
const COLORS = ["#F44336", "#6366f1", "#22c55e"];

//Expects 'stats' prop: array of objects with {title, value}
const Charts = ({ stats }) => {
  // Convert stats data for use in BarChart.
  // Attempt to parse values as numbers and removing any non-digit characters if value is a string
  const barData = stats.map((item) => ({
    name: item.title,
    value:
      typeof item.value === "string"
        ? parseInt(item.value.replace(/\D/g, "")) || 0 // Remove non-digit chars and parse as int
        : item.value,
  }));

  // Prepare pie chart data for select order statuses only
  // Filter to only "Pending Orders", "Order Processing", "Order Completed"
  const pieData = stats
    .filter(
      (item) =>
        item.title === "Pending Orders" ||
        item.title === "Order Processing" ||
        item.title === "Order Completed"
    )
    .map((item) => ({
      name: item.title,
      value: parseInt(item.value), // Parse value as number for chart
    }));

  return (
    <div className="charts-container">
      {/* <h3
        className="section-title"
        style={{ textAlign: "center", color: "#2B6CB0" }}>
        Statistics Overview
      </h3> */}
      <div className="charts-wrapper">
        {/* Bar Chart: Displays all stats as bars */}
        <div className="bar-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" /> {/* Names on horizontal axis */}
              {/* Numeric scale on vertical axis */}
              <YAxis />
              {/* Shows details on hover */}
              <Tooltip />
              {/* Shows what each color means */}
              <Legend />
              {/* Bars colored blue */}
              <Bar dataKey="value" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart: Visualizes order status breakdown only */}
        <div className="pie-chart">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label>
                {/* Assigns distinct colors to pie slices */}
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip /> {/* Shows details on hover */}
              <Legend /> {/* Shows what each color means */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
