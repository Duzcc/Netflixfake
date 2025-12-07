import React from 'react';
import Skeleton from './Skeleton';

function MovieCardSkeleton() {
    return (
        <div className="border border-border rounded-lg overflow-hidden bg-dry">
            {/* Image Skeleton */}
            <Skeleton className="w-full h-64" />

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Meta info */}
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-4 h-4" variant="circular" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MovieCardSkeleton;
