
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  year: number;
  rating: number;
  duration?: string;
  genres?: string[];
}

const MovieCard: React.FC<MovieCardProps> = ({
  id,
  title,
  posterUrl,
  year,
  rating,
  duration,
  genres
}) => {
  // Ensure posterUrl has a valid default if it's undefined or empty
  const imageUrl = posterUrl?.trim() ? posterUrl : '/placeholder.svg';

  return (
    <Link to={`/movie/${id}`} className="block">
      <div className="relative overflow-hidden rounded-lg movie-card-hover">
        <div className="aspect-[2/3] bg-muted">
          <img
            src={imageUrl}
            alt={`${title} poster`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Overlay content when hovered */}
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center gap-1 mb-1">
            <Star className="h-4 w-4 fill-movie-accent text-movie-accent" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
          
          <h3 className="font-medium text-sm truncate">{title}</h3>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <span>{year}</span>
            {duration && (
              <>
                <span className="mx-1">•</span>
                <span>{duration}</span>
              </>
            )}
            {genres && genres.length > 0 && (
              <>
                <span className="mx-1">•</span>
                <span className="truncate">{genres[0]}{genres[1] ? `, ${genres[1]}` : ''}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
