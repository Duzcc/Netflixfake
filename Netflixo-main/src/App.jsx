import Aos from 'aos';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import ScrollOnTop from './ScrollOnTop';
import AboutUs from './Screens/AboutUs';
import ContactUs from './Screens/ContactUs';
import AddMovie from './Screens/Dashboard/Admin/AddMovie';
import Categories from './Screens/Dashboard/Admin/Categories';
import Dashboard from './Screens/Dashboard/Admin/Dashboard';
import MoviesList from './Screens/Dashboard/Admin/MovieList';
import Users from './Screens/Dashboard/Admin/Users';
import TMDbImport from './Screens/Dashboard/Admin/TMDbImport';
import FavoritesMovies from './Screens/Dashboard/FavoritesMovies';
import Password from './Screens/Dashboard/Password';
import Profile from './Screens/Dashboard/Profile';
import UserDashboard from './Screens/Dashboard/UserDashboard';
import History from './Screens/Dashboard/History';
import Watchlist from './Screens/Dashboard/Watchlist';
import HomeScreen from './Screens/HomeScreen';
import Login from './Screens/Login';
import MoviesPage from './Screens/Movies';
import NotFound from './Screens/NotFound';
import Forbidden from './Screens/Forbidden';
import Register from './Screens/Register';
import SingleMovie from './Screens/SingleMovie';
import WatchPage from './Screens/WatchPage';
import VerifyEmail from './Screens/VerifyEmail';
import DrawerContext from './Context/DrawerContext';
import ProtectedRouter from './ProtectedRouter';
import { initializeDefaultData } from './utils/initializeData';
import ErrorBoundary from './Components/ErrorBoundary';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  Aos.init();

  // Initialize default data (admin account, etc.)
  useEffect(() => {
    initializeDefaultData();
  }, []);

  return (
    <DrawerContext>
      <ScrollOnTop>
        <ToastContainer
          position="bottom-left"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="*" element={<NotFound />} />

            {/* User Routes (Protected) */}
            <Route element={<ProtectedRouter />}>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/movie/:id" element={<SingleMovie />} />
              <Route path="/watch/:id" element={<WatchPage />} />
              <Route path="/user-dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/password" element={<Password />} />
              <Route path="/favorites" element={<FavoritesMovies />} />
              <Route path="/history" element={<History />} />
              <Route path="/watchlist" element={<Watchlist />} />
            </Route>

            {/* Admin Routes (Protected + Admin Role) */}
            <Route element={<ProtectedRouter role="admin" />}>
              <Route path="/movieslist" element={<MoviesList />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/addmovie" element={<AddMovie />} />
              <Route path="/tmdb-import" element={<TMDbImport />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </ScrollOnTop>
    </DrawerContext>
  );
}

export default App;
