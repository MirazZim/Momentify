import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"

import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post.jsx";




const UserPage = () => {

    // state to store the user data
    const [user, setUser] = useState(null);

    // extracting the username from the url
    const { username } = useParams();

    const showToast = useShowToast();

    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);
    const [fetchingPosts, setFetchingPosts] = useState(true);


    useEffect(() => {
        // an async function to fetch user data
        const getUser = async () => {
            try {
                // fetch the user data from the server
                const res = await fetch(`/api/users/profile/${username}`);
                // get the response data
                const data = await res.json();

                // if there is an error
                if (data.error) {
                    // show the error message
                    showToast("Error", data.error, "error");
                    // return so we dont set the user
                    return;
                }
                // set the user state
                setUser(data);
            } catch (error) {
                // if there was an error
                // show the error message
                showToast("Error", error.message, "error");

            } finally {
                // set the loading state to false
                setLoading(false);
            }
        };

        const getPosts = async () => {
            setFetchingPosts(true)
            try {
                const res = await fetch(`/api/posts/user/${username}`);
                const data = await res.json();

                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setPosts([]);
            } finally {
                setFetchingPosts(false);
            }
        };

        // call the function
        getUser();
        getPosts();
    }, [username, showToast])

    if (!user && loading) {
        return (
            <Flex
                justifyContent="center"
                alignItems="center"
                
            >
                <Spinner
                    size="xl"
                    thickness="4px"
                />
            </Flex>
        )
    }

    // if the user is null then return null
    if (!user && !loading) return (
        <Flex
            justifyContent="center"
            alignItems="center"
            
        >
            <h1>User not found</h1>
        </Flex>
    );




    return (
        <>
            <UserHeader user={user} />

            {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}
			{fetchingPosts && (
				<Flex justifyContent={"center"} my={12}>
					<Spinner size={"xl"} />
				</Flex>
			)}

			{posts.map((post) => (
				<Post key={post._id} post={post} postedBy={post.postedBy} />
			))}
            
        </>
    )
}

export default UserPage