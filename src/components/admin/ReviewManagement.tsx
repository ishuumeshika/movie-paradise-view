
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import PendingReviewsTable from './PendingReviewsTable';
import ApprovedReviewsTable from './ApprovedReviewsTable';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // Refresh data when tab changes or component mounts with decreased interval (3s)
  useEffect(() => {
    const refreshData = () => {
      console.log('Refreshing review data for tab:', activeTab);
      if (activeTab === 'approved') {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'approved'] });
      } else if (activeTab === 'pending') {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
      }
    };
    
    // Initial refresh
    refreshData();
    
    // Refresh every 3 seconds
    const intervalId = setInterval(refreshData, 3000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [activeTab, queryClient]);

  const handleApprove = async (id: string) => {
    try {
      console.log('Handling approve review:', id);
      await onApprove(id);
      
      // Force refresh both tabs data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
        queryClient.invalidateQueries({ queryKey: ['reviews', 'approved'] });
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve review",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      console.log('Handling reject review:', id);
      await onReject(id);
      
      // Force refresh pending data
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject review",
        variant: "destructive",
      });
    }
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
