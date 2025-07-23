import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import { BiArrowBack } from "react-icons/bi";
import { FaCloudDownloadAlt, FaHeart } from "react-icons/fa";
import { fetchMovieDetails, fetchMovieTrailer } from "../Data/movieAPI";

function WatchPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await fetchMovieDetails(id);
      const trailerData = await fetchMovieTrailer(id);
      setMovie(movieData);
      setTrailer(trailerData);
    };
    fetchData();
  }, [id]);

  if (!movie) return <div className="text-white">Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto bg-dry p-6 mb-12">
        <div className="flex-btn flex-wrap mb-6 gap-2 bg-main rounded border border-gray-800 p-6">
          <Link
            to={`/movie/${movie?.id}`}
            className="md:text-xl text-sm flex gap-3 items-center font-bold text-dryGray"
          >
            <BiArrowBack /> {movie?.title}
          </Link>
          <div className="flex-btn sm:w-auto w-full gap-5">
            <button className="bg-white hover:text-subMain transitions bg-opacity-30 text-white rounded px-4 py-3 text-sm">
              <FaHeart />
            </button>
            <button className="bg-subMain flex-rows gap-2 hover:text-main transitions text-white rounded px-8 font-medium py-3 text-sm">
              <FaCloudDownloadAlt /> Download
            </button>
          </div>
        </div>

        {/* Video player */}
        {trailer ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}`}
            title={movie.title}
            width="100%"
            height="500"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-[500px] rounded"
          />
        ) : (
          <p className="text-white">No trailer available</p>
        )}
      </div>
    </Layout>
  );
}

export default WatchPage;
