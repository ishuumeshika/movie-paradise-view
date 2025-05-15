
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import AuthForm from '@/components/auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleRegister = async (data: Record<string, string>) => {
    console.log('Register data:', data);
    
    setIsLoading(true);
    
    try {
      toast({
        title: "Creating your account...",
        description: "Please wait while we set up your new account."
      });
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please check your email for confirmation."
      });
      
      // For better UX, navigate to login instead of homepage since they need to confirm email
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "There was a problem creating your account.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to start your movie journey with Movie Paradise
          </p>
        </div>
        
        <AuthForm type="register" onSubmit={handleRegister} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Register;
