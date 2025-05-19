
import { supabase } from '@/integrations/supabase/client';
import { Movie } from './types';

/**
 * Create a new movie
 */
export const createMovie = async (movieData: Omit<Movie, 'id' | 'created_at' | 'updated_at'>): Promise<Movie> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .insert(movieData)
      .select()
      .single();
    
    if (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
    
    return data as Movie;
  } catch (error) {
    console.error("Exception in createMovie:", error);
    throw error;
  }
};

/**
 * Update an existing movie
 */
export const updateMovie = async (id: string, movieData: Partial<Movie>): Promise<Movie> => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .update(movieData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating movie ${id}:`, error);
      throw error;
    }
    
    return data as Movie;
  } catch (error) {
    console.error(`Exception in updateMovie(${id}):`, error);
    throw error;
  }
};

/**
 * Delete a movie
 */
export const deleteMovie = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting movie ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Exception in deleteMovie(${id}):`, error);
    throw error;
  }
};

/**
 * Get cast members for a specific movie
 */
export const getCastByMovieId = async (movieId: string) => {
  try {
    const { data, error } = await supabase
      .from('cast_members')
      .select('*')
      .eq('movie_id', movieId);
    
    if (error) {
      console.error(`Error fetching cast for movie ${movieId}:`, error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error(`Exception in getCastByMovieId(${movieId}):`, error);
    throw error;
  }
};

/**
 * Add a cast member to a movie
 */
export const addCastMember = async (castData: {
  movie_id: string;
  name: string;
  character: string;
  profile_path?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('cast_members')
      .insert(castData)
      .select()
      .single();
    
    if (error) {
      console.error("Error adding cast member:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Exception in addCastMember:", error);
    throw error;
  }
};

/**
 * Delete a cast member
 */
export const deleteCastMember = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('cast_members')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting cast member ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Exception in deleteCastMember(${id}):`, error);
    throw error;
  }
};
