
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ApprovedReviewsTableProps {
  reviews: any[] | null;
  isLoading: boolean;
}

const ApprovedReviewsTable: React.FC<ApprovedReviewsTableProps> = ({
  reviews,
  isLoading
}) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading approved reviews...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return <div className="text-center py-4">No approved reviews</div>;
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
          <TableHead>Status</TableHead>
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
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                Approved
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ApprovedReviewsTable;
