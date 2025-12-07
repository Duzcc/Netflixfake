import React from 'react';
import Skeleton from './Skeleton';

function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <Skeleton className="h-10 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/4" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-main border border-border rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                        </div>
                        <Skeleton className="h-8 w-16 mb-1" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-16" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-main border border-border rounded-lg overflow-hidden">
                            <Skeleton className="w-full h-48" />
                            <div className="p-3">
                                <Skeleton className="h-4 w-3/4 mb-2" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-10" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DashboardSkeleton;
