import React from 'react';
import Skeleton from './Skeleton';

function MovieInfoSkeleton() {
    return (
        <div className="w-full xl:h-screen relative text-white">
            {/* Background Skeleton */}
            <div className="w-full h-full hidden xl:block">
                <Skeleton className="w-full h-full object-cover" />
            </div>

            <div className="xl:bg-main bg-dry flex-colo xl:bg-opacity-90 xl:absolute top-0 left-0 right-0 bottom-0">
                <div className="container px-3 mx-auto 2xl:px-32 xl:grid grid-cols-3 flex-colo py-10 lg:py-20 gap-8">
                    {/* Poster Skeleton */}
                    <div className="xl:col-span-1 w-full xl:order-none order-last h-header bg-dry border border-gray-800 rounded-lg overflow-hidden">
                        <Skeleton className="w-full h-full" />
                    </div>

                    {/* Info Skeleton */}
                    <div className="col-span-2 md:grid grid-cols-5 gap-4 items-center">
                        <div className="col-span-3 flex flex-col gap-10">
                            {/* Title */}
                            <Skeleton className="h-12 w-3/4 rounded-lg" />

                            {/* Flex Items */}
                            <div className="flex items-center gap-4 font-medium text-dryGray">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-6 w-16" />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>

                            {/* Actions */}
                            <div className="grid sm:grid-cols-2 gap-4 p-6 bg-main border border-gray-800 rounded-lg">
                                <div className="col-span-1 flex-colo border-r border-border">
                                    <Skeleton className="h-10 w-10 rounded-full mb-2" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="col-span-1 flex-colo border-r border-border">
                                    <Skeleton className="h-10 w-10 rounded-full mb-2" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieInfoSkeleton;
