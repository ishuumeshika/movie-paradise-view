
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Clock, Calendar, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MovieHero from '@/components/movie/MovieHero';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface MovieDetails {
  id: string;
  title: string;
  tagline: string | null;
  overview: string;
  poster_url: string;
  background_url: string | null;
  year: number;
  rating: number;
  duration: string;
  genres: string[];
}

interface CastMember {
  id: string;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Review {
  id: string;
  username: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

const MovieDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch movie details
  const { data: movie, isLoading: isLoadingMovie, error: movieError } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as MovieDetails;
    },
    enabled: !!id,
  });

  // Fetch cast members
  const { data: cast, isLoading: isLoadingCast } = useQuery({
    queryKey: ['cast', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cast_members')
        .select('*')
        .eq('movie_id', id);
      
      if (error) throw error;
      return data as CastMember[];
    },
    enabled: !!id,
  });

  // Fetch approved reviews
  const { data: reviews, isLoading: isLoadingReviews, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('movie_id', id)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Review[];
    },
    enabled: !!id,
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

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('reviews').insert({
        movie_id: id,
        username,
        rating: reviewRating,
        comment: reviewComment.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your review has been submitted and is pending approval",
      });

      // Reset form
      setUsername('');
      setReviewRating(5);
      setReviewComment('');
      
      // Refetch reviews to update the list
      refetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading movie details...</p>
      </div>
    );
  }

  if (movieError || !movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
          <p className="text-muted-foreground mb-4">Sorry, the movie you're looking for doesn't exist or has been removed.</p>
          <Link to="/movies">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Movies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MovieHero 
        id={movie.id}
        title={movie.title} 
        backgroundUrl={movie.background_url || '/placeholder.svg'}
        posterUrl={movie.poster_url}
        year={movie.year}
        rating={movie.rating}
        duration={movie.duration}
        genres={movie.genres}
        overview={movie.overview}
      />
      
      <div className="container px-4 py-8 md:px-6">
        <Link to="/movies">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h2 className="text-xl font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground">{movie.overview}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-3">Cast</h2>
              {isLoadingCast ? (
                <p className="text-muted-foreground">Loading cast...</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {cast && cast.length > 0 ? (
                    cast.map((actor) => (
                      <div key={actor.id} className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-muted overflow-hidden mb-2">
                          <img 
                            src={actor.profile_path || '/placeholder.svg'} 
                            alt={actor.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <p className="font-medium text-sm">{actor.name}</p>
                        <p className="text-xs text-muted-foreground">{actor.character}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground col-span-full">No cast information available</p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-bold mb-3 flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-movie-primary" />
                Reviews
              </h2>
              
              {isLoadingReviews ? (
                <p className="text-muted-foreground">Loading reviews...</p>
              ) : (
                <div className="space-y-4">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
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
              )}
              
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
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </form>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-4 shadow-sm border border-border/50">
              <h3 className="font-semibold mb-4">Details</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-movie-primary" />
                  <div>
                    <p className="text-sm font-medium">Rating</p>
                    <p className="text-sm text-muted-foreground">{movie.rating.toFixed(1)}/10</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-movie-primary" />
                  <div>
                    <p className="text-sm font-medium">Runtime</p>
                    <p className="text-sm text-muted-foreground">{movie.duration}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-movie-primary" />
                  <div>
                    <p className="text-sm font-medium">Release Year</p>
                    <p className="text-sm text-muted-foreground">{movie.year}</p>
                  </div>
                </div>
                {movie.tagline && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm italic text-muted-foreground">"{movie.tagline}"</p>
                  </div>
                )}
              </div>
            </div>
            
            <Button className="w-full bg-movie-primary hover:bg-movie-secondary">
              Add to Watchlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
