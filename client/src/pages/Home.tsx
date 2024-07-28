import { useEffect, useState } from "react";
import axios from "axios";
import BlogCard from "../components/BlogCard";

export default function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://backend.valiyajay555.workers.dev/api/v1/blog/bulk");
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
    <div>
      {data.length > 0 ? (
        data.map((item: any) => (
          <BlogCard blog={item} key={item.title} />
        ))
      ) : (
        <h1>No data</h1>
      )}
    </div>
  );
}
