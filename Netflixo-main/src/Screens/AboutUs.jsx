import React from "react";
import { motion, useInView } from "framer-motion";
import { FaPlay, FaUsers, FaFilm, FaHeart, FaStar, FaGlobe } from "react-icons/fa";
import { Link } from "react-router-dom";
import Layout from "../Layout/Layout";
import AnimatedCounter from "../Components/AnimatedCounter";

function AboutUs() {
  const stats = [
    { value: 10000, suffix: "+", label: "Movies & TV Shows", icon: FaFilm },
    { value: 8000, suffix: "+", label: "Active Users", icon: FaUsers },
    { value: 50000, suffix: "+", label: "Hours Watched", icon: FaPlay },
    { value: 25000, suffix: "+", label: "Favorites Added", icon: FaHeart },
  ];

  const features = [
    {
      icon: FaStar,
      title: "Premium Quality",
      description: "Stream in HD and 4K quality with no ads interrupting your experience.",
    },
    {
      icon: FaGlobe,
      title: "Watch Anywhere",
      description: "Enjoy on your TV, laptop, phone, and tablet anytime, anywhere.",
    },
    {
      icon: FaUsers,
      title: "Multiple Profiles",
      description: "Create profiles for different members of your household.",
    },
    {
      icon: FaHeart,
      title: "Personalized",
      description: "Get recommendations based on your viewing history and preferences.",
    },
    {
      icon: FaPlay,
      title: "Unlimited Streaming",
      description: "Watch as much as you want with no limits on your entertainment.",
    },
    {
      icon: FaFilm,
      title: "Vast Library",
      description: "Access thousands of movies and TV shows across all genres.",
    },
  ];

  return (
    <Layout>
      <div className="bg-main">
        {/* Hero Section */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/aboutus.png"
              alt="About Us"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-main via-main/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-main via-transparent to-main/30" />
          </div>

          <div className="relative h-full container mx-auto px-4 md:px-8 flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
              >
                Welcome to Netflixfake
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-lg md:text-xl text-text-secondary leading-relaxed"
              >
                Your ultimate destination for unlimited entertainment. Stream thousands of movies and TV shows anytime, anywhere.
              </motion.p>
            </motion.div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container mx-auto px-4 md:px-8 -mt-16 mb-20 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="glass-card backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-white/10 text-center group hover:border-subMain transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-subMain/20 mb-4 group-hover:bg-subMain/30 transition-colors">
                    <Icon className="text-2xl md:text-3xl text-subMain" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-sm md:text-base text-text-secondary">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Story Section */}
        <div className="container mx-auto px-4 md:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>
                  Founded with a passion for bringing quality entertainment to everyone, Netflixfake has grown to become a trusted platform for movie and TV show enthusiasts worldwide.
                </p>
                <p>
                  We believe that great stories have the power to inspire, entertain, and bring people together. That's why we've built a platform that makes it easy to discover and enjoy content you love.
                </p>
                <p>
                  From classic films to the latest releases, from heartwarming dramas to edge-of-your-seat thrillers, we've curated a diverse collection that caters to every taste and mood.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="glass-card backdrop-blur-xl p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us?</h3>
                <ul className="space-y-3">
                  {[
                    "Unlimited ad-free streaming",
                    "New content added regularly",
                    "Works on all your devices",
                    "Personalized recommendations",
                    "Family-friendly profiles",
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 text-text-secondary"
                    >
                      <div className="w-6 h-6 rounded-full bg-subMain/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-subMain text-sm">✓</span>
                      </div>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="container mx-auto px-4 md:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Amazing Features
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need for the perfect streaming experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="glass-card backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:border-subMain transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-subMain/20 mb-4">
                    <Icon className="text-2xl text-subMain" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <div className="container mx-auto px-4 md:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card backdrop-blur-xl rounded-3xl border border-white/10 p-12 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-subMain/10 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Watching?
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users enjoying unlimited entertainment. Start your journey today!
              </p>
              <Link
                to="/movies"
                className="inline-flex items-center gap-3 bg-subMain text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-subMain/90 transition-all duration-300 shadow-glow"
              >
                <FaPlay />
                Browse Movies
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}

export default AboutUs;
