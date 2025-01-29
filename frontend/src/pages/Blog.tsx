import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks";
import {useParams} from "react-router-dom";
import { useEffect, useState } from "react";

// atomFamilies/selectorFamilies
export const Blog = () => {
    const { id } = useParams();
    const {loading, blog} = useBlog({
        id: id || ""
    });
        const [name, setName] = useState<string>("");
    
        useEffect(() => {
            const storedName = localStorage.getItem("name");
            if (storedName) {
                setName(storedName);
            }
        }, []);

    if (loading || !blog) {
        return <div>
            <Appbar name={name}/>
        
            <div className="h-screen flex flex-col justify-center">
                
                <div className="flex justify-center">
                    <Spinner />
                </div>
            </div>
        </div>
    }
    return <div>
        <FullBlog blog={blog} />
    </div>
}