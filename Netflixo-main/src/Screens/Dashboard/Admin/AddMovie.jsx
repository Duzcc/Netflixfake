import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
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
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function AddMovie() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cast, setCast] = useState(null);
  const [casts, setCasts] = useState([]);
  const [movieId, setMovieId] = useState(550);
  const [importing, setImporting] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const [title, setTitle] = useState("");
  const [overview, setOverview] = useState("");
  const [language, setLanguage] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [posterPath, setPosterPath] = useState("");
  const [backdropPath, setBackdropPath] = useState("");
  const [hours, setHours] = useState("");
  const [category, setCategory] = useState("");

  // Get auth token
  const getAuthToken = () => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      return parsed.token;
    }
    return null;
  };

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
    if (!movieId) {
      toast.error("Please enter a TMDb Movie ID");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US`);
      const data = await res.json();

      if (data.success === false) {
        toast.error("Movie not found on TMDb");
        return;
      }

      setTitle(data.title || "");
      setOverview(data.overview || "");
      setLanguage(data.original_language || "");
      setReleaseYear(data.release_date?.split("-")[0] || "");
      setPosterPath(data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : "");
      setBackdropPath(data.backdrop_path ? `https://image.tmdb.org/t/p/w780${data.backdrop_path}` : "");

      toast.success("Movie details fetched successfully!");
    } catch (error) {
      console.error("Failed to fetch movie details:", error);
      toast.error("Failed to fetch movie details from TMDb");
    }
  };

  // Import movie from TMDb to MongoDB
  const handleImportFromTMDb = async () => {
    if (!movieId) {
      toast.error("Please enter a TMDb Movie ID");
      return;
    }

    setImporting(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/movies/import`,
        { tmdbId: movieId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );

      toast.success(response.data.message || "Movie imported successfully!");

      // Reset form
      setMovieId("");
      setTitle("");
      setOverview("");
      setLanguage("");
      setReleaseYear("");
      setPosterPath("");
      setBackdropPath("");
      setCasts([]);
    } catch (error) {
      console.error("Failed to import movie:", error);
      toast.error(error.response?.data?.message || "Failed to import movie");
    } finally {
      setImporting(false);
    }
  };

  // Publish movie manually (with manual data entry)
  const handlePublishMovie = async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Please enter movie title");
      return;
    }
    if (!overview.trim()) {
      toast.error("Please enter movie description");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!releaseYear) {
      toast.error("Please enter release year");
      return;
    }

    setPublishing(true);
    try {
      const movieData = {
        name: title,
        desc: overview,
        category: category,
        language: language.toUpperCase() || "EN",
        year: parseInt(releaseYear),
        time: parseInt(hours) || 120, // Default 120 minutes
        rate: 0, // Default rating
        numberOfReviews: 0,
        image: posterPath || "https://via.placeholder.com/500x750?text=No+Poster",
        titleImage: backdropPath || "https://via.placeholder.com/1280x720?text=No+Backdrop",
        casts: casts.slice(0, 10).map((actor, index) => ({
          name: actor.name,
          image: actor.profile_path
            ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
            : undefined,
          character: actor.character || "",
          order: index + 1
        }))
      };

      const response = await axios.post(
        `${BACKEND_URL}/movies`,
        movieData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getAuthToken()}`
          }
        }
      );

      toast.success("Movie published successfully!");

      // Reset form
      setTitle("");
      setOverview("");
      setLanguage("");
      setReleaseYear("");
      setHours("");
      setCategory("");
      setPosterPath("");
      setBackdropPath("");
      setMovieId("");
      setCasts([]);
    } catch (error) {
      console.error("Failed to publish movie:", error);
      toast.error(error.response?.data?.message || "Failed to publish movie");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SideBar>
      <CastsModal modalOpen={modalOpen} setModalOpen={setModalOpen} cast={cast} />
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Import Movie from TMDb</h2>
          <a
            href="/tmdb-import"
            className="text-subMain hover:text-subMain/80 underline text-sm"
          >
            Batch Import →
          </a>
        </div>

        {/* Movie ID Input + Fetch */}
        <div className="w-full grid md:grid-cols-3 gap-4">
          <Input
            label="TMDb Movie ID"
            placeholder="Enter TMDb Movie ID (e.g. 550)"
            type="number"
            bg={true}
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
          />
          <button
            onClick={fetchMovieDetails}
            className="bg-blue-600 hover:bg-blue-700 transitions text-white px-4 py-3 rounded mt-6 h-12"
          >
            Preview Movie Info
          </button>
          <button
            onClick={handleImportFromTMDb}
            disabled={importing || !movieId}
            className="bg-subMain hover:bg-subMain/80 transitions text-white px-4 py-3 rounded mt-6 h-12 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {importing ? "Importing..." : "Import to Database"}
          </button>
        </div>

        <div className="bg-dry border border-gray-800 rounded-lg p-4">
          <p className="text-gray-400 text-sm">
            💡 <strong>Tip:</strong> Enter a TMDb Movie ID and click "Import to Database" to automatically add the movie with all details and cast information.
            <br />
            Find TMDb IDs at: <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-subMain underline">themoviedb.org</a>
          </p>
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
          <Input
            label="Hours"
            placeholder="2hr (in minutes: 120)"
            type="number"
            bg={true}
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
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
          <Select
            label="Movie Category"
            options={CategoriesData}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
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
        <button
          onClick={handlePublishMovie}
          disabled={publishing}
          className="bg-subMain hover:bg-subMain/80 transitions w-full flex-rows gap-6 font-medium text-white py-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ImUpload /> {publishing ? "Publishing..." : "Publish Movie"}
        </button>
      </div>
    </SideBar>
  );
}

export default AddMovie;
