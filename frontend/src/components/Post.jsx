import { Avatar, Box, Divider, Flex, Image, Text } from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom"
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import Swal from "sweetalert2";

const Post = ({ post, postedBy }) => {
    
    const [user, setUser] = useState(null);
    const showToast = useShowToast();
    const navigate = useNavigate();
    const currentUser = useRecoilValue(userAtom);
    const [posts, setPosts] = useRecoilState(postsAtom);

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await fetch("/api/users/profile/" + postedBy);
                const data = await res.json();
               // console.log(data)
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setUser(data);
            } catch (error) {
                showToast("Error", error.message, "error");
                setUser(null);
            }
        };

        getUser();
    }, [postedBy, showToast]);

    const handleDeletePost = async (e) => {
		e.preventDefault();
		Swal.fire({
			title: "Delete Post?",
			text: "This action is permanent!",
			icon: "error",
			showCancelButton: true,
			confirmButtonColor: "#ff5252",
			cancelButtonColor: "#3e8e41",
			confirmButtonText: "Delete",
			cancelButtonText: "Cancel"
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const res = await fetch(`/api/posts/${post._id}`, {
						method: "DELETE",
					});
					const data = await res.json();
					if (data.error) {
						showToast("Error", data.error, "error");
						return;
					} 
					showToast("Success", "Post deleted", "success");
					setPosts(posts.filter((p) => p._id !== post._id));
				} catch (error) {
					showToast("Error", error.message, "error");
				}
			}
		});
	};

    if (!user) return null;
    return (
        <Link to={`/${user.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}
            >
                {/* Avatar and the line */}
                <Flex flexDirection={"column"} alignItems={"center"}>

                    <Avatar name={user?.name} src={user?.profilePic} size="md"
                    onClick={(e) => {
                        e.preventDefault();
                        navigate(`/${user.username}`);
                    }}
                    />

                    {/*the Line */}

                    <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                    {post.replies.length === 0 && <Text textAlign={"center"}>🥱</Text>}
                        {post.replies[0] && (
                            <Avatar
                                size='xs'
                                name='John doe'
                                src={post.replies[0].userProfilePic}
                                position={"absolute"}
                                top={"0px"}
                                left='15px'
                                padding={"2px"}
                            />
                        )}

                        {post.replies[1] && (
                            <Avatar
                                size='xs'
                                name='John doe'
                                src={post.replies[1].userProfilePic}
                                position={"absolute"}
                                bottom={"0px"}
                                right='-5px'
                                padding={"2px"}
                            />
                        )}

                        {post.replies[2] && (
                            <Avatar
                                size='xs'
                                name='John doe'
                                src={post.replies[2].userProfilePic}
                                position={"absolute"}
                                bottom={"0px"}
                                left='4px'
                                padding={"2px"}
                            />
                        )}
                    </Box>
                </Flex>

                {/* User Details and verified symbol, time and three dots */}
                <Flex flex={1} flexDirection={"column"} gap={2}>

                    <Flex justifyContent={"space-between"} w={"full"}>

                        <Flex w={"full"} alignItems={"center"}>

                            <Text fontSize={"sm"} fontWeight={"bold"}
                            onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${user.username}`);
                            }}>
                                {user?.name}
                            </Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />

                        </Flex>

                        <Flex gap={4} alignItems={"center"}>
                        <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
								{formatDistanceToNow(new Date(post.createdAt))} ago
							</Text>
                            {currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost}/>}
                        </Flex> 
                    </Flex>
 

                    {/* Post Text */}
                    <Text fontSize={"sm"}>{post.text}</Text>

                    {post.img && (
                        <Box
                            borderRadius={6}
                            overflow={"hidden"}
                            border={"1px solid"}
                            borderColor={"gray.light"}
                        >
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                    

                    {/* Post Interactions */}

                    


                </Flex>
            </Flex><Divider color={"gray.light"} my={4} />
        </Link>
    )
}
export default Post;