import React from 'react';
import { Star, TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface KPICardsProps {
  kpis: {
    avgRating: number;
    monthlyDemand: number;
    rentSensitivity: number;
    competitorCount: number;
    revenuePotential: number;
  };
}

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const cards = [
    {
      title: 'Revenue Potential',
      value: (kpis.revenuePotential / 1000).toFixed(0),
      unit: 'K RM',
      icon: Target,
      color: 'bg-primary',
      bgColor: 'bg-primary-light',
      textColor: 'text-primary',
      borderColor: 'border-primary/20',
    },
    {
      title: 'Competitor Count',
      value: kpis.competitorCount.toString(),
      unit: '',
      icon: Users,
      color: 'bg-destructive',
      bgColor: 'bg-destructive/10',
      textColor: 'text-destructive',
      borderColor: 'border-destructive/20',
    },
    {
      title: 'Avg Rating',
      value: kpis.avgRating.toFixed(1),
      unit: '⭐',
      icon: Star,
      color: 'bg-warning',
      bgColor: 'bg-warning-light',
      textColor: 'text-warning',
      borderColor: 'border-warning/20',
    },
    {
      title: 'Est. Monthly Demand',
      value: (kpis.monthlyDemand / 1000).toFixed(1),
      unit: 'K visits',
      icon: TrendingUp,
      color: 'bg-success',
      bgColor: 'bg-success-light',
      textColor: 'text-success',
      borderColor: 'border-success/20',
    },
    {
      title: 'Rent Sensitivity',
      value: kpis.rentSensitivity.toString(),
      unit: '/100',
      icon: DollarSign,
      color: 'bg-accent',
      bgColor: 'bg-accent-light',
      textColor: 'text-accent',
      borderColor: 'border-accent/20',
    },

  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-card-bg ${card.borderColor} border rounded-xl p-6 transition-all duration-200 hover:border-border card min-h-[140px] flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 ${card.color} rounded-lg`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <div className={`text-3xl font-bold ${card.textColor} mb-1.5 leading-tight`}>
              {card.value}
              <span className="text-lg font-medium ml-1 opacity-80">{card.unit}</span>
            </div>
            <div className="text-sm text-muted-foreground font-medium leading-tight">{card.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;