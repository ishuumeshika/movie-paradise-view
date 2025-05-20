
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
      // Force refresh data after mutation succeeds
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
      console.error("Error updating review:", error);
      const errorMessage = error?.message || "Failed to update review status";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleApproveReview = async (id: string) => {
    console.log(`Approving review with id: ${id}`);
    try {
      await reviewMutation.mutateAsync({ id, isApproved: true });
    } catch (error) {
      console.error("Error in handleApproveReview:", error);
    }
  };

  const handleRejectReview = async (id: string) => {
    console.log(`Rejecting review with id: ${id}`);
    try {
      await reviewMutation.mutateAsync({ id, isApproved: false });
    } catch (error) {
      console.error("Error in handleRejectReview:", error);
    }
  };

  return {
    handleApproveReview,
    handleRejectReview,
    isLoading: reviewMutation.isPending,
    isError: reviewMutation.isError,
    error: reviewMutation.error
  };
};
