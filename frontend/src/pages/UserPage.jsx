import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"


const UserPage = () => {
    return (
        <>
        <UserHeader/>
        <UserPost likes={1200} replies={231} postImg = "/post1.png" postTitle= "Lets Talk about threads" />
        <UserPost likes={400} replies={251} postImg = "/post2.png" postTitle= "Lets Talk about threads" />
        <UserPost likes={15600} replies={1231} postImg = "/post3.png" postTitle= "Tomake Chai Tomake " />
        <UserPost likes={15} replies={1231} postImg = "/post4.png" postTitle= "We do not belong here" />
        
         
        </>
    )
}

export default UserPage