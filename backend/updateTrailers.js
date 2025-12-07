import 'dotenv/config';
import mongoose from 'mongoose';
import Movie from './models/Movie.js';
import axios from 'axios';

const getTmdbUrl = (endpoint, params = {}) => {
    const queryParams = new URLSearchParams({
        api_key: process.env.TMDB_API_KEY,
        language: 'en-US',
        ...params,
    });
    return `https://api.themoviedb.org/3${endpoint}?${queryParams}`;
};

async function updateMoviesWithTrailers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all movies with tmdbId but no video
        const movies = await Movie.find({
            tmdbId: { $exists: true },
            $or: [
                { video: { $exists: false } },
                { video: null }
            ]
        });

        console.log(`\n📽️  Found ${movies.length} movies without trailers`);

        let updated = 0;
        let failed = 0;

        for (const movie of movies) {
            try {
                console.log(`\n🔄 Processing: ${movie.name} (TMDb ID: ${movie.tmdbId})`);

                // Fetch from TMDb with videos
                const response = await axios.get(
                    getTmdbUrl(`/movie/${movie.tmdbId}`, { append_to_response: 'videos' })
                );

                const tmdbMovie = response.data;

                // Extract trailer
                if (tmdbMovie.videos && tmdbMovie.videos.results) {
                    const trailer = tmdbMovie.videos.results.find(
                        v => v.type === 'Trailer' && v.site === 'YouTube' && v.official
                    ) || tmdbMovie.videos.results.find(
                        v => v.type === 'Trailer' && v.site === 'YouTube'
                    ) || tmdbMovie.videos.results.find(
                        v => v.site === 'YouTube'
                    );

                    if (trailer) {
                        movie.video = trailer.key;
                        movie.videoUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
                        await movie.save();
                        console.log(`  ✅ Added trailer: ${trailer.key}`);
                        updated++;
                    } else {
                        console.log(`  ⚠️  No trailer found on TMDb`);
                    }
                } else {
                    console.log(`  ⚠️  No videos data from TMDb`);
                }

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 250));

            } catch (error) {
                console.error(`  ❌ Failed: ${error.message}`);
                failed++;
            }
        }

        console.log(`\n\n📊 Summary:`);
        console.log(`✅ Updated: ${updated} movies`);
        console.log(`❌ Failed: ${failed} movies`);
        console.log(`⚠️  No trailer: ${movies.length - updated - failed} movies`);

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateMoviesWithTrailers();
