
import React from 'react';
import { Play, Star, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface MovieHeroProps {
  id: string;
  title: string;
  backgroundUrl: string;
  posterUrl: string;
  year: number;
  rating: number;
  duration?: string;
  genres?: string[];
  overview: string;
  trailerUrl?: string;
  onAddToWatchlist?: () => void;
}

const MovieHero: React.FC<MovieHeroProps> = ({
  title,
  backgroundUrl,
  posterUrl,
  year,
  rating,
  duration,
  genres,
  overview,
  trailerUrl,
  onAddToWatchlist
}) => {
  const { toast } = useToast();
  
  // Ensure image URLs have valid defaults
  const safeBackgroundUrl = backgroundUrl?.trim() ? backgroundUrl : '/placeholder.svg';
  const safePosterUrl = posterUrl?.trim() ? posterUrl : '/placeholder.svg';
  
  const handleWatchTrailer = () => {
    if (trailerUrl) {
      window.open(trailerUrl, '_blank');
    } else {
      toast({
        title: "Trailer Not Available",
        description: "Sorry, the trailer for this movie is not available at the moment.",
      });
    }
  };

  return (
    <div className="relative w-full">
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={safeBackgroundUrl}
          alt={`${title} background`}
          className="h-full w-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="relative w-40 md:w-72 aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
              <img 
                src={safePosterUrl}
                alt={`${title} poster`} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
          
          {/* Movie Info */}
          <div className="flex flex-col max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white text-shadow">
              {title}
            </h1>
            
            {/* Meta */}
            <div className="mt-4 flex items-center gap-4 text-sm md:text-base text-white/80">
              {year && <span>{year}</span>}
              {duration && <span>•</span>}
              {duration && <span>{duration}</span>}
              {rating && <span>•</span>}
              {rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-movie-accent text-movie-accent" />
                  <span className="font-medium text-white">{rating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <span 
                    key={genre} 
                    className="px-3 py-1 text-xs md:text-sm bg-white/10 rounded-full"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            
            {/* Overview */}
            <p className="mt-6 text-sm md:text-base text-white/80 line-clamp-4">
              {overview}
            </p>
            
            {/* Actions */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button className="bg-movie-primary hover:bg-movie-secondary" onClick={handleWatchTrailer}>
                <Play className="mr-2 h-4 w-4" />
                Watch Trailer
              </Button>
              
              <Button variant="outline" className="border-white/20 hover:bg-white/10" onClick={onAddToWatchlist}>
                <Plus className="mr-2 h-4 w-4" />
                Add to Watchlist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHero;
