
import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Clock, Calendar } from 'lucide-react';
import { Movie } from '@/services';

interface MovieDetailsProps {
  movie: Movie;
  onAddToWatchlist?: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, onAddToWatchlist }) => {
  return (
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
      
      <Button 
        className="w-full bg-movie-primary hover:bg-movie-secondary"
        onClick={onAddToWatchlist}
      >
        Add to Watchlist
      </Button>
    </div>
  );
};

export default MovieDetails;
