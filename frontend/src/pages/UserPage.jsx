import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"

import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post.jsx";
import useGetUserProfile from "../hooks/useGetUserProfile.js";
import { useRecoilState } from "recoil";
import postsAtom from "../../atoms/postsAtom.js";




const UserPage = () => {
    //Update: used the useGetUserProfile Hook
    const {user , loading} = useGetUserProfile();
    // extracting the username from the url
    const { username } = useParams();
    const showToast = useShowToast(); 
    const [posts, setPosts] = useRecoilState(postsAtom);
    const [fetchingPosts, setFetchingPosts] = useState(true);

    useEffect(() => {
        

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
        getPosts();
    }, [username, showToast, setPosts]);
    

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