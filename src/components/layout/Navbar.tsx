
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search functionality here
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e50914" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 11.551V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7.551"/>
                <path d="m18 2-8.4 7.77m8.4 12.23-8.4-7.77M10 2v10l-7 6v-3.3a4 4 0 0 1 1.9-3.4L10 8"/>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:inline-block">
              Movie<span className="text-movie-primary">Paradise</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-movie-primary transition-colors">Home</Link>
            <Link to="/movies" className="text-sm font-medium hover:text-movie-primary transition-colors">Movies</Link>
            <Link to="/top-rated" className="text-sm font-medium hover:text-movie-primary transition-colors">Top Rated</Link>
            <Link to="/new-releases" className="text-sm font-medium hover:text-movie-primary transition-colors">New Releases</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
            <Input
              type="search"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[200px] lg:w-[300px] bg-secondary/50"
            />
            <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
          </form>
          
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="hover:text-movie-primary">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-movie-primary hover:bg-movie-secondary">
                Sign Up
              </Button>
            </Link>
          </div>
          
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background border-t border-border">
          <div className="container flex flex-col p-6 space-y-4">
            <form onSubmit={handleSearch} className="relative flex items-center mb-4">
              <Input
                type="search"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
            </form>
            
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-lg font-medium hover:text-movie-primary" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/movies" className="text-lg font-medium hover:text-movie-primary" onClick={toggleMenu}>
                Movies
              </Link>
              <Link to="/top-rated" className="text-lg font-medium hover:text-movie-primary" onClick={toggleMenu}>
                Top Rated
              </Link>
              <Link to="/new-releases" className="text-lg font-medium hover:text-movie-primary" onClick={toggleMenu}>
                New Releases
              </Link>
            </nav>
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-border">
              <Link to="/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={toggleMenu}>
                <Button className="w-full bg-movie-primary hover:bg-movie-secondary">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
