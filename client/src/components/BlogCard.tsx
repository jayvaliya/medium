import { Link, useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";

export default function BlogCard({ blog, showLikes = false }: {
    blog: {
        id: string;
        title: string;
        createdAt: string;
        likeCount?: number;
        userLiked?: boolean;
        author?: {
            id: string;
            name: string;
        }
    },
    showLikes?: boolean
}) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/blog/${blog.id}`);
    };

    // Format date
    const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    // Calculate estimated read time (based on average reading speed)
    const readTime = "5 min read";

    return (
        <div
            className="group cursor-pointer"
            onClick={handleNavigate}
        >
            <div className="flex items-start gap-4">
                <div className="flex-grow">
                    {/* Author info */}
                    {blog.author && (
                        <div className="flex items-center mb-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400/80 to-blue-500/80 flex items-center justify-center text-white text-xs font-medium mr-2">
                                {blog.author.name.charAt(0).toUpperCase()}
                            </div>
                            <Link
                                to={`/profile/${blog.author.id}`}
                                className="text-sm font-medium text-gray-800 hover:text-emerald-600 transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {blog.author.name}
                            </Link>
                            <span className="mx-1.5 text-gray-500">·</span>
                            <span className="text-sm text-gray-500">{formattedDate}</span>
                        </div>
                    )}

                    {/* Blog Title */}
                    <h2 className="text-xl font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-emerald-700 transition-colors">
                        {blog.title}
                    </h2>

                    {/* Read time */}
                    <div className="text-sm text-gray-500">{readTime}</div>

                    {/* Like info */}
                    {showLikes && (
                        <div className="mt-2">
                            <LikeButton
                                blogId={blog.id}
                                initialLiked={blog.userLiked || false}
                                initialCount={blog.likeCount || 0}
                            />
                        </div>
                    )}
                </div>

                {/* Thumbnail */}
                {/* <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <img
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                        src={`https://loremflickr.com/g/320/240/team`}
                        alt="Blog Thumbnail"
                    />
                </div> */}
            </div>
        </div>
    );
}
