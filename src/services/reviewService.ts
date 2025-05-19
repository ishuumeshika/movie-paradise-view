
// Review-related service functions

import { supabase } from '@/integrations/supabase/client';
import { Review } from './types';

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
    // First check if the review exists
    const { data: existingReview, error: checkError } = await supabase
      .from('reviews')
      .select('id, is_approved')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error(`Error checking review ${id}:`, checkError);
      throw checkError;
    }
    
    if (!existingReview) {
      console.error(`No review found with id: ${id}`);
      throw new Error(`No review found with id: ${id}`);
    }
    
    // If the review is already in the desired state, just return it
    if (existingReview.is_approved === isApproved) {
      console.log(`Review ${id} is already ${isApproved ? 'approved' : 'rejected'}`);
      return existingReview;
    }
    
    // Update the review after confirming it exists
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: isApproved })
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating review ${id}:`, error);
      throw error;
    }
    
    // After successful update, fetch the updated review
    const { data: updatedReview, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error(`Error fetching updated review ${id}:`, fetchError);
      throw fetchError;
    }
    
    if (!updatedReview) {
      console.error(`Could not fetch updated review ${id}`);
      throw new Error(`Could not fetch updated review ${id}`);
    }
    
    console.log(`Review ${id} successfully updated and fetched`);
    return updatedReview as Review;
  } catch (error) {
    console.error(`Exception in updateReviewApproval(${id}, ${isApproved}):`, error);
    throw error;
  }
};
