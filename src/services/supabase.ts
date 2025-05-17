
// This file provides functions for interacting with our Supabase database

import { supabase } from '@/integrations/supabase/client';

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

// Movie-related functions
export const getMovies = async () => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('title');
  
  if (error) throw error;
  return data as Movie[];
};

export const getTopRatedMovies = async (limit = 5) => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as Movie[];
};

export const getNewReleases = async (limit = 5) => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('year', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data as Movie[];
};

export const getMovieById = async (id: string) => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Movie;
};

// Cast-related functions
export const getCastByMovieId = async (movieId: string) => {
  const { data, error } = await supabase
    .from('cast_members')
    .select('*')
    .eq('movie_id', movieId);
  
  if (error) throw error;
  return data as CastMember[];
};

// Review-related functions
export const getReviewsByMovieId = async (movieId: string, onlyApproved = true) => {
  let query = supabase
    .from('reviews')
    .select('*')
    .eq('movie_id', movieId);
  
  if (onlyApproved) {
    query = query.eq('is_approved', true);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Review[];
};

export const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'is_approved'>) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert(review)
    .select()
    .single();
  
  if (error) throw error;
  return data as Review;
};

// Admin functions
export const getAllReviews = async (approved?: boolean) => {
  let query = supabase.from('reviews').select('*, movies!inner(title)');
  
  if (typeof approved === 'boolean') {
    query = query.eq('is_approved', approved);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const updateReviewApproval = async (id: string, isApproved: boolean) => {
  const { data, error } = await supabase
    .from('reviews')
    .update({ is_approved: isApproved })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Review;
};
