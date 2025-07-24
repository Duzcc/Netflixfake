import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MovieCasts from "../Components/Single/MovieCasts";
import MovieInfo from "../Components/Single/MovieInfo";
import MovieRates from "../Components/Single/MovieRates";
import Titles from "../Components/Titles";
import Layout from "../Layout/Layout";
import { BsCollectionFill } from "react-icons/bs";
import Movie from "../Components/Movie";
import ShareMovieModal from "../Components/Modals/ShareModal";

const API_KEY = "30b47161062a3e6b81f7060289df3481";
const BASE_URL = "https://api.themoviedb.org/3";

function SingleMovie() {
  const [modalOpen, setModalOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [casts, setCasts] = useState([]);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const { id } = useParams();

  // Fetch movie detail
  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        setMovie(data);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      }
    };

    fetchMovieDetail();
  }, [id]);

  // Fetch movie casts
  useEffect(() => {
    const fetchMovieCasts = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        const data = await res.json();
        setCasts(data.cast || []);
      } catch (error) {
        console.error("Failed to fetch casts:", error);
      }
    };

    fetchMovieCasts();
  }, [id]);

  // Fetch related movies
  useEffect(() => {
    const fetchRelatedMovies = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        setRelatedMovies(data.results || []);
      } catch (error) {
        console.error("Failed to fetch related movies:", error);
      }
    };

    fetchRelatedMovies();
  }, [id]);

  if (!movie) {
    return (
      <Layout>
        <div className="text-center text-white py-20 text-xl">
          Loading movie...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Modal chia sẻ phim */}
      <ShareMovieModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        movie={movie}
      />

      {/* Thông tin chi tiết phim */}
      <MovieInfo movie={movie} setModalOpen={setModalOpen} />

      <div className="container mx-auto min-h-screen px-2 my-6">
        {/* Dàn diễn viên */}
        <MovieCasts movie={{ casts }} />

        {/* Đánh giá người dùng */}
        <MovieRates movie={movie} />

        {/* Phim liên quan */}
        <div className="my-16">
          <Titles title="Related Movies" Icon={BsCollectionFill} />
          <div className="grid sm:mt-10 mt-6 xl:grid-cols-4 2xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-2 gap-6">
            {relatedMovies.map((related, index) => (
              <Movie key={index} movie={related} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SingleMovie;
