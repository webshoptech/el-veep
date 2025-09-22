"use client";

import Skeleton from "react-loading-skeleton";


export default function ItemDetailSkeleton() {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Image Skeleton */}
        <div className="lg:col-span-2">
          <Skeleton className="w-full h-[600px] rounded-lg" />
        </div>

        {/* Details Skeleton */}
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-8 w-3/4" /> {/* title */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-20" /> {/* reviews */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-20" /> {/* sales price */}
            <Skeleton className="h-6 w-20" /> {/* regular price */}
            <Skeleton className="h-6 w-12" /> {/* discount */}
          </div>
          <Skeleton className="h-20 w-full" /> {/* description */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-28" /> {/* quantity */}
            <Skeleton className="h-12 w-32" /> {/* add to cart */}
            <Skeleton className="h-12 w-12 rounded-full" /> {/* favorite */}
          </div>
          <Skeleton className="h-4 w-40" /> {/* category */}
          <Skeleton className="h-4 w-40" /> {/* shop */}
        </div>
      </div>
    </div>
  );
}
