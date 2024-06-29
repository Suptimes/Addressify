import { useEffect, useState } from "react"

import { PropertyData, columns } from "./Columns"
import { DataTable } from "./DataTable"
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


const Properties = () => {
  const [data, setData] = useState<PropertyData[]>([]);
  const { data: currentUser, isLoading: userLoading, error } = useGetCurrentUser();
  // console.log("Current User:", currentUser);

  // Fetch posts only if currentUser is available
  const fetchPosts = async () => {
    if (!currentUser || !currentUser.posts) {
      return []; // Return empty array if posts are not available
    }
    return currentUser.posts.map((post: any) => post);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchPosts();
        setData(result || []); // Ensure result is an array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!userLoading && currentUser) {
      // Fetch data only when currentUser is available and loading is complete
      fetchData();
    }
  }, [userLoading, currentUser]);

  if (userLoading) {
    return (
          <div className="middlePage flex w-full h-full my-10 justify-center">
            <Loader w={40} h={40} brightness="brightness-50"/>
          </div>
          )
  }
  
  if (error) {
    return <div className="middlePage flex w-full h-full my-10 justify-center">Error loading user data</div>; // Handle potential errors
  }


  return (
    <div className="middlePage w-full max-w-5xl">
      <div className="common-container-noscroll">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <div className="max-w-5xl flex-start gap-3 justify-start w-full">
            <img 
              src="/icons/add-post.svg" 
              width={32}
              height={32} 
              alt="add" 
              className="brightness-0"/>
            <h2 className="h3-bold lg:h2-bold text-left w-full">My Properties</h2>
          </div>
          <div>
          <Button 
            type="submit" 
            className="shad-button_primary whitespace-nowrap max-md:scale-125 mr-3"
            >
            <Link to={"/create-post"}>Create post</Link>
          </Button>
          </div>
        </div>
        <div className="container">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Properties;

