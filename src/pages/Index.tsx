
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/movie/MovieCard';
import { TrendingUp, Calendar } from 'lucide-react';

// Mock data
const topRatedMovies = [
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
  }
];

const newReleases = [
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

const MovieSection = ({ title, icon, movies, viewAllLink }: { title: string; icon: React.ReactNode; movies: any[]; viewAllLink: string }) => (
  <section className="py-8">
    <div className="container px-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <Link to={viewAllLink}>
          <Button variant="ghost" size="sm" className="text-sm hover:text-movie-primary">
            View All
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} {...movie} />
        ))}
      </div>
    </div>
  </section>
);

const Index = () => {
  return (
    <div className="pb-8">
      {/* Hero Section with uploaded background image */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        {/* Background Image - Updated with movie collage */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/lovable-uploads/ece404f6-6f2f-4848-bd81-34d090876771.png"
            alt="Movie Collage"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>
        
        {/* Content - Centered in the hero section */}
        <div className="container relative z-10 h-full flex flex-col justify-center items-center px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white text-shadow mb-4">
              Movie <span className="text-movie-primary">Paradise</span>
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Your ultimate destination for movie reviews, ratings, and recommendations. Find the best films, share your thoughts, and discover new favorites.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/browse">
                <Button className="bg-movie-primary hover:bg-movie-secondary">
                  Browse Movies
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="border-white/20 hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Top Rated Movies */}
      <MovieSection 
        title="Top Rated Movies" 
        icon={<TrendingUp className="h-5 w-5 text-movie-accent" />}
        movies={topRatedMovies} 
        viewAllLink="/top-rated" 
      />
      
      {/* New Releases */}
      <MovieSection 
        title="New Releases" 
        icon={<Calendar className="h-5 w-5 text-movie-accent" />}
        movies={newReleases} 
        viewAllLink="/new-releases" 
      />
    </div>
  );
};

export default Index;
