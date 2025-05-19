
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReviewApproval } from '@/services';
import { useToast } from '@/hooks/use-toast';

export const useReviewApproval = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const reviewMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string, isApproved: boolean }) => 
      updateReviewApproval(id, isApproved),
    onSuccess: (data, variables) => {
      // Invalidate both pending and approved reviews queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'approved'] });
      
      toast({
        title: "Success",
        description: variables.isApproved 
          ? "Review approved successfully" 
          : "Review rejected successfully",
      });
    },
    onError: (error: any) => {
      // Improving error logging to help debug issues
      console.error("Error updating review:", error);
      
      // Provide more specific error message if available
      const errorMessage = error?.message || "Failed to update review status. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
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

  return {
    handleApproveReview,
    handleRejectReview,
    isLoading: reviewMutation.isPending,
    isError: reviewMutation.isError,
    error: reviewMutation.error
  };
};
