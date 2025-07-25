import Aos from 'aos';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import ScrollOnTop from './ScrollOnTop';
import AboutUs from './Screens/AboutUs';
import ContactUs from './Screens/ContactUs';
import AddMovie from './Screens/Dashboard/Admin/AddMovie';
import Categories from './Screens/Dashboard/Admin/Categories';
import Dashboard from './Screens/Dashboard/Admin/Dashboard';
import MoviesList from './Screens/Dashboard/Admin/MovieList';
import Users from './Screens/Dashboard/Admin/Users';
import FavoritesMovies from './Screens/Dashboard/FavoritesMovies';
import Password from './Screens/Dashboard/Password';
import Profile from './Screens/Dashboard/Profile';
import HomeScreen from './Screens/HomeScreen';
import Login from './Screens/Login';
import MoviesPage from './Screens/Movies';
import NotFound from './Screens/NotFound';
import Register from './Screens/Register';
import SingleMovie from './Screens/SingleMovie';
import WatchPage from './Screens/WatchPage';
import DrawerContext from './Context/DrawerContext';

function App() {
  Aos.init();

  const isLoggedIn = localStorage.getItem("user");

  return (
    <DrawerContext>
      <ScrollOnTop>
        <Routes>
          {/* ✅ Trang chủ sẽ hiển thị nếu đã đăng nhập, ngược lại chuyển về /login */}
          <Route path="/" element={isLoggedIn ? <HomeScreen /> : <Navigate to="/login" replace />} />

          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/movies" element={isLoggedIn ? <MoviesPage /> : <Navigate to="/login" replace />} />
          <Route path="/movie/:id" element={isLoggedIn ? <SingleMovie /> : <Navigate to="/login" replace />} />
          <Route path="/watch/:id" element={isLoggedIn ? <WatchPage /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/password" element={isLoggedIn ? <Password /> : <Navigate to="/login" replace />} />
          <Route path="/favorites" element={isLoggedIn ? <FavoritesMovies /> : <Navigate to="/login" replace />} />
          <Route path="/movieslist" element={isLoggedIn ? <MoviesList /> : <Navigate to="/login" replace />} />
          <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/categories" element={isLoggedIn ? <Categories /> : <Navigate to="/login" replace />} />
          <Route path="/users" element={isLoggedIn ? <Users /> : <Navigate to="/login" replace />} />
          <Route path="/addmovie" element={isLoggedIn ? <AddMovie /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ScrollOnTop>
    </DrawerContext>
  );
}

export default App;
