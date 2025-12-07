import api from '../utils/api';

// Lấy danh sách phim phổ biến
export async function fetchPopularMovies(page = 1) {
  const { data } = await api.get(`/movies/popular?page=${page}`);
  return data;
}

// Lấy danh sách phim được đánh giá cao
export async function fetchTopRatedMovies(page = 1) {
  const { data } = await api.get(`/movies/top-rated?page=${page}`);
  return data;
}

// Lấy chi tiết phim (bao gồm cả diễn viên và trailer)
export async function fetchMovieDetails(id) {
  const { data } = await api.get(`/movies/${id}`);
  return data;
}

// Lấy trailer chính thức từ danh sách videos
export async function fetchMovieTrailer(id) {
  const { data } = await api.get(`/movies/${id}`);

  if (!data.videos || !data.videos.results || data.videos.results.length === 0) return null;

  // Ưu tiên trailer chính thức (official)
  const officialTrailer = data.videos.results.find(
    (video) =>
      video.type === "Trailer" &&
      video.site === "YouTube" &&
      video.official === true
  );

  if (officialTrailer) return officialTrailer.key;

  // Nếu không có trailer chính thức, lấy trailer bất kỳ từ YouTube
  const fallbackTrailer = data.videos.results.find(
    (video) =>
      video.type === "Trailer" &&
      video.site === "YouTube"
  );

  return fallbackTrailer ? fallbackTrailer.key : null;
}

// Tìm kiếm phim
export async function searchMovies(query, page = 1) {
  const { data } = await api.get(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`);
  return data;
}

// Lấy đánh giá (reviews) cho phim
export async function getMovieReviews(id) {
  try {
    const { data } = await api.get(`/movies/${id}/reviews`);
    // Backend returns {reviews: [...], totalReviews: X, isFake: boolean}
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { reviews: [], totalReviews: 0 };
  }
}

// Lấy danh sách thể loại (genres)
export async function getGenres() {
  const { data } = await api.get('/movies/genres');
  return data;
}

// Lấy phim theo thể loại
export async function getMoviesByGenre(genreId, page = 1) {
  const { data } = await api.get(`/movies/discover?with_genres=${genreId}&page=${page}`);
  return data;
}

// Lấy các phim tương tự
export async function getSimilarMovies(id) {
  const { data } = await api.get(`/movies/${id}/similar`);
  return data;
}

// Lấy poster của phim, fallback nếu không có
export function getPosterPath(path) {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "https://placehold.co/500x750?text=No+Image";
}

// Lấy backdrop của phim, fallback nếu không có
export function getBackdropPath(path) {
  return path
    ? `https://image.tmdb.org/t/p/original${path}`
    : "https://placehold.co/1280x720?text=No+Backdrop";
}
