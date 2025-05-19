
// Common types used across our Supabase services

// Types for our database tables
export interface Movie {
  id: string;
  title: string;
  tagline?: string;
  overview: string;
  poster_url: string;
  background_url?: string;
  year: number;
  rating: number;
  duration: string;
  genres: string[];
  created_at: string;
  updated_at: string;
  trailer_url?: string;
  download_url?: string;
}

export interface CastMember {
  id: string;
  movie_id: string;
  name: string;
  character: string;
  profile_path?: string;
  created_at: string;
}

export interface Review {
  id: string;
  movie_id: string;
  user_id?: string;
  username: string;
  rating: number;
  comment?: string;
  created_at: string;
  is_approved: boolean;
}
