
// Main services index file that re-exports all services

export * from './types';
export * from './movieService';
export { getCastByMovieId as getCastForMovie } from './castService';
export * from './reviewService';
export * from './adminService';
export * from './adminMovieService';
