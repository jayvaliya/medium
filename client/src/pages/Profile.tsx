import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiClient } from "../utils/var";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/user";

// Define Post type
type Post = {
    id: string;
    title: string;
    content: string | Array<{ insert?: string }>;
    published: boolean;
    createdAt?: string;
};

// Define UserProfile type
type UserProfile = {
    id: string;
    name: string;
    email: string;
    posts: Post[];
    drafts: Post[];
    likeCount: number;
};

// Define Tab enum
enum Tab {
    STORIES,
    DRAFTS
}

export default function Profile() {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>(Tab.STORIES);
    const loggedInUser = useRecoilValue(userAtom);
    const navigate = useNavigate();

    // Check if current user is viewing their own profile
    const isOwnProfile = loggedInUser?.id === id;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;

            try {
                setLoading(true);
                // Add authorization header to ensure we get drafts
                const { data } = await apiClient.get(`/api/v1/user/${id}`);

                console.log("Profile data:", data);
                console.log("Drafts:", data.drafts);

                setProfile({
                    ...data,
                    drafts: data.drafts || [], // Ensure drafts is never undefined
                    posts: data.posts || [],
                    likeCount: data.likeCount || 0
                });
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Could not load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const handleEditDraft = (draft: Post) => {
        navigate('/write', { state: { blog: draft } });
    };

    const handleDeleteDraft = async (id: string) => {
        if (!confirm("Are you sure you want to delete this draft?")) return;

        try {
            await apiClient.delete(`/api/v1/blog/${id}`);

            // Update local state to remove the deleted draft
            if (profile?.drafts) {
                setProfile({
                    ...profile,
                    drafts: profile.drafts.filter(draft => draft.id !== id)
                });
            }

            toast.success("Draft deleted successfully");
        } catch (error) {
            console.error("Error deleting draft:", error);
            toast.error("Failed to delete draft");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600">{error || "Failed to load profile"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-24 h-24 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full mb-4 flex items-center justify-center text-white text-3xl font-bold">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
                    <p className="text-gray-500 mt-2">{profile.email}</p>

                    <div className="flex space-x-6 mt-6">
                        <div className="text-center">
                            <span className="block text-2xl font-bold text-gray-800">
                                {profile.posts.filter(post => post.published).length}
                            </span>
                            <span className="text-gray-500">Stories</span>
                        </div>

                        {isOwnProfile && (
                            <div
                                className="text-center cursor-pointer"
                                onClick={() => setActiveTab(Tab.DRAFTS)}
                            >
                                <span className="block text-2xl font-bold text-gray-800">
                                    {profile.drafts?.length || 0}
                                </span>
                                <span className="text-gray-500">Drafts</span>
                            </div>
                        )}

                        <div className="text-center">
                            <span className="block text-2xl font-bold text-gray-800">{profile.likeCount}</span>
                            <span className="text-gray-500">Likes</span>
                        </div>
                    </div>
                </div>

                {/* Profile Content Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <div className="flex -mb-px">
                        <div
                            className={`py-3 px-4 cursor-pointer ${activeTab === Tab.STORIES ? "text-emerald-600 font-medium border-b-2 border-emerald-600" : "text-gray-500"}`}
                            onClick={() => setActiveTab(Tab.STORIES)}
                        >
                            Stories
                        </div>
                        {isOwnProfile && (
                            <div
                                className={`py-3 px-4 cursor-pointer ${activeTab === Tab.DRAFTS ? "text-emerald-600 font-medium border-b-2 border-emerald-600" : "text-gray-500"}`}
                                onClick={() => setActiveTab(Tab.DRAFTS)}
                            >
                                Drafts
                            </div>
                        )}
                    </div>
                </div>

                {/* User Posts */}
                {activeTab === Tab.STORIES && (
                    profile.posts.length > 0 ? (
                        <div className="space-y-10">
                            {profile.posts.map((post) => (
                                <div key={post.id} className="group">
                                    <Link to={`/blog/${post.id}`}>
                                        <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <div className="text-gray-600 line-clamp-3 mb-4">
                                        {(() => {
                                            try {
                                                if (!post.content) return "No content available";

                                                if (typeof post.content === 'string') {
                                                    const parsed = JSON.parse(post.content);
                                                    return parsed[0]?.insert || "No content available";
                                                }

                                                return post.content[0]?.insert || "No content available";
                                            } catch (e) {
                                                console.error("Error parsing content:", e);
                                                return "Error displaying content";
                                            }
                                        })()}
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm">
                                        <span>{formatDate(post.createdAt || new Date().toISOString())}</span>
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

                            {isOwnProfile && (
                                <Link
                                    to="/write"
                                    className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Write Your First Story
                                </Link>
                            )}
                        </div>
                    )
                )}

                {/* User Drafts */}
                {activeTab === Tab.DRAFTS && isOwnProfile && (
                    profile.drafts && profile.drafts.length > 0 ? (
                        <div className="space-y-6">
                            {profile.drafts.map((draft) => (
                                <div key={draft.id} className="p-6 bg-gray-50 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
                                    <div
                                        className="text-xl font-bold text-gray-800 mb-2 cursor-pointer hover:text-emerald-600 transition-colors"
                                        onClick={() => handleEditDraft(draft)}
                                    >
                                        {draft.title || "Untitled"}
                                    </div>

                                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                                        <span>Last edited: {formatDate(draft.createdAt || new Date().toISOString())}</span>
                                    </div>

                                    <div className="text-gray-600 line-clamp-2 mb-4">
                                        {(() => {
                                            try {
                                                if (!draft.content) return "No content available";

                                                // If content is a string, try to parse it
                                                if (typeof draft.content === 'string') {
                                                    const parsed = JSON.parse(draft.content);
                                                    return parsed[0]?.insert || "No content available";
                                                }

                                                // If content is already an object/array
                                                return draft.content[0]?.insert || "No content available";
                                            } catch (e) {
                                                console.error("Error parsing draft content:", e);
                                                return "Error displaying content";
                                            }
                                        })()}
                                    </div>

                                    <div className="flex flex-wrap gap-3 mt-6">
                                        <button
                                            onClick={() => handleEditDraft(draft)}
                                            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                            </svg>
                                            Continue editing
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDraft(draft.id)}
                                            className="px-4 py-2 border border-gray-300 rounded-md text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors flex items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="3 6 5 6 21 6" />
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                <line x1="10" y1="11" x2="10" y2="17" />
                                                <line x1="14" y1="11" x2="14" y2="17" />
                                            </svg>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-gray-50 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">No drafts available</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                When you create drafts, you'll see them here.
                            </p>

                            <Link
                                to="/write"
                                className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Write Your First Story
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}