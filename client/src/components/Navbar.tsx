import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useRecoilState } from 'recoil';
import { userAtom } from '../store/user';
import { useEffect, useState, useRef } from 'react';
import { apiClient } from "../utils/var";
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function Navbar() {
    const [user, setUser] = useRecoilState(userAtom);
    const [isLoading, setIsLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsLoading(false);
                    setUser(null);
                    return;
                }

                const { data } = await apiClient.get("/api/v1/user/me");

                if (data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Properly type the error
                const axiosError = error as AxiosError;
                if (axiosError.response?.status === 401) {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } finally {
                setIsLoading(false);
            }
        };

        // Check auth state when component mounts or when token changes
        fetchUser();

        // Add event listener for storage changes (if user logs in/out in another tab)
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                fetchUser();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);

    }, [setUser]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
        toast.success("Logged out successfully");
    };

    return (
        <div className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-3.5 px-4 sm:px-6 lg:px-8">
                <Link to="/" className="transition-transform duration-300 flex items-center">
                    <div className="flex items-center group">
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300">
                                <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
                                <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
                                <path d="m2.3 2.3 7.286 7.286" />
                                <circle cx="11" cy="11" r="2" />
                            </svg>
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        </div>
                        <span className="text-3xl font-bold text-gray-800 pl-4 font-Playfair tracking-tight transition-all duration-300">
                            Blog<span className="text-emerald-600">Pen</span>
                        </span>
                    </div>
                </Link>

                <div className="mx-4 flex-grow max-w-xl">
                    <SearchBar />
                </div>

                <div className="flex items-center space-x-5">
                    {isLoading ? (
                        <div className="w-24 h-10 bg-gray-100 rounded-full animate-pulse"></div>
                    ) : user ? (
                        <>
                            <Link
                                to="/write"
                                className="hidden sm:flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 focus:ring-2 focus:ring-emerald-200 focus:outline-none font-medium rounded-full text-emerald-700 px-5 py-2.5 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                                </svg>
                                <span>Write</span>
                            </Link>

                            <Link
                                to="/profile/drafts"
                                className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-emerald-600 focus:outline-none font-medium text-sm px-3 py-2.5 transition-colors duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                <span>My Drafts</span>
                            </Link>

                            <div className="relative" ref={dropdownRef}>
                                <div
                                    className="relative flex items-center cursor-pointer"
                                    onMouseEnter={() => setDropdownOpen(true)}
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <div className="w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 ring-2 ring-white hover:ring-emerald-50 hover:shadow-md transition-all duration-300">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">

                                            {user?.name ? (
                                                <span className="text-lg font-medium text-emerald-700">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-emerald-700">
                                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                                    <circle cx="12" cy="7" r="4"></circle>
                                                </svg>
                                            )}
                                        </div>
                                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 transform origin-top-right transition-all duration-200">
                                        <div className="px-4 py-2 border-b border-gray-100 mb-1">
                                            <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>

                                        <Link
                                            to={`/profile/${user.id}`}
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="12" cy="7" r="4"></circle>
                                            </svg>
                                            <span>Profile</span>
                                        </Link>

                                        <Link
                                            to="/profile/drafts"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors duration-200 sm:hidden"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                            </svg>
                                            <span>My Drafts</span>
                                        </Link>

                                        <div className="border-t border-gray-100 my-1"></div>

                                        <button
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                                            onClick={handleLogout}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                                <polyline points="16 17 21 12 16 7"></polyline>
                                                <line x1="21" y1="12" x2="9" y2="12"></line>
                                            </svg>
                                            <span>Sign out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/signin"
                                className="hidden sm:block text-gray-700 hover:text-emerald-600 font-medium text-sm transition-colors duration-200"
                            >
                                Sign in
                            </Link>
                            <Link
                                to="/signup"
                                className="text-white bg-emerald-600 hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-200 focus:outline-none font-medium rounded-full text-sm px-6 py-2.5 transition-all duration-200 shadow-sm"
                            >
                                Get started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
