import { useState } from 'react';
import axios from 'axios';

type LikeButtonProps = {
    blogId: string;
    initialLiked: boolean;
    initialCount: number;
    onLikeChange?: (liked: boolean, count: number) => void;
};

export default function LikeButton({
    blogId,
    initialLiked,
    initialCount,
    onLikeChange
}: LikeButtonProps) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialCount);
    const [isLoading, setIsLoading] = useState(false);

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigation if button is in a clickable container

        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if no token
            window.location.href = '/signin';
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.post(
                `/api/v1/blog/${blogId}/like`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setIsLiked(data.liked);
            setLikeCount(data.likeCount);

            if (onLikeChange) {
                onLikeChange(data.liked, data.likeCount);
            }
        } catch (error) {
            console.error("Error toggling like:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            disabled={isLoading}
            className={`flex items-center gap-1 ${isLiked
                    ? 'text-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                } transition-colors focus:outline-none`}
            aria-label={isLiked ? "Unlike post" : "Like post"}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isLoading ? "animate-pulse" : ""}
            >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
            </svg>
            <span>{likeCount}</span>
        </button>
    );
}