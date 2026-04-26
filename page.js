"use client";
import { useEffect, useState } from "react";
import Analytics from "@/components/Analytics";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetch("/api/leads", {
      headers: {
        authorization: localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(setLeads);
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-3xl font-bold mb-6">CRM Dashboard</h1>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card title="Total Leads" value={leads.length} />
        <Card title="High Priority" value={leads.filter(l => l.score === "High").length} />
        <Card title="Medium" value={leads.filter(l => l.score === "Medium").length} />
        <Card title="Low" value={leads.filter(l => l.score === "Low").length} />
      </div>

      {/* ANALYTICS */}
      <Analytics leads={leads} />

      {/* TABLE */}
      <div className="bg-white mt-6 p-4 rounded shadow">
        <h2 className="text-xl mb-4">Leads</h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th>Name</th>
              <th>Budget</th>
              <th>Score</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leads.map(l => (
              <tr key={l._id} className="border-b">
                <td>{l.name}</td>
                <td>{l.budget}</td>
                <td>
                  <span className={
                    l.score === "High" ? "text-red-500" :
                    l.score === "Medium" ? "text-yellow-500" :
                    "text-green-500"
                  }>
                    {l.score}
                  </span>
                </td>
                <td>{l.status}</td>
                <td>
                  <a
                    href={`https://wa.me/92${l.phone}`}
                    target="_blank"
                    className="text-blue-500"
                  >
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}