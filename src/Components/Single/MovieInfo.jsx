import React from "react";
import { FaPlay, FaShareAlt } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router-dom";
import FlexMovieItems from "../FlexMovieItems";

function MovieInfo({ movie, setModalOpen }) {
  if (!movie) return null;

  return (
    <div className="w-full xl:h-screen relative text-white">
      {/* Background Image (only on xl screen) */}
      <img
        src={`/images/movies/${movie?.image}`}
        alt={movie?.name}
        className="w-full hidden xl:inline-block h-full object-cover"
      />

      {/* Overlay Content */}
      <div className="xl:bg-main bg-dry xl:bg-opacity-90 xl:absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center">
        <div className="container mx-auto px-3 2xl:px-32 xl:grid grid-cols-3 gap-8 py-10 lg:py-20">
          {/* Thumbnail */}
          <div className="xl:col-span-1 h-header bg-dry border border-gray-800 rounded-lg overflow-hidden xl:order-none order-last">
            <img
              src={`/images/movies/${movie?.titleImage}`}
              alt={movie?.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="col-span-2 grid md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3 flex flex-col gap-8">
              {/* Title */}
              <h1 className="text-2xl xl:text-4xl font-bold capitalize">
                {movie?.name}
              </h1>

              {/* Tags */}
              <div className="flex items-center gap-4 text-dryGray text-sm font-medium">
                <span className="bg-subMain text-xs px-2 py-1 rounded">HD 4K</span>
                <FlexMovieItems movie={movie} />
              </div>

              {/* Description */}
              <p className="text-sm text-text leading-7">{movie?.desc}</p>

              {/* Detail Section: Share, Language, Watch */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 p-6 bg-main border border-gray-800 rounded-lg">
                {/* Share Button */}
                <div className="col-span-1 flex-colo border-r border-border">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-10 h-10 flex-colo rounded-lg bg-white bg-opacity-20 hover:bg-subMain transition"
                  >
                    <FaShareAlt />
                  </button>
                </div>

                {/* Language */}
                <div className="col-span-2 flex-colo text-sm font-medium text-white">
                  <p>
                    Language: <span className="ml-2">{movie?.language}</span>
                  </p>
                </div>

                {/* Watch Now */}
                <div className="sm:col-span-2 col-span-3 flex justify-end">
                  <Link
                    to={`/watch/${movie?.name}`}
                    className="w-full py-3 sm:py-3 flex items-center justify-center gap-4 rounded-full bg-dry border-2 border-subMain hover:bg-subMain transition"
                  >
                    <FaPlay className="w-3 h-3" />
                    <span className="text-sm font-medium uppercase">Watch</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <div className="md:col-span-2 mt-4 md:mt-0 flex justify-end">
              <button className="w-full md:w-1/2 relative flex-colo h-20 md:h-64 rounded bg-subMain hover:bg-transparent border-2 border-subMain transition">
                <div className="absolute md:rotate-90 flex items-center gap-4 text-md uppercase tracking-widest">
                  Download <FiLogIn className="w-6 h-6" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieInfo;
