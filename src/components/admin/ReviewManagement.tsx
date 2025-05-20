
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PendingReviewsTable from './PendingReviewsTable';
import ApprovedReviewsTable from './ApprovedReviewsTable';
import { useQueryClient } from '@tanstack/react-query';

interface ReviewManagementProps {
  pendingReviews: any[] | null;
  approvedReviews: any[] | null;
  isPendingLoading: boolean;
  isApprovedLoading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const ReviewManagement: React.FC<ReviewManagementProps> = ({
  pendingReviews,
  approvedReviews,
  isPendingLoading,
  isApprovedLoading,
  onApprove,
  onReject
}) => {
  const [activeTab, setActiveTab] = useState('pending');
  const queryClient = useQueryClient();
  
  // Force refresh review data when tab changes or when component mounts
  useEffect(() => {
    const refreshData = () => {
      if (activeTab === 'approved') {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'approved'] });
      } else if (activeTab === 'pending') {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
      }
    };
    
    // Refresh data on mount and tab change
    refreshData();
    
    // Set up interval to refresh data periodically
    const intervalId = setInterval(refreshData, 10000); // Refresh every 10 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [activeTab, queryClient]);

  // Custom handlers that will refresh data after action
  const handleApprove = async (id: string) => {
    await onApprove(id);
    // Force refresh both tabs data
    queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
    queryClient.invalidateQueries({ queryKey: ['reviews', 'approved'] });
  };

  const handleReject = async (id: string) => {
    await onReject(id);
    // Force refresh pending data
    queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Review Management</h2>
        <Tabs defaultValue="pending" onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
            <TabsTrigger value="approved">Approved Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
                <CardDescription>
                  Reviews waiting for your approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PendingReviewsTable 
                  reviews={pendingReviews} 
                  isLoading={isPendingLoading} 
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="approved">
            <Card>
              <CardHeader>
                <CardTitle>Approved Reviews</CardTitle>
                <CardDescription>
                  Reviews that are visible to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ApprovedReviewsTable 
                  reviews={approvedReviews} 
                  isLoading={isApprovedLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReviewManagement;
