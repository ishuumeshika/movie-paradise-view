
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import AuthForm from '@/components/auth/AuthForm';

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleRegister = (data: Record<string, string>) => {
    console.log('Register data:', data);
    
    // Here you would normally connect to Supabase and create a new user
    // For now, let's simulate registration with a timeout
    toast({
      title: "Creating your account...",
      description: "Please wait while we set up your new account."
    });
    
    setTimeout(() => {
      toast({
        title: "Registration successful",
        description: "Your account has been created. Welcome to Movie Paradise!"
      });
      navigate('/');
    }, 1500);
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
        
        <AuthForm type="register" onSubmit={handleRegister} />
      </div>
    </div>
  );
};

export default Register;
