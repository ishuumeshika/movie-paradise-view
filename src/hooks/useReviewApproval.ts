
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReviewApproval } from '@/services';
import { useToast } from '@/hooks/use-toast';

export const useReviewApproval = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  return {
    handleApproveReview,
    handleRejectReview,
    isLoading: reviewMutation.isPending,
    isError: reviewMutation.isError,
    error: reviewMutation.error
  };
};
