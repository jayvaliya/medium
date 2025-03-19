import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { apiClient } from "../utils/var";
import "../quillStyles.css";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import { AxiosError } from "axios";

// Define type for Quill content operations
interface QuillOp {
    insert?: string | object;
    attributes?: Record<string, unknown>;
    retain?: number;
    delete?: number;
}

// Define type for Quill delta
interface QuillDelta {
    ops: QuillOp[];
}

// Define blog interface
interface Blog {
    id: string;
    title: string;
    content: string;
    published?: boolean;
}

// Define location state interface
interface LocationState {
    blog?: Blog;
}

export default function Write() {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillInstance = useRef<Quill | null>(null);
    const [title, setTitle] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    // Type the location state properly
    const blogToEdit = (location.state as LocationState)?.blog;

    // Add state for tracking if we're editing an existing blog
    const [blogId, setBlogId] = useState<string | null>(null);

    useEffect(() => {
        // If we have a blog to edit, populate the form
        if (blogToEdit) {
            setTitle(blogToEdit.title);
            setBlogId(blogToEdit.id);
            setIsLoading(true);
        }
    }, [blogToEdit]);

    useEffect(() => {
        if (editorRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(editorRef.current, {
                debug: "info",
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: 1 }, { header: 2 }],
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ align: [] }],
                        ["blockquote", "code-block"],
                        [{ color: [] }, { background: [] }],
                        [{ font: [] }],
                        [{ link: "link" }],
                    ],
                },
            });

            // If editing an existing blog, load its content
            if (blogToEdit && quillInstance.current) {
                try {
                    const contentDelta = JSON.parse(blogToEdit.content);
                    quillInstance.current.setContents(contentDelta);
                } catch (error) {
                    console.error("Error parsing content:", error);
                    toast.error("Error loading content");
                } finally {
                    setIsLoading(false);
                }
            }
        }
    }, [blogToEdit]);

    const saveBlog = async (publish = false) => {
        if (isSaving) return; // Prevent multiple save operations

        if (!title.trim()) {
            toast.error("Please enter a title before saving.");
            return;
        }

        if (!quillInstance.current) {
            console.warn("No editor instance found");
            return;
        }

        const contentDelta = quillInstance.current.getContents() as QuillDelta;

        // Check if content is empty
        const isEmpty = contentDelta.ops.length === 1 &&
            typeof contentDelta.ops[0].insert === 'string' &&
            contentDelta.ops[0].insert === "\n";
        if (isEmpty) {
            toast.error("Please write something before saving.");
            return;
        }

        setIsSaving(true);
        try {
            // If we have a blogId, we're updating an existing blog
            if (blogId) {
                await apiClient.put(
                    "/api/v1/blog",
                    {
                        id: blogId,
                        title,
                        content: contentDelta.ops, // This should be an array of operations
                        published: publish
                    }
                );
                toast.success(publish ? "Blog published successfully!" : "Draft updated successfully!");
            } else {
                // Otherwise, create a new blog
                await apiClient.post(
                    "/api/v1/blog",
                    {
                        title,
                        content: contentDelta.ops, // This should be an array of operations
                        published: publish
                    }
                );
                toast.success(publish ? "Blog published successfully!" : "Draft saved successfully!");
            }

            navigate(publish ? "/" : "/profile/drafts");
        } catch (error) {
            console.error("Failed to save blog:", error);

            // Better error handling with more details - properly typed
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Response data:", axiosError.response.data);
                console.error("Response status:", axiosError.response.status);

                // Type assertion for the response data
                const responseData = axiosError.response.data as { message?: string };
                toast.error(`Error: ${responseData.message || "Server error"}`);
            } else if (axiosError.request) {
                // The request was made but no response was received
                toast.error("Server did not respond. Check your connection.");
            } else {
                // Something happened in setting up the request
                toast.error("Error saving your blog: " + (axiosError.message || "Unknown error"));
            }
        } finally {
            setIsSaving(false);
        }
    };

    // Handle publish
    const handlePublish = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        saveBlog(true);
    };

    // Handle save as draft
    const handleSaveDraft = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        saveBlog(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">

            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <div className="text-4xl justify-center text-gray-500 font-normal flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                        <path d="M12 20h9"></path>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                    {blogId ? "Edit your story" : "Write your story"}
                </div>
                {/* Top Action Bar - Fixed position */}
                <div className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 py-3 px-4 border-b border-gray-100 shadow-sm">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-500 hover:text-gray-800 flex items-center gap-2 transition-colors px-3 py-1.5 rounded-md hover:bg-gray-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span className="hidden sm:inline">Back</span>
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSaving}
                                className="px-4 sm:px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-all duration-200 disabled:opacity-70 text-sm sm:text-base shadow-sm hover:shadow flex items-center"
                            >
                                {isSaving ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </div>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                            <polyline points="17 21 17 13 7 13 7 21" />
                                            <polyline points="7 3 7 8 15 8" />
                                        </svg>
                                        Save draft
                                    </>
                                )}
                            </button>

                            <button
                                onClick={handlePublish}
                                disabled={isSaving}
                                className="px-4 sm:px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-70 text-sm sm:text-base shadow-md hover:shadow-lg"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 20h9"></path>
                                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                                        </svg>
                                        <span>Publish</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content - Give space for fixed header */}
                <div className="pt-10">
                    {/* Header with subtle animation */}
                    <div className="mb-8 animate-fade-in">
                        <input
                            type="text"
                            placeholder="Title your masterpiece..."
                            className="w-full text-4xl sm:text-5xl font-bold py-4 bg-transparent border-none focus:outline-none focus:ring-0 placeholder-gray-300 text-gray-900"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <div className="h-1 w-16 bg-emerald-500 rounded mt-2"></div>
                    </div>

                    {/* Editor with enhanced styling */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10">
                                <div className="flex flex-col items-center bg-white p-6 rounded-xl shadow-lg">
                                    <svg className="animate-spin h-10 w-10 text-emerald-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-gray-700 font-medium">Loading your content...</p>
                                </div>
                            </div>
                        )}
                        <div ref={editorRef} className="editor-container min-h-[600px]" />
                    </div>

                    {/* Writing Tips Card */}
                    <div className="mt-8 bg-emerald-50 rounded-xl p-5 border border-emerald-100">
                        <h3 className="text-lg font-medium text-emerald-800 mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            Writing Tips
                        </h3>
                        <ul className="space-y-2 text-emerald-700 text-sm">
                            <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 flex-shrink-0">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                Start with a compelling headline that grabs attention.
                            </li>
                            <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 flex-shrink-0">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                Break up long paragraphs for better readability.
                            </li>
                            <li className="flex items-start gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1 flex-shrink-0">
                                    <polyline points="9 11 12 14 22 4"></polyline>
                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                </svg>
                                Use formatting like headings and bold text to highlight key points.
                            </li>
                        </ul>
                    </div>

                    {/* Bottom Actions - Mobile only */}
                    <div className="mt-8 flex items-center justify-between sm:hidden">
                        <button
                            onClick={() => navigate("/")}
                            className="text-gray-500 hover:text-gray-700 flex items-center gap-2 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>

                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveDraft}
                                disabled={isSaving}
                                className="px-4 py-2 border border-gray-300 rounded-full text-gray-600 hover:bg-gray-50 transition-all duration-200 disabled:opacity-70"
                            >
                                Save
                            </button>

                            <button
                                onClick={handlePublish}
                                disabled={isSaving}
                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white font-medium transition-all duration-200 flex items-center gap-2 disabled:opacity-70"
                            >
                                Publish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}