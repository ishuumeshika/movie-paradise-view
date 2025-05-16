
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import AuthForm from '@/components/auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleLogin = async (data: Record<string, string>) => {
    console.log('Login data:', data);
    
    setIsLoading(true);
    
    try {
      toast({
        title: "Logging in...",
        description: "Please wait while we verify your credentials."
      });
      
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to Movie Paradise!"
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = "There was a problem signing you in.";
      
      if (error.message === "Invalid login credentials") {
        errorMessage = "Invalid email or password. Please check your credentials and try again.";
      } else if (error.message.includes("email")) {
        errorMessage = "Invalid email format. Please enter a valid email address.";
      }
      
      toast({
        title: "Login failed",
        description: errorMessage,
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
          <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your account and continue your movie journey
          </p>
        </div>
        
        <AuthForm type="login" onSubmit={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Login;
