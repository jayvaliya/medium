import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { apiClient } from "../utils/var";
import BlogLoading from "../components/BlogLoading";
import LikeButton from '../components/LikeButton';

type BlogType = {
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt?: string;
  likeCount: number;
  userLiked: boolean;
};

export default function Blog() {
  const { id } = useParams();
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);
  const [blog, setBlog] = useState<BlogType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const { data } = await apiClient.get(`/api/v1/blog/${id}`);

        if (!data.blog) {
          setError("Blog not found");
          setLoading(false);
          return;
        }

        setBlog({
          title: data.blog.title,
          content: data.blog.content, // Content is a string
          author: data.blog.author,
          createdAt: data.blog.createdAt,
          likeCount: data.blog.likeCount || 0,
          userLiked: data.blog.userLiked || false
        });
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (!blog?.content || !editorRef.current) return;

    // Only initialize Quill once
    if (!quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        readOnly: true, // View-only mode
        modules: {
          toolbar: false
        },
      });

      try {
        const contentDelta = JSON.parse(blog.content); // Convert string back to object
        // @ts-expect-error Quill typings are incorrect
        quillInstance.current.setContents({ ops: contentDelta });
      } catch (error) {
        console.error("Error parsing content:", error);
        setError("Error displaying content");
      }
    }
  }, [blog]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  if (loading) return <BlogLoading />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/" className="text-emerald-600 hover:text-emerald-800 font-medium">
            Return to home page
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-white pt-8 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Article Header */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

        {/* Author Info */}
        <div className="flex items-center mb-8">
          <Link to={`/profile/${blog.author.id}`} className="flex items-center group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center mr-3">
              <span className="text-white font-medium text-lg">
                {blog.author.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-gray-900 font-medium group-hover:text-emerald-600 transition-colors">
                {blog.author.name}
              </h3>
              <p className="text-gray-500 text-sm">
                {formatDate(blog.createdAt)} • 5 min read
              </p>
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div ref={editorRef} className="min-h-[350px] pb-12" />
        </div>

        {/* Footer - Share and Like buttons */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex justify-between items-center">
          <div className="flex space-x-4">
            <LikeButton
              blogId={id || ''}
              initialLiked={blog?.userLiked || false}
              initialCount={blog?.likeCount || 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
