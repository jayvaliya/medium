import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";

type Blog = {
    id: string;
    title: string;
    content: string;
};

function SearchBar() {
    const [query, setQuery] = useState("");
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<number | null>(null);

    // Fetch blogs on search (Debounced)
    const fetchBlogs = async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setBlogs([]);
            setShowResults(false);
            return;
        }

        try {

            const url = `http://localhost:8787/api/v1/blog/search?query=${encodeURIComponent(searchQuery)}`;
            const { data } = await axios.get(url);
            setBlogs(data.blogs);
            setShowResults(true);

        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };


    // Debounced search function
    useEffect(() => {
        if (debounceTimer.current !== null) clearTimeout(debounceTimer.current);

        debounceTimer.current = window.setTimeout(() => {
            fetchBlogs(query);
        }, 500);

        return () => {
            if (debounceTimer.current !== null) clearTimeout(debounceTimer.current);
        };
    }, [query]);

    // Hide results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative max-w-md mx-auto border-2 rounded-lg md:min-w-[30vw]" ref={searchRef}>
            {/* Search Box */}
            <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden">
                <div className="grid place-items-center h-full text-gray-300">
                    <AiOutlineSearch className="w-8 h-8 mx-2 fill-gray-500" />
                </div>

                <input
                    className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                    type="text"
                    id="search"
                    placeholder="Search something..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.trim() && setShowResults(true)}
                />
            </div>

            {/* Search Results */}
            {showResults && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto">
                    {blogs.length > 0 ? (
                        blogs.map((blog) => (
                            <Link
                                to={`/blog/${blog.id}`}
                                key={blog.id}
                                className="block px-4 py-3 border-b last:border-none transition-colors duration-200 hover:bg-gray-100 hover:text-blue-600"
                            >
                                <h3 className="font-medium">{blog.title}</h3>
                            </Link>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-gray-500">No results found</div>
                    )}
                </div>
            )}

        </div>
    );
}

export default SearchBar;
