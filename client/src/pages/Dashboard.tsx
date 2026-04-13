import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import API from "../api/axios";

ChartJS.register(ArcElement, Tooltip, Legend);

interface Stats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    API.get("/jobs/stats").then((res) => setStats(res.data));
  }, []);

  const chartData = {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [
      {
        data: stats
          ? [stats.applied, stats.interview, stats.offer, stats.rejected]
          : [0, 0, 0, 0],
        backgroundColor: ["#0d6efd", "#ffc107", "#198754", "#dc3545"],
      },
    ],
  };

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-4">📊 Dashboard</h2>
      <div className="row g-4 mb-5">
        {[
          { label: "Total Applied", value: stats?.total, color: "primary" },
          { label: "Interviews", value: stats?.interview, color: "warning" },
          { label: "Offers", value: stats?.offer, color: "success" },
          { label: "Rejected", value: stats?.rejected, color: "danger" },
        ].map((card) => (
          <div className="col-md-3" key={card.label}>
            <div className={`card border-${card.color} shadow-sm`}>
              <div className="card-body text-center">
                <h1 className={`text-${card.color} fw-bold`}>{card.value ?? 0}</h1>
                <p className="mb-0 text-muted">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h5 className="text-center mb-3">Application Breakdown</h5>
            <Doughnut data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;