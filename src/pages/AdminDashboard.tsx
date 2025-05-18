
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, Film, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllReviews, updateReviewApproval } from '@/services';

const AdminDashboard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('pending');

  // Fetch reviews based on approval status
  const { data: pendingReviews, isLoading: isPendingLoading } = useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: () => getAllReviews(false),
  });

  const { data: approvedReviews, isLoading: isApprovedLoading } = useQuery({
    queryKey: ['reviews', 'approved'],
    queryFn: () => getAllReviews(true),
  });

  // Mutation for approving/rejecting reviews
  const reviewMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string, isApproved: boolean }) => 
      updateReviewApproval(id, isApproved),
    onSuccess: () => {
      // Invalidate both pending and approved reviews queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      
      toast({
        title: "Success",
        description: "Review status updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating review:", error);
      toast({
        title: "Error",
        description: "Failed to update review status. Please check console for details.",
        variant: "destructive",
      });
    },
  });

  const handleApproveReview = (id: string) => {
    console.log(`Approving review with id: ${id}`);
    reviewMutation.mutate({ id, isApproved: true });
  };

  const handleRejectReview = (id: string) => {
    console.log(`Rejecting review with id: ${id}`);
    reviewMutation.mutate({ id, isApproved: false });
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
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
            <div className="text-2xl font-bold">{pendingReviews?.length || 0}</div>
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
            <div className="text-2xl font-bold">{approvedReviews?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Published reviews
            </p>
          </CardContent>
        </Card>
      </div>
      
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
                  {isPendingLoading ? (
                    <div className="text-center py-4">Loading pending reviews...</div>
                  ) : pendingReviews && pendingReviews.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Movie</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Comment</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingReviews.map((review: any) => (
                          <TableRow key={review.id}>
                            <TableCell>{review.username}</TableCell>
                            <TableCell>{review.movies?.title}</TableCell>
                            <TableCell>{review.rating}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {review.comment || 'No comment'}
                            </TableCell>
                            <TableCell>
                              {new Date(review.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="sm" 
                                  variant="outline" 
                                  className="w-8 h-8 p-0" 
                                  onClick={() => handleApproveReview(review.id)}
                                >
                                  <Check className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline" 
                                  className="w-8 h-8 p-0"
                                  onClick={() => handleRejectReview(review.id)}
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">No pending reviews</div>
                  )}
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
                  {isApprovedLoading ? (
                    <div className="text-center py-4">Loading approved reviews...</div>
                  ) : approvedReviews && approvedReviews.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Movie</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Comment</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {approvedReviews.map((review: any) => (
                          <TableRow key={review.id}>
                            <TableCell>{review.username}</TableCell>
                            <TableCell>{review.movies?.title}</TableCell>
                            <TableCell>{review.rating}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {review.comment || 'No comment'}
                            </TableCell>
                            <TableCell>
                              {new Date(review.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                                Approved
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">No approved reviews</div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
