
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCastByMovieId, CastMember } from '@/services';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface CastListProps {
  movieId: string;
}

const CastList: React.FC<CastListProps> = ({ movieId }) => {
  // Fetch cast members
  const { data: cast, isLoading } = useQuery({
    queryKey: ['cast', movieId],
    queryFn: async () => {
      if (!movieId) throw new Error('No movie ID provided');
      return await getCastByMovieId(movieId);
    },
    enabled: !!movieId,
  });

  if (isLoading) {
    return <p className="text-muted-foreground">Loading cast...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Cast</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cast && cast.length > 0 ? (
          cast.map((actor: CastMember) => (
            <div key={actor.id} className="flex flex-col items-center text-center">
              <Avatar className="w-16 h-16 mb-2">
                {/* Check if profile_path exists and is not empty before using it */}
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
    </div>
  );
};

export default CastList;
