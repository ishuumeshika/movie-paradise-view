import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  
  // Check if current user is admin
  useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      return await isAdmin(user.id);
    },
    enabled: !!user?.id,
    meta: {
      onSuccess: (data: boolean) => {
        setAdminStatus(data);
        if (!data) {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
        }
      }
    }
  });

  // Fetch reviews based on approval status
  const { data: pendingReviews, isLoading: isPendingLoading } = useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: () => getAllReviews(false),
    enabled: adminStatus === true,
  });

  const { data: approvedReviews, isLoading: isApprovedLoading } = useQuery({
    queryKey: ['reviews', 'approved'],
    queryFn: () => getAllReviews(true),
    enabled: adminStatus === true,
  });

  // Fetch all movies
  const { data: movies, isLoading: isMoviesLoading } = useQuery({
    queryKey: ['admin-movies'],
    queryFn: getMovies,
    enabled: adminStatus === true,
  });

  // Use the review approval hook
  const { handleApproveReview, handleRejectReview } = useReviewApproval();

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
      
      <Tabs defaultValue="reviews" className="mt-6">
        <TabsList className="mb-6">
          <TabsTrigger value="reviews">Review Management</TabsTrigger>
          <TabsTrigger value="movies">Movie Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews">
          <ReviewManagement 
            pendingReviews={pendingReviews}
            approvedReviews={approvedReviews}
            isPendingLoading={isPendingLoading}
            isApprovedLoading={isApprovedLoading}
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
