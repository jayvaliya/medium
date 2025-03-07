import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

type Post = {
    id: string;
    title: string;
    content: any;
    published: boolean;
};

type UserProfile = {
    id: string;
    name: string;
    email: string;
    posts: Post[];
    likeCount: number;
};

export default function Profile() {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem("token");
                const { data } = await axios.get(`/api/v1/user/${id}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                setProfile({
                    ...data,
                    likeCount: data.likeCount || 0
                });
                setLoading(false);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Could not load profile");
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="rounded-full bg-gray-200 h-32 w-32 mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-2">Error</div>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="text-xl font-medium mb-2">User not found</div>
                    <p className="text-gray-600">The profile you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/80 to-blue-500/80 p-1 mb-6 shadow-xl">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-gray-700">
                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{profile.name}</h1>
                    <p className="text-gray-500 mb-6">{profile.email}</p>

                    <div className="flex space-x-6">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-gray-800">{profile.posts.length}</span>
                            <span className="text-gray-500">Stories</span>
                        </div>

                        <div className="text-center">
                            <span className="block text-2xl font-bold text-gray-800">{profile.likeCount || 0}</span>
                            <span className="text-gray-500">Likes</span>
                        </div>
                    </div>
                </div>

                {/* Profile Content Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <div className="flex -mb-px">
                        <div className="py-3 px-4 text-emerald-600 font-medium">Stories</div>
                    </div>
                </div>

                {/* User Posts */}
                {profile.posts.length > 0 ? (
                    <div className="space-y-10">
                        {profile.posts.map((post) => (
                            <div key={post.id} className="group">
                                <Link to={`/post/${post.id}`}>
                                    <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                                        {post.title}
                                    </h2>
                                </Link>

                                <div className="text-gray-600 line-clamp-3 mb-4">
                                    {post.content[0]?.insert || "No content available"}
                                </div>

                                <div className="flex items-center text-gray-500 text-sm">
                                    <span>{formatDate(new Date().toISOString())}</span>
                                    <span className="mx-2">·</span>
                                    <span>5 min read</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">No stories published yet</h3>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            When {profile.name} publishes stories, you'll see them here.
                        </p>

                        <Link
                            to="/new-story"
                            className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Write Your First Story
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}