import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from './models/Movie.js';

async function checkMovies() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check first movie
        const movie = await Movie.findOne().limit(1);

        if (!movie) {
            console.log('❌ No movies in database');
            process.exit(0);
        }

        console.log('\n📽️  Sample Movie:');
        console.log('Name:', movie.name);
        console.log('TMDb ID:', movie.tmdbId);
        console.log('Has video field:', !!movie.video);
        console.log('Video value:', movie.video);
        console.log('Has videoUrl:', !!movie.videoUrl);
        console.log('VideoUrl value:', movie.videoUrl);

        // Count movies with and without videos
        const totalMovies = await Movie.countDocuments();
        const moviesWithVideo = await Movie.countDocuments({ video: { $exists: true, $ne: null } });

        console.log('\n📊 Statistics:');
        console.log('Total movies:', totalMovies);
        console.log('Movies with trailer:', moviesWithVideo);
        console.log('Movies without trailer:', totalMovies - moviesWithVideo);

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkMovies();
