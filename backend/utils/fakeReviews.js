// Fake review data for TMDB movies (when movie not in local DB)
export const getFakeReviews = (movieId) => {
    const fakeReviewTemplates = [
        {
            userName: "John Smith",
            rating: 9,
            comment: "An absolute masterpiece! The cinematography and storytelling are exceptional. Highly recommended for anyone who loves great cinema.",
            userImage: "https://i.pravatar.cc/150?img=12",
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        },
        {
            userName: "Sarah Johnson",
            rating: 8,
            comment: "Really enjoyed this movie. Great performances from the cast and an engaging plot that kept me hooked from start to finish.",
            userImage: "https://i.pravatar.cc/150?img=45",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
            userName: "Michael Chen",
            rating: 10,
            comment: "One of the best films I've seen this year! The direction, acting, and music all come together perfectly. A must-watch!",
            userImage: "https://i.pravatar.cc/150?img=33",
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
        {
            userName: "Emma Williams",
            rating: 7,
            comment: "Solid movie with good production values. Some parts felt a bit slow, but overall it's worth watching.",
            userImage: "https://i.pravatar.cc/150?img=25",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        },
        {
            userName: "David Brown",
            rating: 9,
            comment: "Absolutely brilliant! The plot twists were unexpected and the character development was superb. Can't wait for a sequel!",
            userImage: "https://i.pravatar.cc/150?img=68",
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        }
    ];

    // Use movieId as seed for consistent fake reviews
    const seed = parseInt(movieId.toString().slice(-4)) || 1;
    const numReviews = 3 + (seed % 3); // 3-5 reviews

    const selectedReviews = [];
    for (let i = 0; i < numReviews && i < fakeReviewTemplates.length; i++) {
        const template = fakeReviewTemplates[(seed + i) % fakeReviewTemplates.length];
        selectedReviews.push({
            _id: `fake-${movieId}-${i}`,
            user: {
                _id: `fake-user-${i}`,
                name: template.userName,
                image: template.userImage,
            },
            movie: {
                movieId: parseInt(movieId),
                title: "Movie Title", // Will be replaced by frontend
            },
            rating: template.rating,
            comment: template.comment,
            status: 'approved',
            flagged: false,
            featured: i === 0, // First review is featured
            createdAt: template.createdAt,
            updatedAt: template.createdAt,
        });
    }

    return selectedReviews;
};

// Calculate average rating from fake reviews
export const getFakeReviewStats = (movieId) => {
    const reviews = getFakeReviews(movieId);
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);

    return {
        averageRating: (totalRating / reviews.length).toFixed(1),
        totalReviews: reviews.length,
        reviews: reviews,
    };
};
