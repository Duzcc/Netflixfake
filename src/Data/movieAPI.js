const API_KEY = "30b47161062a3e6b81f7060289df3481";
const BASE_URL = "https://api.themoviedb.org/3";

// Lấy danh sách phim phổ biến
export async function fetchPopularMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data.results;
}

// Lấy danh sách phim được đánh giá cao
export async function fetchTopRatedMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`);
  const data = await res.json();
  return data.results;
}

// Lấy chi tiết phim (bao gồm cả diễn viên và trailer)
export async function fetchMovieDetails(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`);
  const data = await res.json();
  return data;
}

// Lấy trailer chính thức từ danh sách videos
export async function fetchMovieTrailer(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();

  if (!data.results || data.results.length === 0) return null;

  // Ưu tiên trailer chính thức (official)
  const officialTrailer = data.results.find(
    (video) =>
      video.type === "Trailer" &&
      video.site === "YouTube" &&
      video.official === true
  );

  if (officialTrailer) return officialTrailer.key;

  // Nếu không có trailer chính thức, lấy trailer bất kỳ từ YouTube
  const fallbackTrailer = data.results.find(
    (video) =>
      video.type === "Trailer" &&
      video.site === "YouTube"
  );

  return fallbackTrailer ? fallbackTrailer.key : null;
}

// Tìm kiếm phim
export async function searchMovies(query, page = 1) {
  const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=${page}`);
  const data = await res.json();
  return data.results;
}

// Lấy đánh giá (reviews) cho phim
export async function getMovieReviews(id) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${id}/reviews?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return { results: [] };
  }
}

// Lấy danh sách thể loại (genres)
export async function getGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres;
}

// Lấy phim theo thể loại
export async function getMoviesByGenre(genreId, page = 1) {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&page=${page}`);
  const data = await res.json();
  return data.results;
}

// Lấy các phim tương tự
export async function getSimilarMovies(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.results;
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
