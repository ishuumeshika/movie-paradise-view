
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { getMovieById } from '@/services/supabase';
import MovieHero from '@/components/movie/MovieHero';
import ReviewForm from '@/components/movie/ReviewForm';
import ReviewList from '@/components/movie/ReviewList';
import CastList from '@/components/movie/CastList';
import MovieDetails from '@/components/movie/MovieDetails';

const MovieDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();

  // Fetch movie details
  const { data: movie, isLoading: isLoadingMovie, error: movieError } = useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      if (!id) throw new Error('No movie ID provided');
      return await getMovieById(id);
    },
    enabled: !!id,
  });

  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: "This movie has been added to your watchlist",
    });
  };

  if (isLoadingMovie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading movie details...</p>
      </div>
    );
  }

  if (movieError || !movie) {
    console.error('Error loading movie:', movieError);
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
        posterUrl={movie.poster_url || '/placeholder.svg'}
        year={movie.year}
        rating={movie.rating}
        duration={movie.duration}
        genres={movie.genres}
        overview={movie.overview}
        onAddToWatchlist={handleAddToWatchlist}
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
            
            <CastList movieId={movie.id} />
            
            <ReviewList movieId={movie.id} />
            
            <ReviewForm movieId={movie.id} />
          </div>
          
          <div>
            <MovieDetails movie={movie} onAddToWatchlist={handleAddToWatchlist} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
