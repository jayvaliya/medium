import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../store/user';

export default function Navbar() {
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    return (
        <div className=" z-10 w-screen flex justify-between items-center p-4 border-b-2 bg-white">
            <Link to="/">

                <div className="flex gap-[1px] items-center">
                    <div className=" bg-black border-black w-8 h-8 rounded-[100%]"></div>
                    <div className=" bg-black border-black w-4 h-8 rounded-[100%]"></div>
                    <div className=" bg-black border-black w-2 h-8 rounded-[100%]"></div>
                    <span className=" text-3xl font-bold text-gray-800 pl-5 font-Playfair">Medium</span>
                </div>
            </Link>
            <SearchBar />
            <div>
                {user != null ?
                    <button type="button" className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-5 " onClick={() => navigate('/editor')} >Post Blog</button>
                    :
                    <button type="button" className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-5 " onClick={() => navigate('/signup')} >SignUp</button>
                }
            </div>
        </div>
    )
}
