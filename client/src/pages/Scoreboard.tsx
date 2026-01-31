import { Bar, Line } from 'react-chartjs-2';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const mockData = {
  events: [
    {
      name: 'Dance Battle',
      colleges: [
        { name: 'ABC College', score: 85 },
        { name: 'XYZ University', score: 92 },
        { name: 'PQR Institute', score: 78 },
      ],
    },
    {
      name: 'Hack-a-thon',
      colleges: [
        { name: 'ABC College', score: 95 },
        { name: 'XYZ University', score: 88 },
        { name: 'PQR Institute', score: 82 },
      ],
    },
  ],
};

const Scoreboard = () => {
  const [activeTab, setActiveTab] = useState('table');

  // Colors for colleges
  const collegeColors = {
    border: ['rgb(147, 51, 234)', 'rgb(59, 130, 246)', 'rgb(16, 185, 129)'],
    background: ['rgba(147, 51, 234, 0.5)', 'rgba(59, 130, 246, 0.5)', 'rgba(16, 185, 129, 0.5)'],
  };

  const eventScores = {
    labels: mockData.events.map((event) => event.name),
    datasets: mockData.events[0].colleges.map((college, index) => ({
      label: college.name,
      data: mockData.events.map((event) =>
        event.colleges.find((c) => c.name === college.name)?.score || 0
      ),
      backgroundColor: collegeColors.background[index % collegeColors.background.length],
      borderColor: collegeColors.border[index % collegeColors.border.length],
      borderWidth: 1,
    })),
  };

  const collegePerformance = {
    labels: mockData.events[0].colleges.map((college) => college.name),
    datasets: [
      {
        label: 'Average Score',
        data: mockData.events[0].colleges.map((college) => {
          const scores = mockData.events.map(
            (event) => event.colleges.find((c) => c.name === college.name)?.score || 0
          );
          return scores.reduce((a, b) => a + b, 0) / scores.length;
        }),
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 12,
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: window.innerWidth < 768 ? 10 : 14,
        },
        titleFont: {
          size: window.innerWidth < 768 ? 12 : 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 768 ? 10 : 12,
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <Link to="/dashboard" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold">Event Scoreboard</h1>
          </div>

          {/* Mobile tab navigation */}
          <div className="flex bg-gray-700 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-2 text-sm ${activeTab === 'table' ? 'bg-purple-700' : 'bg-transparent'}`}
            >
              Scores
            </button>
            <button
              onClick={() => setActiveTab('bar')}
              className={`px-3 py-2 text-sm ${activeTab === 'bar' ? 'bg-purple-700' : 'bg-transparent'}`}
            >
              By Event
            </button>
            <button
              onClick={() => setActiveTab('line')}
              className={`px-3 py-2 text-sm ${activeTab === 'line' ? 'bg-purple-700' : 'bg-transparent'}`}
            >
              Overall
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Detailed Scores Table */}
        <div
          className={`${activeTab === 'table' ? 'block' : 'hidden sm:block'} bg-gray-800 p-4 sm:p-6 rounded-lg`}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4">Detailed Scores</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead className="bg-gray-700">
                <tr>
                  <th className="p-2 sm:p-4">Event</th>
                  {mockData.events[0].colleges.map((college) => (
                    <th key={college.name} className="p-2 sm:p-4">
                      {college.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockData.events.map((event) => (
                  <tr key={event.name} className="border-t border-gray-700">
                    <td className="p-2 sm:p-4">{event.name}</td>
                    {event.colleges.map((college) => (
                      <td key={college.name} className="p-2 sm:p-4">
                        {college.score}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Scores */}
        <div
          className={`${activeTab === 'bar' ? 'block' : 'hidden sm:block'} bg-gray-800 p-4 sm:p-6 rounded-lg`}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4">Event Scores by College</h2>
          <div className="bg-gray-700 p-2 sm:p-4 rounded-lg">
            <div className="h-64 sm:h-80">
              <Bar data={eventScores} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Overall College Performance */}
        <div
          className={`${activeTab === 'line' ? 'block' : 'hidden sm:block'} bg-gray-800 p-4 sm:p-6 rounded-lg`}
        >
          <h2 className="text-lg sm:text-xl font-bold mb-4">Overall College Performance</h2>
          <div className="bg-gray-700 p-2 sm:p-4 rounded-lg">
            <div className="h-64 sm:h-80">
              <Line data={collegePerformance} options={chartOptions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scoreboard;