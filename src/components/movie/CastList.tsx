
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCastForMovie, CastMember } from '@/services';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { addCastMember, deleteCastMember } from '@/services/adminMovieService';
import { useToast } from '@/hooks/use-toast';
import { isAdmin } from '@/services/adminService';
import { useAuth } from '@/contexts/AuthContext';

interface CastListProps {
  movieId: string;
}

const CastList: React.FC<CastListProps> = ({ movieId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isAddCastOpen, setIsAddCastOpen] = useState(false);
  
  // Check if user is admin
  useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      return await isAdmin(user.id);
    },
    enabled: !!user?.id,
    meta: {
      onSuccess: (data: boolean) => {
        setIsAdminUser(data);
      }
    }
  });

  // Fetch cast members
  const { data: cast, isLoading } = useQuery({
    queryKey: ['cast', movieId],
    queryFn: async () => {
      if (!movieId) throw new Error('No movie ID provided');
      return await getCastForMovie(movieId);
    },
    enabled: !!movieId,
  });

  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm<{
    name: string;
    character: string;
    profile_path: string;
  }>();

  const onSubmit = async (data: { name: string; character: string; profile_path: string }) => {
    try {
      await addCastMember({
        movie_id: movieId,
        name: data.name,
        character: data.character,
        profile_path: data.profile_path,
      });
      
      queryClient.invalidateQueries({ queryKey: ['cast', movieId] });
      toast({
        title: "Success",
        description: "Cast member added successfully",
      });
      
      setIsAddCastOpen(false);
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add cast member",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCastMember(id);
      queryClient.invalidateQueries({ queryKey: ['cast', movieId] });
      toast({
        title: "Success",
        description: "Cast member deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete cast member",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Loading cast...</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold">Cast</h2>
        {isAdminUser && (
          <Button variant="outline" size="sm" onClick={() => setIsAddCastOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Cast Member
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cast && cast.length > 0 ? (
          cast.map((actor: CastMember) => (
            <div key={actor.id} className="flex flex-col items-center text-center relative">
              {isAdminUser && (
                <button
                  onClick={() => handleDelete(actor.id)}
                  className="absolute -top-2 -right-2 bg-destructive rounded-full p-1"
                  aria-label="Delete cast member"
                >
                  <Trash2 className="h-3 w-3 text-white" />
                </button>
              )}
              <Avatar className="w-16 h-16 mb-2">
                <AvatarImage 
                  src={actor.profile_path && actor.profile_path.trim() ? actor.profile_path : '/placeholder.svg'} 
                  alt={actor.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <AvatarFallback>{actor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <p className="font-medium text-sm">{actor.name}</p>
              <p className="text-xs text-muted-foreground">{actor.character}</p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full">No cast information available</p>
        )}
      </div>

      {/* Add Cast Member Sheet */}
      <Sheet open={isAddCastOpen} onOpenChange={setIsAddCastOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Cast Member</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="name">
                  Actor Name *
                </label>
                <Input
                  id="name"
                  {...register("name", { required: "Actor name is required" })}
                />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="character">
                  Character *
                </label>
                <Input
                  id="character"
                  {...register("character", { required: "Character name is required" })}
                />
                {errors.character && <p className="text-destructive text-sm mt-1">{errors.character.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="profile_path">
                  Profile Image URL
                </label>
                <Input
                  id="profile_path"
                  {...register("profile_path")}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-xs text-muted-foreground mt-1">Leave empty to use placeholder</p>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsAddCastOpen(false);
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Cast Member'}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default CastList;
