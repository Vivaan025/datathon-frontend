import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    trend: number;
    trendLabel: string;
  }
  
  const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    description,
    trend,
    trendLabel,
  }) => {
    const isPositive = trend > 0;
  
    return (
      <Card className="p-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-sm text-gray-600">{description}</p>
            <div className="flex items-center space-x-1">
              <span className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? (
                  <ArrowUpIcon className="w-4 h-4" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4" />
                )}
                {Math.abs(trend)}%
              </span>
              <span className="text-sm text-gray-500">{trendLabel}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  export default StatCard;
  