import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function ScoreVisualization({ score, className = '' }) {
  const percentage = Math.round(score);

  const data = {
    datasets: [
      {
        data: [percentage, 100 - percentage],
        backgroundColor: ['#3B82F6', '#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    cutout: '70%',
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-32 h-32">
        <Doughnut data={data} options={options} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600 text-center">ATS Score</p>
    </div>
  );
}

export default ScoreVisualization;