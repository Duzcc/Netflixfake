import React from 'react';
import { Link } from 'react-router-dom';
import { MdDashboard } from 'react-icons/md';
import { motion } from 'framer-motion';
import Layout from '../Layout/Layout';
import AdminOnly from '../Components/Protect/AdminOnly';
import ContinueWatching from '../Components/Home/ContinueWatching';
import Promos from '../Components/Home/Promos';
import TopRated from '../Components/Home/TopRated';
import Banner from '../Components/Home/Banner';
import PopularMovies from '../Components/Home/PopularMovies';
import { isAuthenticated } from '../utils/authUtils';

function HomeScreen() {
  return (
    <Layout>
      {/* Main Content with spacing for fixed navbar */}
      <div className="min-h-screen">
        {/* Admin Dashboard Link */}
        <AdminOnly>
          <div className="container mx-auto px-4 pt-24 pb-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 glass hover:glass-dark transitions text-white py-3 px-6 rounded-lg font-medium shadow-card"
            >
              <MdDashboard className="text-xl" />
              Go to Dashboard
            </Link>
          </div>
        </AdminOnly>

        {/* Hero Banner Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Banner />
        </motion.div>

        {/* Continue Watching Section */}
        {isAuthenticated() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="container mx-auto px-4 py-8"
          >
            <ContinueWatching />
          </motion.div>
        )}

        {/* Popular Movies Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="container mx-auto px-4 py-8"
        >
          <h2 className="text-3xl font-heading mb-6 text-white">
            Popular Movies
          </h2>
          <PopularMovies />
        </motion.div>

        {/* Promos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="py-8"
        >
          <Promos />
        </motion.div>

        {/* Top Rated Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="container mx-auto px-4 py-8 pb-16"
        >
          <h2 className="text-3xl font-heading mb-6 text-white">
            Top Rated
          </h2>
          <TopRated />
        </motion.div>
      </div>
    </Layout>
  );
}

export default HomeScreen;