
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
            <p className="text-lg">{user.email}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Account created</h3>
            <p className="text-lg">{new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="mr-2" onClick={() => navigate('/')}>
            Back to Home
          </Button>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">My Watchlist</h2>
        <Card>
          <CardContent className="py-6">
            <div className="text-center py-8 text-muted-foreground">
              <p>You haven't added any movies to your watchlist yet.</p>
              <Button 
                variant="link" 
                className="text-movie-primary"
                onClick={() => navigate('/')}
              >
                Browse movies to add to your watchlist
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
