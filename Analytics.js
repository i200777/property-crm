"use client";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

export default function Analytics({ leads }) {

  const statusData = [
    { name: "New", value: leads.filter(l => l.status === "New").length },
    { name: "Closed", value: leads.filter(l => l.status === "Closed").length }
  ];

  const priorityData = [
    { name: "High", value: leads.filter(l => l.score === "High").length },
    { name: "Medium", value: leads.filter(l => l.score === "Medium").length },
    { name: "Low", value: leads.filter(l => l.score === "Low").length }
  ];

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white p-4 rounded shadow">
        <h2>Status</h2>
        <PieChart width={300} height={300}>
          <Pie data={statusData} dataKey="value">
            <Cell />
            <Cell />
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2>Priority</h2>
        <PieChart width={300} height={300}>
          <Pie data={priorityData} dataKey="value">
            <Cell />
            <Cell />
            <Cell />
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
}