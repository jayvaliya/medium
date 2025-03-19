export default function HomeLoading() {
    return (
        <div className="bg-white min-h-screen pb-16">
            {/* Hero Section Skeleton */}
            <div className="max-w-[1140px] mx-auto px-5 sm:px-6">
                <div className="py-12 sm:py-16 border-b border-gray-100 text-center animate-pulse">
                    <div className="h-10 bg-gray-200 rounded-lg max-w-md mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded-full max-w-sm mx-auto mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-full max-w-xs mx-auto mb-8"></div>
                    <div className="h-10 bg-gray-200 rounded-full w-36 mx-auto"></div>
                </div>

                {/* Tabs Skeleton */}
                {/* <div className="pt-8 pb-6 flex border-b border-gray-100 animate-pulse">
                    <div className="flex space-x-8">
                        <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                    </div>
                </div> */}

                {/* Blog Post Skeletons */}
                <div className="divide-y divide-gray-100 mt-4">
                    {[...Array(3)].map((_, index) => (
                        <div key={index} className="py-8 animate-pulse">
                            <div className="flex gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 bg-gray-200 rounded-md w-32"></div>
                                    </div>
                                    <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded-md"></div>
                                        <div className="h-4 bg-gray-200 rounded-md w-5/6"></div>
                                        <div className="h-4 bg-gray-200 rounded-md w-4/5"></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                                    </div>
                                </div>
                                <div className="h-24 w-24 bg-gray-200 rounded-md hidden sm:block"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="pt-8 flex justify-center animate-pulse">
                    <div className="flex items-center space-x-1">
                        <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-8 bg-emerald-100 rounded-md"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-md"></div>
                        <div className="h-8 w-16 bg-gray-200 rounded-md"></div>
                    </div>
                </div>
            </div>

            {/* Subtle shimmer effect */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-r from-transparent via-white/10 to-transparent w-3/4 h-full animate-shimmer"></div>
        </div>
    );
}
