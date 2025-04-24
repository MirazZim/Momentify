import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom"
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";


const Post = ({post, postedBy}) => {
    const [liked, setLiked] = useState(false);
    const [user, setUser] = useState(null);
    const showToast = useShowToast();

    useEffect(() => {
		const getUser = async () => {
			try {
				const res = await fetch("/api/users/profile/" + postedBy);
				const data = await res.json();
                console.log(data)
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

    if (!user) return null;
    return (
        <Link to={"/markzuck/post/1"}>
            <Flex gap={3} mb={4} py={5}
            >
                {/* Avatar and the line */}
                <Flex flexDirection={"column"} alignItems={"center"}>

                    <Avatar name={user?.name} src={user?.profilePic} size="md" />

                    {/*the Line */}

                    <Box w="1px" h={"full"} bg={"gray.light"} my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        <Avatar
                            size='xs'
                            name='John doe'
                            src='https://bit.ly/dan-abramov'
                            position={"absolute"}
                            top={"0px"}
                            left='15px'
                            padding={"2px"}
                        />

                        <Avatar
                            size='xs'
                            name='John doe'
                            src='https://bit.ly/sage-adebayo'
                            position={"absolute"}
                            bottom={"0px"}
                            right='-5px'
                            padding={"2px"}
                        />

                        <Avatar
                            size='xs'
                            name='John doe'
                            src='https://bit.ly/prosper-baba'
                            position={"absolute"}
                            bottom={"0px"}
                            left='4px'
                            padding={"2px"}
                        />
                    </Box>
                </Flex>

                {/* User Details and verified symbol, time and three dots */}
                <Flex flex={1} flexDirection={"column"} gap={2}>

                    <Flex justifyContent={"space-between"} w={"full"}>

                        <Flex w={"full"} alignItems={"center"}>

                            <Text fontSize={"sm"} fontWeight={"bold"}>
                                {user?.name}
                            </Text>
                            <Image src='/verified.png' w={4} h={4} ml={1} />

                        </Flex>

                        <Flex gap={4} alignItems={"center"}>
                            <Text fontStyle={"sm"} color={"gray.light"}>
                                1d
                            </Text>
                            <BsThreeDots />
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
						<Actions liked={liked} setLiked={setLiked} />
					</Flex>

                     {/* Post Interactions */}

					<Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"} fontSize='sm'>
							{post.likes.length} likes
						</Text>
						
                        {/* dot */}
						<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>

                        <Text color={"gray.light"} fontSize='sm'>
							{post.replies.length} replies
						</Text>
						
					</Flex>


                </Flex>
            </Flex>
        </Link>
    )
}
export default Post;