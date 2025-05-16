
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Search, Filter } from 'lucide-react';
import MovieCard from '@/components/movie/MovieCard';

// Using the same mock data from Index.tsx for now
// In a real app, this would come from Supabase
const allMovies = [
  {
    id: "1",
    title: "Transformers",
    posterUrl: "/lovable-uploads/ce4fab71-4763-4809-85fc-3d9334dc557a.png",
    year: 2023,
    rating: 8.5,
    duration: "2h 30m",
    genres: ["Action", "Sci-Fi"]
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    year: 1994,
    rating: 9.3,
    duration: "2h 22m",
    genres: ["Drama", "Crime"]
  },
  {
    id: "3",
    title: "The Dark Knight",
    posterUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    year: 2008,
    rating: 9.0,
    duration: "2h 32m",
    genres: ["Action", "Crime"]
  },
  {
    id: "4",
    title: "Pulp Fiction",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    year: 1994,
    rating: 8.9,
    duration: "2h 34m",
    genres: ["Crime", "Drama"]
  },
  {
    id: "5",
    title: "Fight Club",
    posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    year: 1999,
    rating: 8.8,
    duration: "2h 19m",
    genres: ["Drama", "Thriller"]
  },
  {
    id: "6",
    title: "Dune",
    posterUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    year: 2021,
    rating: 8.0,
    duration: "2h 35m",
    genres: ["Sci-Fi", "Adventure"]
  },
  {
    id: "7",
    title: "No Time to Die",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    year: 2021,
    rating: 7.3,
    duration: "2h 43m",
    genres: ["Action", "Adventure"]
  },
  {
    id: "8",
    title: "The Batman",
    posterUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    year: 2022,
    rating: 7.9,
    duration: "2h 56m",
    genres: ["Action", "Crime"]
  },
  {
    id: "9",
    title: "Top Gun: Maverick",
    posterUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    year: 2022,
    rating: 8.3,
    duration: "2h 10m",
    genres: ["Action", "Drama"]
  },
  {
    id: "10",
    title: "Spider-Man: No Way Home",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    year: 2021,
    rating: 8.2,
    duration: "2h 28m",
    genres: ["Action", "Adventure"]
  }
];

const movieGenres = [
  "All", "Action", "Adventure", "Animation", "Comedy", "Crime", 
  "Documentary", "Drama", "Fantasy", "Horror", "Sci-Fi", "Thriller"
];

const Movies = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedGenre, setSelectedGenre] = React.useState('All');
  
  // Filter movies based on search query and selected genre
  const filteredMovies = allMovies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === 'All' || movie.genres.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

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
              <MovieCard key={movie.id} {...movie} />
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
    </div>
  );
};

export default Movies;
