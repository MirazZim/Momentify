import { useEffect, useState } from "react"
import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast.js";


const UserPage = () => {

    // state to store the user data
    const [user, setUser] = useState(null);

    // extracting the username from the url
    const { username } = useParams();

    const showToast = useShowToast();

    
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
                showToast("Error", error, "error");

            }
        };
        // call the function
        getUser();
    }, [username, showToast])

    // if the user is null then return null
    if (!user) return null;




    return (
        <>
            <UserHeader user={user} />
            <UserPost likes={1200} replies={231} postImg="/post1.png" postTitle="Lets Talk about threads" />
            <UserPost likes={400} replies={251} postImg="/post2.png" postTitle="Lets Talk about threads" />
            <UserPost likes={15600} replies={1231} postImg="/post3.png" postTitle="Tomake Chai Tomake " />
            <UserPost likes={15} replies={1231} postImg="/post4.png" postTitle="We do not belong here" />


        </>
    )
}

export default UserPage