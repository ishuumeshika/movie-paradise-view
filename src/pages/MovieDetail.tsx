
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import MovieHero from '@/components/movie/MovieHero';
import { Star, Download, Youtube, Calendar, Clock, User } from 'lucide-react';

// Mock data
const movie = {
  id: "1",
  title: "Inception",
  posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  backgroundUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
  year: 2010,
  rating: 8.8,
  duration: "2h 28m",
  genres: ["Sci-Fi", "Action", "Thriller"],
  overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  director: "Christopher Nolan",
  cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page", "Tom Hardy", "Ken Watanabe"],
  trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
  downloadUrl: "#"
};

// Mock reviews
const reviews = [
  {
    id: "r1",
    userName: "John Doe",
    rating: 5,
    comment: "One of the best movies I've ever seen. The concept is mind-blowing and the execution is flawless.",
    date: "2022-05-15"
  },
  {
    id: "r2",
    userName: "Jane Smith",
    rating: 4,
    comment: "Great movie with an amazing cast. The plot is complex but rewarding if you pay attention.",
    date: "2022-04-22"
  },
  {
    id: "r3",
    userName: "Bob Johnson",
    rating: 4.5,
    comment: "Christopher Nolan has outdone himself again. The visuals are stunning and the story is captivating.",
    date: "2022-03-10"
  }
];

const MovieDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState<number | null>(null);
  
  const handleAddToWatchlist = () => {
    toast({
      title: "Added to Watchlist",
      description: `${movie.title} has been added to your watchlist.`
    });
  };
  
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userRating) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would normally save the review to Supabase
    toast({
      title: "Review Submitted",
      description: "Thank you for your review!"
    });
    
    setReviewText('');
    setUserRating(null);
  };

  return (
    <div className="pb-16">
      <MovieHero 
        {...movie}
        onAddToWatchlist={handleAddToWatchlist}
      />
      
      <div className="container px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold mb-4">Synopsis</h2>
                <p className="text-muted-foreground">{movie.overview}</p>
                
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Cast</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.cast.map((actor) => (
                      <span 
                        key={actor} 
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Release Year</p>
                        <p className="font-medium">{movie.year}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-medium">{movie.duration}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Director</p>
                        <p className="font-medium">{movie.director}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 flex flex-col gap-3">
                      <Button className="w-full">
                        <Youtube className="mr-2 h-4 w-4" />
                        Watch on YouTube
                      </Button>
                      
                      <Button variant="outline" className="w-full">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-8">
            {/* Submit Review */}
            <Card className="bg-card/50 border-border/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <p className="text-sm mb-2">Rate this movie:</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setUserRating(rating)}
                          className="p-1"
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              userRating && rating <= userRating 
                                ? 'fill-movie-accent text-movie-accent' 
                                : 'text-muted-foreground'
                            }`}
                          />
                        </button>
                      ))}
                      {userRating && (
                        <span className="ml-2 text-sm text-muted-foreground">
                          ({userRating}/5)
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Textarea
                      placeholder="Share your thoughts about this movie..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="bg-movie-primary hover:bg-movie-secondary">
                    Submit Review
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {/* Reviews List */}
            <div>
              <h3 className="text-xl font-semibold mb-4">User Reviews</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="bg-card/50 border-border/50">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{review.userName}</p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'fill-movie-accent text-movie-accent' 
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-3">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MovieDetail;
