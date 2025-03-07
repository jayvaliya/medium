import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";
import HomeLoading from "../components/HomeLoading";

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

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/v1/blog/bulk");
      setData(res.data.blogs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    <div className="bg-white min-h-screen">
      {/* Reading Progress Bar - Unique Element */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 to-blue-500 w-0 fixed top-0 left-0 z-50" id="reading-progress"></div>

      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        {/* Discover Section */}
        <div className="py-10 border-b border-gray-200">
          <h2 className="text-sm font-medium text-emerald-600 mb-1">DISCOVER</h2>
          <div className="flex justify-between items-baseline">
            <h1 className="text-xl font-bold text-gray-900">Articles for you</h1>
            <button className="text-sm text-gray-600 hover:text-gray-900 transition">
              Customize your feed →
            </button>
          </div>
        </div>

        {/* Blog List */}
        <div className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item: Blog) => (
              <div key={item.id} className="py-8 group">
                <BlogCard blog={item} />
                <div className="mt-3 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                    </svg>
                    Save
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="18" cy="5" r="3"></circle>
                      <circle cx="6" cy="12" r="3"></circle>
                      <circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                    Share
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="inline-block p-6 rounded-full bg-gray-50 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </div>
              <h2 className="text-xl font-medium text-gray-900 mb-1">No stories yet</h2>
              <p className="text-gray-500 max-w-sm mx-auto">
                When you follow people and publications, you'll see their stories here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
