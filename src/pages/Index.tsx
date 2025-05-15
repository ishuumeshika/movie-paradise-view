
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/movie/MovieCard';
import { Play, Star, TrendingUp, Calendar } from 'lucide-react';

// Mock data
const featuredMovie = {
  id: "1",
  title: "Inception",
  backgroundUrl: "/lovable-uploads/58e1c07a-c185-4cbf-9980-c8510d036797.png", // Using the second uploaded image
  year: 2010,
  rating: 8.8,
  duration: "2h 28m",
  genres: ["Sci-Fi", "Action", "Thriller"],
  overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  director: "Christopher Nolan"
};

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
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={featuredMovie.backgroundUrl}
            alt="Featured movie background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
        </div>
        
        {/* Content */}
        <div className="container relative z-10 h-full flex flex-col justify-end px-4 pb-16 md:pb-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-movie-accent text-movie-accent" />
                <span className="font-medium text-white">{featuredMovie.rating.toFixed(1)}</span>
              </div>
              <span className="text-white/80">•</span>
              <span className="text-white/80">{featuredMovie.year}</span>
              <span className="text-white/80">•</span>
              <span className="text-white/80">{featuredMovie.duration}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white text-shadow mb-4">
              {featuredMovie.title}
            </h1>
            
            <div className="mb-6 flex flex-wrap gap-2">
              {featuredMovie.genres.map((genre) => (
                <span 
                  key={genre} 
                  className="px-3 py-1 text-xs md:text-sm bg-white/10 rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            <p className="text-white/80 text-sm md:text-base mb-8 max-w-xl line-clamp-3">
              {featuredMovie.overview}
            </p>
            
            <div className="flex gap-4">
              <Link to={`/movie/${featuredMovie.id}`}>
                <Button className="bg-movie-primary hover:bg-movie-secondary">
                  <Play className="mr-2 h-4 w-4" />
                  Watch Trailer
                </Button>
              </Link>
              <Link to="/browse">
                <Button variant="outline" className="border-white/20 hover:bg-white/10">
                  Browse Movies
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* App Introduction Section */}
      <section className="py-16 bg-gradient-to-b from-background to-black/90">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Welcome to <span className="text-movie-primary">Movie Paradise</span></h2>
          <p className="text-white/70 max-w-2xl mx-auto mb-8">
            Your ultimate destination for movie reviews, ratings, and recommendations. Browse our collection of top-rated films, discover new releases, and join our community to share your thoughts.
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
