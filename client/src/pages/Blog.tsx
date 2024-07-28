import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


export default function Blog() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});

  useEffect(() => {
    console.log('id:', id);
    const url = `http://localhost:8787/api/v1/blog/${id}`;

    axios.get(url)
      .then((response) => {
        setBlog(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });

  }, [id]);
  return (
    <>
      <main>
        <article>
          <header className="mx-auto mt-20 max-w-screen-lg rounded-t-lg bg-white pt-16 text-center shadow-lg">
            <p className="text-gray-500">Published April 4, 2022</p>
            <h1 className="mt-2 text-4xl font-bold text-gray-900 sm:text-5xl">hii</h1>
            <p className="mt-6 text-lg text-gray-700">You've come way farther than you expected</p>
            <img className="-z-10 absolute top-0 left-0 mt-10 h-96 w-full object-cover" src="https://images.unsplash.com/photo-1504672281656-e4981d70414b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
          </header>

          <div className="mx-auto max-w-screen-lg space-y-12 rounded-b-lg bg-white px-8 pt-10 pb-20 font-serif text-lg tracking-wide text-gray-700 sm:shadow-lg">
            <h2 className="text-2xl font-semibold">First Steps to Life Betterment</h2>
            <blockquote className="max-w-lg border-l-4 px-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda maiores tempora quod ducimus dolore!
              <span className="whitespace-nowrap text-sm">— Daniel Lehmer</span>
            </blockquote>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto enim maxime sit laudantium! Dolore atque, maxime iusto ut quas distinctio reiciendis animi voluptatibus soluta molestias, mollitia officiis laboriosam illum earum.</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus similique reiciendis et recusandae provident repellendus rem doloremque eaque error assumenda?</p>
          </div>
        </article>
      </main>

      <div className="w-fit mx-auto mt-10 flex space-x-2">
        <div className="h-0.5 w-2 bg-gray-600"></div>
        <div className="h-0.5 w-32 bg-gray-600"></div>
        <div className="h-0.5 w-2 bg-gray-600"></div>
      </div>

      
    </>

  )
}
