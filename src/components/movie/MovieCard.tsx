
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Calendar, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  return (
    <Link to={`/movie/${id}`}>
      <Card className="group overflow-hidden rounded-lg border-0 bg-transparent movie-card-hover">
        <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
          {/* Poster Image */}
          <img 
            src={posterUrl}
            alt={`${title} poster`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-4 w-4 fill-movie-accent text-movie-accent" />
              <span className="text-sm font-medium text-white">{rating.toFixed(1)}</span>
            </div>
            
            {/* Movie Details */}
            <div className="flex items-center gap-3 text-xs text-white/80">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{year}</span>
              </div>
              
              {duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{duration}</span>
                </div>
              )}
            </div>
            
            {/* Genres */}
            {genres && genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {genres.slice(0, 2).map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs bg-black/50 text-white border-white/20">
                    {genre}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h3 className="mt-2 line-clamp-1 text-base font-semibold tracking-tight">
          {title}
        </h3>
      </Card>
    </Link>
  );
};

export default MovieCard;
