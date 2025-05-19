
import { supabase } from '@/integrations/supabase/client';

/**
 * Check if a user is an admin
 */
export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .rpc('is_admin', { uid: userId });
    
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error("Exception in isAdmin check:", error);
    return false;
  }
};

/**
 * Add a user as admin
 */
export const addAdmin = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_users')
      .insert({ id: userId });
    
    if (error) {
      console.error("Error adding admin:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Exception in addAdmin:", error);
    return false;
  }
};
