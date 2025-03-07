import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useRecoilState } from 'recoil';
import { userAtom } from '../store/user';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Navbar() {
    const [user, setUser] = useRecoilState(userAtom);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setIsLoading(false);
                    return;
                }

                const { data } = await axios.get("/api/v1/user/me", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (data.user) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Clear token if it's invalid
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    localStorage.removeItem("token");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [setUser]);

    return (
        <div className="sticky top-0 z-30 w-full backdrop-blur-sm bg-white/80 border-b border-gray-200 shadow-sm transition-all duration-200">
            <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8">
                <Link to="/" className="transition-transform hover:scale-105 duration-200">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
                            <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
                            <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
                            <path d="m2.3 2.3 7.286 7.286" />
                            <circle cx="11" cy="11" r="2" />
                        </svg>
                        <span className="text-3xl font-bold text-gray-800 pl-4 font-Playfair tracking-tight">BlogPen</span>
                    </div>
                </Link>

                <div className="mx-4 flex-grow max-w-xl">
                    <SearchBar />
                </div>

                <div className="flex items-center space-x-4">
                    {isLoading ? (
                        <div className="w-20 h-10 bg-gray-100 rounded-lg animate-pulse"></div>
                    ) : user ? (
                        <>
                            <Link
                                to="/new-story"
                                className="hidden sm:flex items-center gap-2 bg-gray-100/80 hover:bg-gray-200/90 focus:ring-2 focus:ring-gray-300 focus:outline-none font-medium rounded-full text-gray-700 px-5 py-2.5 transition-all duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 20h9" />
                                    <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
                                </svg>
                                <span>Write</span>
                            </Link>

                            <Link
                                // @ts-expect-error - user is possibly null
                                to={`/profile/${user.id}`}
                                className="relative flex items-center"
                            >
                                <div className="w-10 h-10 overflow-hidden rounded-full bg-gradient-to-br from-emerald-400/80 to-blue-500/80 p-0.5 ring-2 ring-white hover:shadow-md transition-all duration-200 group">
                                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-gray-700">
                                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                            <circle cx="12" cy="7" r="4"></circle>
                                        </svg>
                                    </div>

                                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <Link
                            to="/signup"
                            className="text-white bg-gray-800 hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none font-medium rounded-lg text-sm px-6 py-2.5 transition-all duration-200"
                        >
                            Sign Up
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
