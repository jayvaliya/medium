import { useEffect, useState } from "react";
import { apiClient } from "../utils/var";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { AxiosError } from "axios";

interface DraftContentOp {
    insert?: string | object;
    attributes?: Record<string, unknown>;
    retain?: number;
    delete?: number;
}

type Draft = {
    id: string;
    title: string;
    content: string | DraftContentOp[];
    createdAt: string;
    author: {
        id: string;
        name: string;
    };
};

export default function Drafts() {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrafts = async () => {
            try {
                setLoading(true);
                const { data } = await apiClient.get('/api/v1/blog/drafts');
                setDrafts(data.drafts);
            } catch (err) {
                console.error("Error fetching drafts:", err);
                setError("Could not load drafts");

                // Fixed the 'err' is of type 'unknown' error
                const axiosError = err as AxiosError;

                // If unauthorized, redirect to login
                if (axiosError.response?.status === 401) {
                    toast.error("Please sign in to view drafts");
                    navigate("/signin");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDrafts();
    }, [navigate]); // Empty dependency array to fetch once on mount

    const handleEditDraft = (draft: Draft) => {
        navigate('/write', { state: { blog: draft } });
    };

    const handleDeleteDraft = async (id: string) => {
        if (!confirm("Are you sure you want to delete this draft?")) return;

        try {
            await apiClient.delete(`/api/v1/blog/${id}`);
            setDrafts(drafts.filter(draft => draft.id !== id));
            toast.success("Draft deleted successfully");
        } catch (error) {
            console.error("Error deleting draft:", error);
            toast.error("Failed to delete draft");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    // Helper function to safely extract text content from draft
    const getContentPreview = (content: string | DraftContentOp[]): string => {
        try {
            if (typeof content === 'string') {
                const parsed = JSON.parse(content) as DraftContentOp[];
                return parsed[0]?.insert?.toString() || "No content available";
            } else if (Array.isArray(content) && content.length > 0) {
                return content[0]?.insert?.toString() || "No content available";
            }
            return "No content available";
        } catch (e) {
            return "No content available";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Drafts</h1>

            {drafts.length > 0 ? (
                <div className="space-y-6">
                    {drafts.map((draft) => (
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
                                {getContentPreview(draft.content)}
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

                    <button
                        onClick={() => navigate('/write')}
                        className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-full transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Write Your First Story
                    </button>
                </div>
            )}
        </div>
    );
}