
import React, { useState } from 'react';
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
  
  const handleApprove = async (id: string) => {
    try {
      console.log('Handling approve review:', id);
      await onApprove(id);
      
      // Force refresh both tabs data
      queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'approved'] });
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      console.log('Handling reject review:', id);
      await onReject(id);
      
      // Force refresh pending data
      queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
    } catch (error) {
      console.error('Error rejecting review:', error);
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
