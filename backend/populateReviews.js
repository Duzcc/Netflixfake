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

// Generate fake user data for reviews
const generateFakeUser = () => {
    const firstNames = ['John', 'Emma', 'Michael', 'Sophia', 'William', 'Olivia', 'James', 'Ava', 'Robert', 'Isabella'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;

    return {
        name,
        image: `https://i.pravatar.cc/150?u=${name.replace(' ', '')}`,
    };
};

async function populateReviews() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Get all movies with tmdbId
        const movies = await Movie.find({ tmdbId: { $exists: true } });

        console.log(`\n📽️  Found ${movies.length} movies to populate reviews`);

        let updated = 0;
        let skipped = 0;
        let failed = 0;

        for (const movie of movies) {
            try {
                // Skip if already has reviews
                if (movie.reviews && movie.reviews.length > 0) {
                    console.log(`  ⏭️  Skipping: ${movie.name} (already has ${movie.reviews.length} reviews)`);
                    skipped++;
                    continue;
                }

                console.log(`\n🔄 Processing: ${movie.name} (TMDb ID: ${movie.tmdbId})`);

                // Fetch reviews from TMDb
                const response = await axios.get(
                    getTmdbUrl(`/movie/${movie.tmdbId}/reviews`, { page: 1 })
                );

                const tmdbReviews = response.data.results || [];

                if (tmdbReviews.length === 0) {
                    console.log(`  ⚠️  No reviews found on TMDb`);
                    continue;
                }

                // Convert TMDb reviews to our format (take up to 5 reviews)
                const reviewsToAdd = tmdbReviews.slice(0, 5).map(review => {
                    const fakeUser = generateFakeUser();

                    return {
                        name: review.author || fakeUser.name,
                        rating: review.author_details?.rating ? review.author_details.rating / 2 : Math.floor(Math.random() * 3) + 3, // 3-5 stars
                        comment: review.content.length > 500 ? review.content.substring(0, 497) + '...' : review.content,
                        userImage: review.author_details?.avatar_path
                            ? `https://image.tmdb.org/t/p/w100${review.author_details.avatar_path}`
                            : fakeUser.image,
                        user: new mongoose.Types.ObjectId(), // Fake user ID
                    };
                });

                movie.reviews = reviewsToAdd;
                movie.numberOfReviews = reviewsToAdd.length;

                // Recalculate average rating
                const avgRating = reviewsToAdd.reduce((sum, r) => sum + r.rating, 0) / reviewsToAdd.length;
                movie.rate = Math.round(avgRating * 2 * 10) / 10; // Convert back to 10-scale

                await movie.save();

                console.log(`  ✅ Added ${reviewsToAdd.length} reviews (avg rating: ${avgRating.toFixed(1)}/5)`);
                updated++;

                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 300));

            } catch (error) {
                console.error(`  ❌ Failed: ${error.message}`);
                failed++;
            }
        }

        console.log(`\n\n📊 Summary:`);
        console.log(`✅ Updated: ${updated} movies`);
        console.log(`⏭️  Skipped: ${skipped} movies (already had reviews)`);
        console.log(`❌ Failed: ${failed} movies`);

        mongoose.disconnect();
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

populateReviews();
