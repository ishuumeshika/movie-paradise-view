
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllReviews, getMovies } from '@/services';
import DashboardStats from '@/components/admin/DashboardStats';
import ReviewManagement from '@/components/admin/ReviewManagement';
import { useReviewApproval } from '@/hooks/useReviewApproval';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import MovieManagement from '@/components/admin/MovieManagement';
import { useToast } from '@/hooks/use-toast';
import { isAdmin } from '@/services/adminService';

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [adminStatus, setAdminStatus] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState('reviews');
  const queryClient = useQueryClient();
  
  // Check if current user is admin
  const { isLoading: isAdminCheckLoading } = useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      try {
        const isAdminResult = await isAdmin(user.id);
        setAdminStatus(isAdminResult);
        
        if (!isAdminResult) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
        }
        
        return isAdminResult;
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Failed to check admin privileges.",
          variant: "destructive",
        });
        return false;
      }
    },
    enabled: !!user?.id,
    refetchOnWindowFocus: false,
    refetchInterval: false,
  });

  // Fetch reviews based on approval status with more frequent updates
  const { data: pendingReviews, isLoading: isPendingLoading } = useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: () => getAllReviews(false),
    enabled: adminStatus === true,
    staleTime: 0, // Consider data always stale
    refetchOnWindowFocus: true,
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  const { data: approvedReviews, isLoading: isApprovedLoading } = useQuery({
    queryKey: ['reviews', 'approved'],
    queryFn: () => getAllReviews(true),
    enabled: adminStatus === true,
    staleTime: 0, // Consider data always stale
    refetchOnWindowFocus: true,
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Fetch all movies
  const { data: movies, isLoading: isMoviesLoading } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: getMovies,
    enabled: adminStatus === true,
    staleTime: 0, // Consider data always stale
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Use the review approval hook
  const { 
    handleApproveReview, 
    handleRejectReview, 
    isLoading: isReviewActionLoading 
  } = useReviewApproval();

  // Handle tab change and refresh related data immediately
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Immediately refresh the data for the newly selected tab
    if (value === 'reviews') {
      console.log('Switching to reviews tab, refreshing reviews data');
      queryClient.invalidateQueries({ queryKey: ['reviews', 'pending'] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'approved'] });
    } else if (value === 'movies') {
      console.log('Switching to movies tab, refreshing movies data');
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
    }
  };

  if (isAdminCheckLoading) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-muted-foreground">Loading admin status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-muted-foreground">Please login to access the admin dashboard.</p>
      </div>
    );
  }

  if (adminStatus === false) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <DashboardStats 
        totalMovies={movies?.length || 0}
        pendingReviewsCount={pendingReviews?.length || 0}
        approvedReviewsCount={approvedReviews?.length || 0}
      />
      
      <Tabs defaultValue="reviews" className="mt-6" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="reviews">Review Management</TabsTrigger>
          <TabsTrigger value="movies">Movie Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews">
          <ReviewManagement 
            pendingReviews={pendingReviews}
            approvedReviews={approvedReviews}
            isPendingLoading={isPendingLoading || isReviewActionLoading}
            isApprovedLoading={isApprovedLoading || isReviewActionLoading}
            onApprove={handleApproveReview}
            onReject={handleRejectReview}
          />
        </TabsContent>
        
        <TabsContent value="movies">
          <MovieManagement movies={movies} isLoading={isMoviesLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
