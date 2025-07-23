const API_KEY = '30b47161062a3e6b81f7060289df3481';
const BASE_URL = 'https://api.themoviedb.org/3';

// Lấy danh sách phim phổ biến
export const fetchPopularMovies = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data.results;
};

// Lấy trailer phim theo movieId
export const fetchMovieTrailer = async (movieId) => {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results.find((v) => v.type === "Trailer" && v.site === "YouTube");
};

// Lấy chi tiết phim theo movieId
export const fetchMovieDetails = async (movieId) => {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
  return await res.json();
};

// Tìm kiếm phim theo từ khóa + phân trang (nếu cần)
export const searchMovies = async (query, page = 1) => {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`);
  const data = await res.json();
  return data.results;
};

// Lấy danh sách phim được đánh giá cao nhất (top rated)
export const fetchTopRatedMovies = async (page = 1) => {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data.results;
};

// Lấy danh sách thể loại phim (genres)
export const getGenres = async () => {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres;
};

// Lấy danh sách đánh giá (reviews) của phim theo movieId
export const getMovieReviews = async (movieId, page = 1) => {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/reviews?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data.results;
};
