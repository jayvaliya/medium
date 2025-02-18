import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

type Blog = {
  id: string,
  title: string,
  content: string
}

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8787/api/v1/blog/bulk");
      setData(res.data.blogs);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="pt-10">
      {data.length > 0 ? (
        data.map((item: Blog) => (
          <BlogCard blog={item} key={item.id} />
        ))
      ) : (
        <h1>No data</h1>
      )}
    </div>
  );
}
