
import React, { useState } from 'react';
import { Movie } from '@/services/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import MovieForm from './MovieForm';
import { useToast } from '@/hooks/use-toast';
import { deleteMovie } from '@/services/adminMovieService';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface MovieManagementProps {
  movies: Movie[] | null;
  isLoading: boolean;
}

const MovieManagement: React.FC<MovieManagementProps> = ({ movies, isLoading }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false);
  const [isEditMovieOpen, setIsEditMovieOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  
  const handleCloseAddMovie = () => {
    setIsAddMovieOpen(false);
  };
  
  const handleCloseEditMovie = () => {
    setIsEditMovieOpen(false);
    setSelectedMovie(null);
  };
  
  const handleEditMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsEditMovieOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!movieToDelete) return;
    
    try {
      await deleteMovie(movieToDelete.id);
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      toast({
        title: "Success",
        description: `"${movieToDelete.title}" has been deleted.`,
      });
      setMovieToDelete(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the movie. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading movies...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Movie Management</h2>
        <Button onClick={() => setIsAddMovieOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Movie
        </Button>
      </div>

      {movies && movies.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-medium">{movie.title}</TableCell>
                  <TableCell>{movie.year}</TableCell>
                  <TableCell>{movie.rating?.toFixed(1) || 'N/A'}</TableCell>
                  <TableCell>{movie.duration}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="icon" className="mr-2" onClick={() => handleEditMovie(movie)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-destructive"
                      onClick={() => setMovieToDelete(movie)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-muted-foreground">No movies found.</p>
      )}

      {/* Add Movie Sheet */}
      <Sheet open={isAddMovieOpen} onOpenChange={setIsAddMovieOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Movie</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <MovieForm onClose={handleCloseAddMovie} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit Movie Sheet */}
      <Sheet open={isEditMovieOpen} onOpenChange={setIsEditMovieOpen}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Movie</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedMovie && (
              <MovieForm movie={selectedMovie} onClose={handleCloseEditMovie} />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!movieToDelete} onOpenChange={(open) => !open && setMovieToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Movie</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{movieToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MovieManagement;
