
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllReviews } from '@/services';
import DashboardStats from '@/components/admin/DashboardStats';
import ReviewManagement from '@/components/admin/ReviewManagement';
import { useReviewApproval } from '@/hooks/useReviewApproval';

const AdminDashboard = () => {
  // Fetch reviews based on approval status
  const { data: pendingReviews, isLoading: isPendingLoading } = useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: () => getAllReviews(false),
  });

  const { data: approvedReviews, isLoading: isApprovedLoading } = useQuery({
    queryKey: ['reviews', 'approved'],
    queryFn: () => getAllReviews(true),
  });

  // Use the review approval hook
  const { handleApproveReview, handleRejectReview } = useReviewApproval();

  // Total number of movies (hardcoded for now, would ideally come from API)
  const totalMovies = 3;

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <DashboardStats 
        totalMovies={totalMovies}
        pendingReviewsCount={pendingReviews?.length || 0}
        approvedReviewsCount={approvedReviews?.length || 0}
      />
      
      <ReviewManagement 
        pendingReviews={pendingReviews}
        approvedReviews={approvedReviews}
        isPendingLoading={isPendingLoading}
        isApprovedLoading={isApprovedLoading}
        onApprove={handleApproveReview}
        onReject={handleRejectReview}
      />
    </div>
  );
};

export default AdminDashboard;
