import { useEffect, useState } from "react";
import { apiClient } from "../utils/var";
import BlogCard from "../components/BlogCard";
import HomeLoading from "../components/HomeLoading";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/user";

type Blog = {
  id: string,
  title: string,
  content?: string,
  createdAt: string,
  author?: {
    id: string,
    name: string
  }
}

export default function Home() {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useRecoilValue(userAtom); // Access the global user state

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/api/v1/blog/bulk");
        setData(res.data.blogs);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Initialize reading progress bar
    const progressBar = document.getElementById('reading-progress');
    const handleScroll = () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      if (progressBar) {
        progressBar.style.width = `${scrollPercentage}%`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return <HomeLoading />;
  }

  return (
    <div className="bg-white min-h-screen pb-16">
      {/* Reading Progress Bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500 w-0 fixed top-0 left-0 z-40" id="reading-progress"></div>

      <div className="max-w-[1140px] mx-auto px-5 sm:px-6">
        {/* Hero Section - Conditional based on authentication */}
        <div className="py-12 sm:py-16 border-b border-gray-100 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Stay Curious. <span className="text-emerald-600">Discover Stories.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8">
            Explore articles on topics that matter to you, written by experts and enthusiasts.
          </p>

          {!user ? (
            // Show for non-authenticated users
            <Link
              to="/signup"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200 shadow-sm"
            >
              Start reading
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          ) : (
            // Show for authenticated users
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200 shadow-sm"
            >
              Write a story
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
            </Link>
          )}
        </div>

        {/* Blog List */}
        <div className={`divide-y divide-gray-100 ${user ? 'mt-4' : 'mt-12'}`}>
          {data.length > 0 ? (
            data.map((item: Blog) => (
              <div key={item.id} className="py-8 group">
                <BlogCard blog={item} />
                {/* {user && (
                  <div className="mt-3 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                      </svg>
                      Save
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                      </svg>
                      Share
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      Add to favorites
                    </button>
                  </div>
                )} */}
              </div>
            ))
          ) : (
            <div className="py-24 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-gray-900 mb-3">No stories yet</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-8">
                Be the first to share your story with our community.
              </p>

              {user ? (
                <Link
                  to="/write"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Start Writing
                </Link>
              ) : (
                <Link
                  to="/signup"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200 shadow-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" y1="12" x2="3" y2="12"></line>
                  </svg>
                  Sign Up to Write
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {data.length > 5 && (
          <div className="pt-8 flex justify-center">
            <nav className="flex items-center space-x-1" aria-label="Pagination">
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-white bg-emerald-600">
                1
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <span className="px-3 py-2 text-gray-500">...</span>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                8
              </button>
              <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
