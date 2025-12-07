import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaSearch, FaHeart } from "react-icons/fa";
import { CgUser } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrentUser, isAuthenticated, logout } from "../../utils/authUtils";

function NavBar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Scroll effect for navbar blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const updateFavoritesCount = () => {
    const user = getCurrentUser();
    if (user && user.likedMovies) {
      setFavoritesCount(user.likedMovies.length);
    } else {
      setFavoritesCount(0);
    }
  };

  const updateUserInfo = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  useEffect(() => {
    updateFavoritesCount();
    updateUserInfo();

    // Listen for updates
    window.addEventListener("favoritesUpdated", updateFavoritesCount);
    window.addEventListener("userLoggedIn", updateUserInfo);
    window.addEventListener("userLoggedOut", updateUserInfo);
    window.addEventListener("userProfileUpdated", updateUserInfo);

    return () => {
      window.removeEventListener("favoritesUpdated", updateFavoritesCount);
      window.removeEventListener("userLoggedIn", updateUserInfo);
      window.removeEventListener("userLoggedOut", updateUserInfo);
      window.removeEventListener("userProfileUpdated", updateUserInfo);
    };
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/movies?query=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      logout();
      navigate("/login");
    }
  };

  const getAvatarUrl = () => {
    if (user?.avatar) {
      return user.avatar;
    }
    return "/default-avatar.png";
  };

  const hover = "hover:text-subMain transitions text-white";
  const Hover = ({ isActive }) => (isActive ? "text-subMain" : hover);

  return (
    <motion.div
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-dark backdrop-blur-xl shadow-lg" : "bg-transparent"
        }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto py-4 px-4 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-subMain font-heading text-3xl font-bold">
                NETFLIXO
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            <NavLink to="/" className={Hover}>
              Home
            </NavLink>
            <NavLink to="/movies" className={Hover}>
              Movies
            </NavLink>
            <NavLink to="/about-us" className={Hover}>
              About
            </NavLink>
            <NavLink to="/contact-us" className={Hover}>
              Contact
            </NavLink>

            {/* Dashboard link based on role */}
            {user?.role === "admin" ? (
              <NavLink to="/dashboard" className={Hover}>
                <MdDashboard className="inline w-5 h-5 mr-1" />
                Admin
              </NavLink>
            ) : (
              isAuthenticated() && (
                <NavLink to="/user-dashboard" className={Hover}>
                  <MdDashboard className="inline w-5 h-5 mr-1" />
                  Dashboard
                </NavLink>
              )
            )}
          </div>

          {/* Search + Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="glass backdrop-blur-md rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-text-secondary border border-white/10 focus:border-subMain transition-colors w-48 lg:w-64"
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              </div>
            </form>

            {/* Favorites */}
            {isAuthenticated() && (
              <NavLink to="/favorites" className="relative">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <FaHeart className="w-6 h-6 text-white hover:text-subMain transition-colors" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-subMain text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {favoritesCount}
                    </span>
                  )}
                </motion.div>
              </NavLink>
            )}

            {/* User Avatar & Dropdown */}
            {isAuthenticated() ? (
              <div className="relative">
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={getAvatarUrl()}
                    alt={user?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover border-2 border-subMain ring-2 ring-subMain/20"
                    onError={(e) => {
                      e.target.src = "/default-avatar.png";
                    }}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 glass-card backdrop-blur-xl rounded-lg shadow-lg overflow-hidden"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowDropdown(false)}
                          className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                        >
                          Profile Settings
                        </Link>

                        {user?.role === "admin" && (
                          <Link
                            to="/dashboard"
                            onClick={() => setShowDropdown(false)}
                            className="block px-4 py-2 text-sm text-white hover:bg-white/10 transition-colors"
                          >
                            <MdDashboard className="inline mr-2" />
                            Admin Dashboard
                          </Link>
                        )}

                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-white/10 transition-colors flex items-center gap-2"
                        >
                          <FiLogOut />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink to="/login">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <CgUser className="w-8 h-8 text-white hover:text-subMain transition-colors" />
                </motion.div>
              </NavLink>
            )}
          </div>
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          className="fixed inset-0 -z-10"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </motion.div>
  );
}

export default NavBar;
