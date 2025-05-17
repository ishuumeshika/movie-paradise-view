
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
  console.log("Fetching all movies");
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('title');
  
  if (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
  
  console.log(`Retrieved ${data?.length || 0} movies`);
  return data as Movie[];
};

export const getTopRatedMovies = async (limit = 5) => {
  console.log(`Fetching top ${limit} rated movies`);
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('rating', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching top rated movies:", error);
    throw error;
  }
  
  console.log(`Retrieved ${data?.length || 0} top rated movies`);
  return data as Movie[];
};

export const getNewReleases = async (limit = 5) => {
  console.log(`Fetching ${limit} new releases`);
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('year', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error("Error fetching new releases:", error);
    throw error;
  }
  
  console.log(`Retrieved ${data?.length || 0} new releases`);
  return data as Movie[];
};

export const getMovieById = async (id: string) => {
  console.log(`Fetching movie with ID: ${id}`);
  
  if (!id) {
    console.error("Invalid movie ID provided");
    throw new Error("Invalid movie ID");
  }
  
  try {
    // UUID validation check (basic pattern)
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      console.error(`Invalid UUID format for movie ID: ${id}`);
      throw new Error("Invalid movie ID format");
    }
    
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching movie ${id}:`, error);
      throw error;
    }
    
    console.log(`Successfully retrieved movie: ${data?.title}`);
    return data as Movie;
  } catch (error) {
    console.error(`Exception in getMovieById(${id}):`, error);
    throw error;
  }
};

// Cast-related functions
export const getCastByMovieId = async (movieId: string) => {
  console.log(`Fetching cast for movie ID: ${movieId}`);
  
  if (!movieId) {
    console.error("Invalid movie ID provided for cast");
    throw new Error("Invalid movie ID");
  }
  
  try {
    const { data, error } = await supabase
      .from('cast_members')
      .select('*')
      .eq('movie_id', movieId);
    
    if (error) {
      console.error(`Error fetching cast for movie ${movieId}:`, error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} cast members for movie ${movieId}`);
    return data as CastMember[];
  } catch (error) {
    console.error(`Exception in getCastByMovieId(${movieId}):`, error);
    throw error;
  }
};

// Review-related functions
export const getReviewsByMovieId = async (movieId: string, onlyApproved = true) => {
  console.log(`Fetching reviews for movie ID: ${movieId}, only approved: ${onlyApproved}`);
  
  if (!movieId) {
    console.error("Invalid movie ID provided for reviews");
    throw new Error("Invalid movie ID");
  }
  
  try {
    let query = supabase
      .from('reviews')
      .select('*')
      .eq('movie_id', movieId);
    
    if (onlyApproved) {
      query = query.eq('is_approved', true);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching reviews for movie ${movieId}:`, error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} reviews for movie ${movieId}`);
    return data as Review[];
  } catch (error) {
    console.error(`Exception in getReviewsByMovieId(${movieId}):`, error);
    throw error;
  }
};

export const addReview = async (review: Omit<Review, 'id' | 'created_at' | 'is_approved'>) => {
  console.log(`Adding review for movie: ${review.movie_id}`);
  
  try {
    // Add console log to see what data we're inserting
    console.log("Review data being inserted:", review);
    
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...review,
        is_approved: false // Explicitly set is_approved to false
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding review:", error);
      throw error;
    }
    
    console.log(`Review added successfully with ID: ${data.id}`);
    return data as Review;
  } catch (error) {
    console.error("Exception in addReview:", error);
    throw error;
  }
};

// Admin functions
export const getAllReviews = async (approved?: boolean) => {
  console.log(`Fetching all reviews, approved filter: ${approved}`);
  
  try {
    let query = supabase.from('reviews').select('*, movies!inner(title)');
    
    if (typeof approved === 'boolean') {
      query = query.eq('is_approved', approved);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching all reviews:", error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} reviews`);
    return data;
  } catch (error) {
    console.error("Exception in getAllReviews:", error);
    throw error;
  }
};

export const updateReviewApproval = async (id: string, isApproved: boolean) => {
  console.log(`Updating review ${id} approval status to: ${isApproved}`);
  
  try {
    const { data, error } = await supabase
      .from('reviews')
      .update({ is_approved: isApproved })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
    
    console.log(`Review ${id} successfully updated`);
    return data as Review;
  } catch (error) {
    console.error(`Exception in updateReviewApproval(${id}, ${isApproved}):`, error);
    throw error;
  }
};
