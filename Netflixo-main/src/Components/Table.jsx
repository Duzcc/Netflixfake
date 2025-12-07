import React from "react";
import { FaCloudDownloadAlt, FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { GoEye } from "react-icons/go";
import Rating from "./Rating";

const Head = "text-xs text-left text-main font-semibold px-6 py-2 uppercase";
const Text = "text-sm text-left leading-6 whitespace-nowrap px-5 py-3";

function Table({ data = [], admin = false }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full table-auto border border-border divide-y divide-border">
        <thead className="bg-dryGray">
          <tr>
            <th className={Head}>Poster</th>
            <th className={Head}>Title</th>
            <th className={Head}>Genres</th>
            <th className={Head}>Language</th>
            <th className={Head}>Year</th>
            <th className={Head}>Rating</th>
            <th className={`${Head} text-end`}>Actions</th>
          </tr>
        </thead>

        <tbody className="bg-main divide-y divide-border">
          {data.map((movie, index) => (
            <tr key={index}>
              <td className={Text}>
                <div className="w-12 h-12 p-1 bg-dry border border-border rounded overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie?.title}
                  />
                </div>
              </td>

              <td className={`${Text} truncate`}>{movie.title}</td>

              <td className={Text}>
                {movie.genres
                  ? movie.genres.map((g) => g.name).join(", ")
                  : movie.genre_ids?.join(", ") || "N/A"}
              </td>

              <td className={Text}>
                {movie.original_language?.toUpperCase() || "N/A"}
              </td>

              <td className={Text}>
                {movie.release_date?.split("-")[0] || "N/A"}
              </td>

              <td className={Text}>
                <Rating value={movie.vote_average / 2} />
              </td>

              <td className={`${Text} float-right flex gap-2 items-center`}>
                {admin ? (
                  <>
                    <button className="border border-border bg-dry text-border rounded px-2 py-1 flex items-center gap-1">
                      Edit <FaEdit className="text-green-500" />
                    </button>
                    <button className="bg-subMain text-white rounded w-6 h-6 flex items-center justify-center">
                      <MdDelete />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="border border-border bg-dry text-border rounded px-2 py-1 flex items-center gap-1">
                      Download <FaCloudDownloadAlt className="text-green-500" />
                    </button>
                    <Link
                      to={`/movie/${movie.id}`}
                      className="bg-subMain text-white rounded w-6 h-6 flex items-center justify-center"
                    >
                      <GoEye />
                    </Link>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
