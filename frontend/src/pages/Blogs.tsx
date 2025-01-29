import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";


export const Blogs = () => {
    const { loading, blogs } = useBlogs();
    const [name, setName] = useState<string>("");

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        if (storedName) {
            setName(storedName);
        }
    }, []);

    if (loading) {
        
        return <div>
            <Appbar name={name}/> 
            <div  className="flex justify-center">
                <div>
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        </div>
    }

    return <div>
        <Appbar name={name}/>
        <div  className="flex justify-center">
            <div>
                {blogs.map(blog => <BlogCard
                    id={blog.id}
                    authorName={blog.author.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={"2nd Feb 2024"}
                />)}
            </div>
        </div>
    </div>
}

