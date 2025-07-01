// Charts.jsx
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

const COLORS = ["#F44336", "#6366f1", "#22c55e"];

const Charts = ({ stats }) => {
  const barData = stats.map((item) => ({
    name: item.title,
    value:
      typeof item.value === "string"
        ? parseInt(item.value.replace(/\D/g, "")) || 0
        : item.value,
  }));

  const pieData = stats
    .filter(
      (item) =>
        item.title === "Pending Orders" ||
        item.title === "Order Processing" ||
        item.title === "Order Completed"
    )
    .map((item) => ({
      name: item.title,
      value: parseInt(item.value),
    }));

  return (
    <div className="charts-container">
      <h3
        className="section-title"
        style={{ textAlign: "center", color: "#2B6CB0" }}>
        Statistics Overview
      </h3>
      <div className="charts-wrapper">
        <div className="bar-chart">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>

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
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
