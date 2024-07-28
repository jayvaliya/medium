import { Link } from 'react-router-dom';

export default function Navbar() {

    return (
        <div className=" w-screen flex justify-between items-center p-4 border-b-2 fixed bg-white">
            <Link to="/home">
        
                <div className="flex gap-[1px] items-center">
                    <div className=" bg-black border-black w-8 h-8 rounded-[100%]"></div>
                    <div className=" bg-black border-black w-4 h-8 rounded-[100%]"></div>
                    <div className=" bg-black border-black w-2 h-8 rounded-[100%]"></div>
                    <span className=" text-3xl font-bold text-gray-800 pl-5 font-Playfair">Medium</span>
                </div>
            </Link>
        </div>
    )
}
