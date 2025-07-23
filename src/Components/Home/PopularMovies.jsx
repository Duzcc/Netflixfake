import React, { useEffect, useState } from "react";
import Titles from "../Titles";
import { BsCollectionFill } from "react-icons/bs";
import Movie from "../Movie";
import { fetchPopularMovies } from "../../Data/movieAPI";

function PopularMovies() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const loadPopular = async () => {
      try {
        const data = await fetchPopularMovies(1); // trang 1
        setMovies(data.slice(0, 8)); // Lấy 8 phim đầu
      } catch (error) {
        console.error("Failed to fetch popular movies:", error);
      }
    };

    loadPopular();
  }, []);

  return (
    <div className="my-16">
      <Titles title="Popular Movies" Icon={BsCollectionFill} />
      <div className="grid sm:mt-12 mt-6 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
        {movies.map((movie, index) => (
          <Movie key={index} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default PopularMovies;
