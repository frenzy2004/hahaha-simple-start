import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface SeasonalDemandChartProps {
  data: { month: string; demand: number; change: number }[];
}

const SeasonalDemandChart: React.FC<SeasonalDemandChartProps> = ({ data }) => {
  // Smart collision detection for labels
  const getAnnotationPositions = () => {
    const annotations: Array<{
      index: number;
      type: 'peak' | 'low';
      demand: number;
      month: string;
      left: number;
      top: number;
    }> = [];

    data.forEach((item, index) => {
      const isPeak = item.demand > 90;
      const isLow = item.demand < 80;
      
      if (isPeak || isLow) {
        annotations.push({
          index,
          type: isPeak ? 'peak' : 'low',
          demand: item.demand,
          month: item.month,
          left: (index / (data.length - 1)) * 100,
          top: 20,
        });
      }
    });

    // Apply collision detection and staggering
    const minDistance = 15; // Minimum distance between labels in percentage
    const staggerOffset = 25; // Vertical offset for staggered labels

    for (let i = 1; i < annotations.length; i++) {
      const current = annotations[i];
      const previous = annotations[i - 1];
      
      if (Math.abs(current.left - previous.left) < minDistance) {
        // Stagger the current annotation
        current.top = previous.top + staggerOffset;
        
        // If it would go too far down, move it up instead
        if (current.top > 70) {
          current.top = Math.max(previous.top - staggerOffset, 5);
        }
      }
    }

    return annotations;
  };

  const chartData = {
    labels: data.map(d => d.month),
    datasets: [
      {
        label: 'Demand Score',
        data: data.map(d => d.demand),
        borderColor: 'hsl(199, 89%, 48%)',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'hsl(199, 89%, 48%)',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
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
        callbacks: {
          label: (context: TooltipItem<'line'>) => {
            const index = context.dataIndex;
            const change = data[index].change;
            const changeText = change >= 0 ? `+${change}%` : `${change}%`;
            const changeColor = change >= 0 ? 'increase' : 'decrease';
            return [
              `Demand: ${context.parsed.y}`,
              `Change: ${changeText} (${changeColor})`,
            ];
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'hsl(199, 89%, 48%)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 60,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const annotations = getAnnotationPositions();

  return (
    <div className="bg-card rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 animate-fade-in">
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded-t-lg -m-6 mb-6">
        <h3 className="text-lg font-semibold">Seasonal Demand Trends</h3>
        <p className="text-white/80 text-sm">Monthly demand patterns throughout the year</p>
      </div>
      <div className="relative h-96 mb-4">
        {annotations.map((annotation) => (
          <div
            key={`${annotation.index}-${annotation.type}`}
            className={`absolute text-xs px-3 py-1.5 rounded-full font-medium shadow-sm transition-all duration-300 hover:scale-105 ${
              annotation.type === 'peak' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
            style={{
              left: `${annotation.left}%`,
              top: `${annotation.top}px`,
              transform: 'translateX(-50%)',
              zIndex: 10,
            }}
          >
            {annotation.type === 'peak' ? 'Peak Season' : 'Low Season'}
            <div className="text-xs opacity-75 mt-0.5">
              {annotation.month}: {annotation.demand}
            </div>
          </div>
        ))}
        <Line data={chartData} options={options} />
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {Math.max(...data.map(d => d.demand))}
          </div>
          <div className="text-xs text-muted-foreground">Peak Demand</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {Math.min(...data.map(d => d.demand))}
          </div>
          <div className="text-xs text-muted-foreground">Low Demand</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {(data.reduce((sum, d) => sum + d.demand, 0) / data.length).toFixed(0)}
          </div>
          <div className="text-xs text-muted-foreground">Average</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-foreground">
            {(data.reduce((sum, d) => sum + Math.abs(d.change), 0) / data.length).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Avg Change</div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalDemandChart;