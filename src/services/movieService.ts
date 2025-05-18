
// Movie-related service functions

import { supabase } from '@/integrations/supabase/client';
import { Movie } from './types';

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
    // Basic UUID validation check
    const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidPattern.test(id)) {
      console.error(`Invalid UUID format for movie ID: ${id}`);
      throw new Error(`Movie ID '${id}' is not in valid UUID format`);
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
    
    if (!data) {
      console.error(`No movie found with ID: ${id}`);
      throw new Error(`No movie found with ID: ${id}`);
    }
    
    console.log(`Successfully retrieved movie: ${data?.title}`);
    return data as Movie;
  } catch (error) {
    console.error(`Exception in getMovieById(${id}):`, error);
    throw error;
  }
};
