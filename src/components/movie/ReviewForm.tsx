
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addReview } from '@/services/supabase';

interface ReviewFormProps {
  movieId: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ movieId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [username, setUsername] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');

  // Use mutation for adding reviews
  const reviewMutation = useMutation({
    mutationFn: (reviewData: {
      movie_id: string;
      username: string;
      rating: number;
      comment: string | null;
    }) => addReview(reviewData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Your review has been submitted and is pending approval",
      });
      
      // Reset form
      setUsername('');
      setReviewRating(5);
      setReviewComment('');
      
      // Refetch reviews to update the list
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
    },
    onError: (error) => {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Please enter a username",
        variant: "destructive",
      });
      return;
    }
    
    // Log the data we're submitting
    console.log("Submitting review with data:", {
      movie_id: movieId,
      username,
      rating: reviewRating,
      comment: reviewComment.trim() || null
    });
    
    reviewMutation.mutate({
      movie_id: movieId,
      username,
      rating: reviewRating,
      comment: reviewComment.trim() || null,
    });
  };

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3">Write a Review</h3>
      <form onSubmit={handleSubmitReview} className="space-y-4">
        <div>
          <label htmlFor="username" className="text-sm font-medium block mb-1">Your Name</label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="rating" className="text-sm font-medium block mb-1">Rating</label>
          <div className="flex items-center">
            <select
              id="rating"
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="bg-background border border-input rounded-md p-2"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="ml-2 text-sm text-muted-foreground">/ 10</span>
          </div>
        </div>
        
        <div>
          <label htmlFor="comment" className="text-sm font-medium block mb-1">Your Review (Optional)</label>
          <Textarea
            id="comment"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your thoughts about this movie"
            rows={4}
          />
        </div>
        
        <Button 
          type="submit" 
          className="bg-movie-primary hover:bg-movie-secondary"
          disabled={reviewMutation.isPending}
        >
          {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </div>
  );
};

export default ReviewForm;
