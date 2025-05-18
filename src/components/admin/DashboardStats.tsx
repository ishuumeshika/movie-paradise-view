
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Film, MessageSquare, Check } from 'lucide-react';

interface DashboardStatsProps {
  totalMovies: number;
  pendingReviewsCount: number;
  approvedReviewsCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalMovies,
  pendingReviewsCount,
  approvedReviewsCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
          <Film className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMovies}</div>
          <p className="text-xs text-muted-foreground">
            Movies in the database
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingReviewsCount}</div>
          <p className="text-xs text-muted-foreground">
            Reviews awaiting approval
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved Reviews</CardTitle>
          <Check className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedReviewsCount}</div>
          <p className="text-xs text-muted-foreground">
            Published reviews
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
