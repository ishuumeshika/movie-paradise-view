
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { Review } from '@/services/types';

interface PendingReviewsTableProps {
  reviews: any[] | null;
  isLoading: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const PendingReviewsTable: React.FC<PendingReviewsTableProps> = ({
  reviews,
  isLoading,
  onApprove,
  onReject
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading pending reviews...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="text-center py-4">No pending reviews</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Movie</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Comment</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.id}>
            <TableCell>{review.username}</TableCell>
            <TableCell>{review.movies?.title}</TableCell>
            <TableCell>{review.rating}</TableCell>
            <TableCell className="max-w-xs truncate">
              {review.comment || 'No comment'}
            </TableCell>
            <TableCell>
              {new Date(review.created_at).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm" 
                  variant="outline" 
                  className="w-8 h-8 p-0" 
                  onClick={() => onApprove(review.id)}
                >
                  <Check className="h-4 w-4 text-green-600" />
                </Button>
                <Button 
                  size="sm"
                  variant="outline" 
                  className="w-8 h-8 p-0"
                  onClick={() => onReject(review.id)}
                >
                  <X className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default PendingReviewsTable;
