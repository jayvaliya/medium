import { useNavigate } from "react-router-dom";

export default function BlogCard({ blog }: {
    blog: {
        id: string,
        title: string,
        content: string
    }
}) {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/blog/${blog.id}`);
    };

    return (
        <div className="max-w-md mx-auto m-3 bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transition-transform duration-200 hover:scale-105 md:max-w-4xl">
            <div className="md:flex">
                <div className="md:shrink-0">
                    <img
                        className="h-48 w-full object-cover md:h-full md:w-48"
                        src="https://loremflickr.com/g/320/240/team"
                        alt="Blog Thumbnail"
                    />
                </div>
                <div className="p-6 flex flex-col justify-center">
                    <button
                        onClick={handleNavigate}
                        className="block text-lg font-semibold text-gray-800 transition-colors duration-200 hover:text-blue-600 hover:underline"
                    >
                        {blog.title}
                    </button>
                    {/* <p className="mt-2 text-gray-600">{blog.content}</p> */}
                </div>
            </div>
        </div>
    );
}
