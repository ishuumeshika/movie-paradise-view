
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Filter } from 'lucide-react';
import MovieCard from '@/components/movie/MovieCard';
import { useQuery } from '@tanstack/react-query';
import { getMovies, Movie } from '@/services/supabase';

const movieGenres = [
  "All", "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Documentary", "Drama", "Fantasy", "Horror", "Sci-Fi", "Thriller"
];

const Movies = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  // Fetch movies from Supabase
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies
  });

  // Filter movies based on search query and selected genre
  const filteredMovies = movies?.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || 
                        (movie.genres && movie.genres.includes(selectedGenre));
    return matchesSearch && matchesGenre;
  }) || [];

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore Movies</h1>
          <p className="text-muted-foreground">Discover amazing films for every taste</p>
        </div>

        <div className="w-full md:w-auto flex gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-muted-foreground">Loading movies...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive">Error loading movies. Please try again later.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : (
        <Tabs defaultValue="all" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Movie Categories</h2>
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
          
          <TabsList className="overflow-auto pb-2 scrollbar-hide">
            {movieGenres.map(genre => (
              <TabsTrigger 
                key={genre} 
                value={genre.toLowerCase()} 
                onClick={() => setSelectedGenre(genre)}
                className="px-4"
              >
                {genre}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {filteredMovies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  id={movie.id}
                  title={movie.title} 
                  posterUrl={movie.poster_url}
                  year={movie.year}
                  rating={movie.rating}
                  duration={movie.duration}
                  genres={movie.genres || []}
                />
              ))}
            </div>
            
            {filteredMovies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No movies found matching your criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedGenre('All');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default Movies;
