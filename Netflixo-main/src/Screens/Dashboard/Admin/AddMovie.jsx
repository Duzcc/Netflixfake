import React, { useEffect, useState } from "react";
import Uploder from "../../../Components/Uploder";
import { Input, Message, Select } from "../../../Components/UsedInputs";
import SideBar from "../SideBar";
import { CategoriesData } from "../../../Data/CategoriesData";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import CastsModal from "../../../Components/Modals/CastsModal";

const API_KEY = "30b47161062a3e6b81f7060289df3481";
const BASE_URL = "https://api.themoviedb.org/3";

function AddMovie() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cast, setCast] = useState(null);
  const [casts, setCasts] = useState([]);
  const [movieId, setMovieId] = useState(550); 

  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [language, setLanguage] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [backdropPath, setBackdropPath] = useState("");

  useEffect(() => {
    if (modalOpen === false) {
      setCast();
    }
  }, [modalOpen]);

  useEffect(() => {
    fetchCasts();
  }, [movieId]);

  const fetchCasts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`);
      const data = await res.json();
      setCasts(data.cast.slice(0, 10));
    } catch (error) {
      console.error("Failed to fetch casts:", error);
    }
  };

  const fetchMovieDetails = async () => {
    try {
      const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
      const data = await res.json();

      setTitle(data.title || "");
      setOverview(data.overview || "");
      setLanguage(data.original_language || "");
      setReleaseYear(data.release_date?.split("-")[0] || "");
      setPosterPath(data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "");
      setBackdropPath(data.backdrop_path ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}` : "");
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
    }
  };

  return (
    <SideBar>
      <CastsModal modalOpen={modalOpen} setModalOpen={setModalOpen} cast={cast} />
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Create Movie</h2>

        {/* Movie ID Input + Fetch */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input
            label="TMDB Movie ID"
            placeholder="Enter TMDB Movie ID (e.g. 550)"
            type="number"
            bg={true}
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
          />
          <button
            onClick={fetchMovieDetails}
            className="bg-subMain text-white px-4 py-3 rounded mt-6"
          >
            Fetch Movie Info
          </button>
        </div>

        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input
            label="Movie Title"
            placeholder="Game of Thrones"
            type="text"
            bg={true}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input label="Hours" placeholder="2hr" type="text" bg={true} />
        </div>

        <div className="w-full grid md:grid-cols-2 gap-6">
          <Input
            label="Language Used"
            placeholder="English"
            type="text"
            bg={true}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <Input
            label="Year of Release"
            placeholder="2022"
            type="number"
            bg={true}
            value={releaseYear}
            onChange={(e) => setReleaseYear(e.target.value)}
          />
        </div>

        {/* IMAGES */}
        <div className="w-full grid md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-border font-semibold text-sm">Image without Title</p>
            <Uploder />
            <div className="w-32 h-32 p-2 bg-main border border-border rounded">
              <img
                src={backdropPath || "/images/movies/99.jpg"}
                alt=""
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-border font-semibold text-sm">Image with Title</p>
            <Uploder />
            <div className="w-32 h-32 p-2 bg-main border border-border rounded">
              <img
                src={posterPath || "/images/movies/88.jpg"}
                alt=""
                className="w-full h-full object-cover rounded"
              />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <Message
          label="Movie Description"
          placeholder="Make it short and sweet"
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
        />

        {/* CATEGORY */}
        <div className="text-sm w-full">
          <Select label="Movie Category" options={CategoriesData} />
        </div>

        {/* MOVIE VIDEO */}
        <div className="flex flex-col gap-2 w-full ">
          <label className="text-border font-semibold text-sm">Movie Video</label>
          <Uploder />
        </div>

        {/* CASTS */}
        <div className="w-full grid lg:grid-cols-2 gap-6 items-start ">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full py-4 bg-main border border-subMain border-dashed text-white rounded"
          >
            Add Cast
          </button>

          <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-4 grid-cols-2 gap-4">
            {casts.map((actor, i) => (
              <div
                key={i}
                className="p-2 italic text-xs text-text rounded flex-colo bg-main border border-border"
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                      : `/images/user.png`
                  }
                  alt={actor.name}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <p className="text-center">{actor.name}</p>
                <div className="flex-rows mt-2 w-full gap-2">
                  <button className="w-6 h-6 flex-colo bg-dry border border-border text-subMain rounded">
                    <MdDelete />
                  </button>
                  <button
                    onClick={() => {
                      setCast(actor);
                      setModalOpen(true);
                    }}
                    className="w-6 h-6 flex-colo bg-dry border border-border text-green-600 rounded"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button className="bg-subMain w-full flex-rows gap-6 font-medium text-white py-4 rounded">
          <ImUpload /> Publish Movie
        </button>
      </div>
    </SideBar>
  );
}

export default AddMovie;
