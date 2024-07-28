import { Link } from 'react-router-dom';
export default function BlogCard({ blog }: any) {
    return (
        <div className="max-w-md mx-auto m-3 border bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl">
            <div className="md:flex">
                <div className="md:shrink-0">
                    <img className="h-48 w-full object-cover md:h-full md:w-48" src="https://loremflickr.com/g/320/240/team" />
                </div>
                <div className="p-8">
                    <Link to={`blog/${blog.id}`} className="block mt-1 text-lg leading-tight font-medium text-black hover:underline">
                        {blog.title}
                    </Link>
                    
                    <p className="mt-2 text-slate-500">
                        {blog.content}
                    </p>
                </div>
            </div>
        </div>
    );
}
