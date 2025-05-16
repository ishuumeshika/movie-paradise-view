import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import MovieHero from '@/components/movie/MovieHero';

// This is a placeholder component. In a real application, 
// you would fetch movie details from a database using the ID from URL params
const MovieDetail = () => {
  const { id } = useParams();
  
  // In a real app, you would fetch movie data based on the ID
  // For now, we'll use placeholder data
  const movie = {
    id: id || '1',
    title: 'Sample Movie',
    tagline: 'A sample movie for demonstration',
    overview: 'This is a placeholder for a movie detail page. In a real application, you would fetch this information from a database or API using the movie ID from the URL parameters.',
    posterPath: '/placeholder.svg',
    backdropPath: '/placeholder.svg',
    releaseDate: '2025',
    runtime: 120,
    voteAverage: 8.5,
    genres: ['Action', 'Drama'],
    cast: [
      { name: 'Actor 1', character: 'Character 1', profilePath: '/placeholder.svg' },
      { name: 'Actor 2', character: 'Character 2', profilePath: '/placeholder.svg' },
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <MovieHero 
        title={movie.title} 
        backdropPath={movie.backdropPath}
        tagline={movie.tagline}
        genres={movie.genres}
        voteAverage={movie.voteAverage}
      />
      
      <div className="container px-4 py-8 md:px-6">
        <Link to="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Button>
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">Overview</h2>
              <p className="text-muted-foreground">{movie.overview}</p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-3">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movie.cast.map((actor, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-muted overflow-hidden mb-2">
                      <img 
                        src={actor.profilePath} 
                        alt={actor.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <p className="font-medium text-sm">{actor.name}</p>
                    <p className="text-xs text-muted-foreground">{actor.character}</p>
                  </div>
                ))}
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
                    <p className="text-sm text-muted-foreground">{movie.voteAverage}/10</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-movie-primary" />
                  <div>
                    <p className="text-sm font-medium">Runtime</p>
                    <p className="text-sm text-muted-foreground">{movie.runtime} min</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-movie-primary" />
                  <div>
                    <p className="text-sm font-medium">Release Year</p>
                    <p className="text-sm text-muted-foreground">{movie.releaseDate}</p>
                  </div>
                </div>
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
