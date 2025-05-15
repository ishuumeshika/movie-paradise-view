
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import AuthForm from '@/components/auth/AuthForm';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogin = (data: Record<string, string>) => {
    console.log('Login data:', data);
    
    // Here you would normally connect to Supabase and authenticate the user
    // For now, let's simulate a login with a timeout
    toast({
      title: "Logging in...",
      description: "Please wait while we verify your credentials."
    });
    
    setTimeout(() => {
      toast({
        title: "Login successful",
        description: "Welcome back to Movie Paradise!"
      });
      navigate('/');
    }, 1500);
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
        
        <AuthForm type="login" onSubmit={handleLogin} />
      </div>
    </div>
  );
};

export default Login;
