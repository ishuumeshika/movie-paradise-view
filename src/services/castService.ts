
// Cast-related service functions

import { supabase } from '@/integrations/supabase/client';
import { CastMember } from './types';

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
