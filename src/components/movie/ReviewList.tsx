
import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getReviewsByMovieId, Review } from '@/services/supabase';

interface ReviewListProps {
  movieId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ movieId }) => {
  // Fetch approved reviews
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['reviews', movieId],
    queryFn: async () => {
      if (!movieId) throw new Error('No movie ID provided');
      return await getReviewsByMovieId(movieId, true);
    },
    enabled: !!movieId,
  });
  
  if (isLoading) {
    return <p className="text-muted-foreground">Loading reviews...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3 flex items-center">
        <MessageSquare className="mr-2 h-5 w-5 text-movie-primary" />
        Reviews
      </h2>
      
      <div className="space-y-4">
        {reviews && reviews.length > 0 ? (
          reviews.map((review: Review) => (
            <div key={review.id} className="bg-card rounded-lg p-4 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{review.username}</h3>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-movie-accent text-movie-accent" />
                  <span className="ml-1 text-sm font-medium">{review.rating.toFixed(1)}</span>
                </div>
              </div>
              {review.comment && <p className="text-muted-foreground text-sm">{review.comment}</p>}
              <p className="text-xs text-muted-foreground mt-2">
                {new Date(review.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
