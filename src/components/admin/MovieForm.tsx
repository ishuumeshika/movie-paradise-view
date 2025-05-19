
import React from 'react';
import { useForm } from 'react-hook-form';
import { Movie } from '@/services/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { createMovie, updateMovie } from '@/services/adminMovieService';

interface MovieFormData {
  title: string;
  year: number;
  overview: string;
  tagline?: string;
  duration: string;
  genres: string;
  rating?: number;
  poster_url: string;
  background_url?: string;
  trailer_url?: string;
  download_url?: string;
}

interface MovieFormProps {
  movie?: Movie;
  onClose: () => void;
}

const MovieForm: React.FC<MovieFormProps> = ({ movie, onClose }) => {
  const isEditMode = !!movie;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MovieFormData>({
    defaultValues: movie
      ? {
          ...movie,
          genres: movie.genres.join(', '),
          rating: movie.rating || undefined,
        }
      : undefined,
  });

  const onSubmit = async (data: MovieFormData) => {
    try {
      // Convert comma-separated genres to array
      const genresArray = data.genres.split(',').map(g => g.trim()).filter(Boolean);
      
      const movieData = {
        ...data,
        genres: genresArray,
        year: Number(data.year),
        rating: data.rating ? Number(data.rating) : null,
      };

      if (isEditMode && movie) {
        await updateMovie(movie.id, movieData);
        toast({
          title: "Success",
          description: "Movie updated successfully",
        });
      } else {
        await createMovie(movieData);
        toast({
          title: "Success",
          description: "Movie created successfully",
        });
      }
      
      // Refresh movie data
      queryClient.invalidateQueries({ queryKey: ['admin-movies'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      
      onClose();
    } catch (error) {
      console.error("Error saving movie:", error);
      toast({
        title: "Error",
        description: "Failed to save movie. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="title">
            Title *
          </label>
          <Input
            id="title"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && <p className="text-destructive text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="year">
              Year *
            </label>
            <Input
              id="year"
              type="number"
              {...register("year", { 
                required: "Year is required",
                min: { value: 1900, message: "Year must be after 1900" },
                max: { value: 2100, message: "Year must be before 2100" }
              })}
            />
            {errors.year && <p className="text-destructive text-sm mt-1">{errors.year.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="rating">
              Rating
            </label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              {...register("rating", { 
                min: { value: 0, message: "Rating must be at least 0" },
                max: { value: 10, message: "Rating must be at most 10" }
              })}
            />
            {errors.rating && <p className="text-destructive text-sm mt-1">{errors.rating.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="tagline">
            Tagline
          </label>
          <Input id="tagline" {...register("tagline")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="duration">
            Duration *
          </label>
          <Input 
            id="duration" 
            placeholder="2h 30m" 
            {...register("duration", { required: "Duration is required" })}
          />
          {errors.duration && <p className="text-destructive text-sm mt-1">{errors.duration.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="genres">
            Genres *
          </label>
          <Input 
            id="genres" 
            placeholder="Action, Adventure, Sci-Fi" 
            {...register("genres", { required: "At least one genre is required" })}
          />
          <p className="text-xs text-muted-foreground mt-1">Separate genres with commas</p>
          {errors.genres && <p className="text-destructive text-sm mt-1">{errors.genres.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="overview">
            Overview *
          </label>
          <Textarea
            id="overview"
            rows={4}
            {...register("overview", { required: "Overview is required" })}
          />
          {errors.overview && <p className="text-destructive text-sm mt-1">{errors.overview.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="poster_url">
            Poster URL *
          </label>
          <Input
            id="poster_url"
            {...register("poster_url", { required: "Poster URL is required" })}
          />
          {errors.poster_url && <p className="text-destructive text-sm mt-1">{errors.poster_url.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="background_url">
            Background URL
          </label>
          <Input id="background_url" {...register("background_url")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="trailer_url">
            Trailer URL
          </label>
          <Input id="trailer_url" {...register("trailer_url")} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="download_url">
            Download URL
          </label>
          <Input id="download_url" {...register("download_url")} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : isEditMode ? 'Update Movie' : 'Add Movie'}
        </Button>
      </div>
    </form>
  );
};

export default MovieForm;
