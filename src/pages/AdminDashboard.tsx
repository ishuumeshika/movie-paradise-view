
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, Film, Star, MessageSquare, Users, PlusCircle, Edit, Trash2, Search 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const movies = [
  {
    id: "1",
    title: "Inception",
    year: 2010,
    rating: 8.8,
    reviews: 42,
  },
  {
    id: "2",
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    reviews: 65,
  },
  {
    id: "3",
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    reviews: 51,
  },
  {
    id: "4",
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.9,
    reviews: 38,
  },
  {
    id: "5",
    title: "Fight Club",
    year: 1999,
    rating: 8.8,
    reviews: 47,
  }
];

const reviews = [
  {
    id: "r1",
    movieTitle: "Inception",
    userName: "John Doe",
    rating: 5,
    comment: "One of the best movies I've ever seen. The concept is mind-blowing and the execution is flawless.",
    date: "2022-05-15"
  },
  {
    id: "r2",
    movieTitle: "The Shawshank Redemption",
    userName: "Jane Smith",
    rating: 4,
    comment: "Great movie with an amazing cast. The plot is complex but rewarding if you pay attention.",
    date: "2022-04-22"
  },
  {
    id: "r3",
    movieTitle: "The Dark Knight",
    userName: "Bob Johnson",
    rating: 4.5,
    comment: "Christopher Nolan has outdone himself again. The visuals are stunning and the story is captivating.",
    date: "2022-03-10"
  }
];

const AdminDashboard = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleDeleteMovie = (id: string, title: string) => {
    toast({
      title: "Movie Deleted",
      description: `${title} has been removed from the database.`
    });
    
    // Here you would normally delete the movie from Supabase
    console.log(`Deleting movie with ID: ${id}`);
  };
  
  const handleApproveReview = (id: string) => {
    toast({
      title: "Review Approved",
      description: "The review has been approved and is now publicly visible."
    });
    
    // Here you would normally update the review in Supabase
    console.log(`Approving review with ID: ${id}`);
  };
  
  const handleDeleteReview = (id: string) => {
    toast({
      title: "Review Deleted",
      description: "The review has been deleted from the database."
    });
    
    // Here you would normally delete the review from Supabase
    console.log(`Deleting review with ID: ${id}`);
  };
  
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage movies, reviews, and users from one place</p>
        </div>
        
        <Link to="/admin/add-movie">
          <Button className="bg-movie-primary hover:bg-movie-secondary">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Movie
          </Button>
        </Link>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-xs text-muted-foreground">+0.3 from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,521</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">+7% from last month</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <Card className="bg-card/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage movies and reviews</CardDescription>
            </div>
            
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="movies">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Year</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden md:table-cell">Reviews</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies.map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell className="font-medium">{movie.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{movie.year}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-movie-accent text-movie-accent mr-1" />
                            {movie.rating}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{movie.reviews}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link to={`/admin/edit-movie/${movie.id}`}>
                              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleDeleteMovie(movie.id, movie.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Movie</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="hidden md:table-cell">Comment</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">{review.movieTitle}</TableCell>
                        <TableCell>{review.userName}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-movie-accent text-movie-accent mr-1" />
                            {review.rating}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {review.comment}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleApproveReview(review.id)}
                              className="h-8 w-8 p-0 hover:bg-green-500 hover:text-white"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Analytics Chart */}
      <Card className="bg-card/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analytics Overview</CardTitle>
              <CardDescription>Movie views and review submissions</CardDescription>
            </div>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground border rounded-md">
            Analytics chart would be displayed here
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
