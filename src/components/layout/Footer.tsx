
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-movie-dark py-8 border-t border-border">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <img src="/src/assets/logo.svg" alt="Movie Paradise Logo" className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight text-white">
                Movie<span className="text-movie-primary">Paradise</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for movie reviews, ratings, and discussions.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/movies" className="text-muted-foreground hover:text-primary transition-colors">Movies</Link>
              </li>
              <li>
                <Link to="/top-rated" className="text-muted-foreground hover:text-primary transition-colors">Top Rated</Link>
              </li>
              <li>
                <Link to="/new-releases" className="text-muted-foreground hover:text-primary transition-colors">New Releases</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Sign In</Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors">Sign Up</Link>
              </li>
              <li>
                <Link to="/profile" className="text-muted-foreground hover:text-primary transition-colors">Profile</Link>
              </li>
              <li>
                <Link to="/watchlist" className="text-muted-foreground hover:text-primary transition-colors">Watchlist</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-lg mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} Movie Paradise. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for movie lovers
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
