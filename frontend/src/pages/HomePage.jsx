
import { Box, Flex, Spinner, Textarea, Icon, Text, HStack, Avatar, useColorModeValue, Input, FormControl, Image, CloseButton, Button } from "@chakra-ui/react";
import { FaPhotoVideo } from "react-icons/fa";
import useShowToast from "../hooks/useShowToast.js";
import { useEffect, useState, useRef } from "react";
import Post from "../components/Post.jsx";
import CreatePost from "../components/CreatePost.jsx";
import { useRecoilValue, useRecoilState } from "recoil";
import userAtom from "../../atoms/userAtom.js";
import postsAtom from "../../atoms/postsAtom.js";
import usePreviewImg from "../hooks/usePreviewImg.js";

const MAX_CHAR = 500;

const HomePage = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useRecoilState(postsAtom);
    const showToast = useShowToast();
    const user = useRecoilValue(userAtom);
    const [showPostButton, setShowPostButton] = useState(false);

    // State for the input bar
    const [postText, setPostText] = useState("");
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const imageRef = useRef(null);
    const [postLoading, setPostLoading] = useState(false);

    // Fetch posts for the feed
    useEffect(() => {
        const getFeedPosts = async () => {
            setLoading(true);
            setPosts([]);
            try {
                const res = await fetch("/api/posts/feed");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                console.log(data);
                setPosts(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getFeedPosts();
    }, [showToast, setPosts]);

    // Handle scroll to show/hide Post button
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowPostButton(true);
            } else {
                setShowPostButton(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Handle text input changes
    const handleTextChange = (e) => {
        const inputText = e.target.value;
        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR);
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText);
            setRemainingChar(MAX_CHAR - inputText.length);
        }
    };

    // Handle post creation
    const handleCreatePost = async () => {
        if (!postText && !imgUrl) {
            showToast("Error", "Please add some text or an image", "error");
            return;
        }

        setPostLoading(true);
        try {
            const res = await fetch("/api/posts/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
            });

            const data = await res.json();
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }
            showToast("Success", "Post created successfully", "success");
            setPosts([data, ...posts]);
            setPostText("");
            setImgUrl("");
        } catch (error) {
            showToast("Error", error.message || "Something went wrong!", "error");
        } finally {
            setPostLoading(false);
        }
    };

    return (
        <>
            {/* Input Bar (Modern and Sleek) */}
            <Box
                mb={6}
                p={3}
                bg={useColorModeValue("white", "gray.800")}
                borderRadius="lg"
                boxShadow={useColorModeValue("sm", "0 4px 6px rgba(0, 0, 0, 0.5)")}
                border="1px solid"
                borderColor={useColorModeValue("gray.200", "gray.700")}
            >
                <Flex alignItems="center" gap={3}>
                    {/* User Avatar */}
                    <Avatar
                        size="md"
                        src={user?.profilePic}
                        name={user?.name}
                        border="2px solid"
                        borderColor={useColorModeValue("gray.200", "gray.600")}
                        transition="all 0.2s ease"
                        _hover={{ borderColor: useColorModeValue("gray.300", "gray.500") }}
                    />
                    {/* Text Area */}
                    <Textarea
                        placeholder="What's on your mind?"
                        value={postText}
                        onChange={handleTextChange}
                        bg={useColorModeValue("gray.50", "gray.700")}
                        border="none"
                        borderRadius="full"
                        px={4}
                        py={2}
                        minH="44px"
                        maxH="120px"
                        resize="none"
                        fontSize="sm"
                        color={useColorModeValue("gray.800", "gray.200")}
                        _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                        _focus={{
                            bg: useColorModeValue("gray.100", "gray.600"),
                            boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
                            minH: "80px"
                        }}
                        transition="all 0.2s ease"
                    />
                </Flex>

                {/* Image Preview (if selected) */}
                {imgUrl && (
                    <Flex mt={3} w="full" position="relative">
                        <Image src={imgUrl} alt="Selected img" borderRadius="lg" maxH="200px" objectFit="cover" />
                        <CloseButton
                            onClick={() => setImgUrl("")}
                            bg={useColorModeValue("white", "gray.800")}
                            color={useColorModeValue("gray.600", "gray.300")}
                            position="absolute"
                            top={2}
                            right={2}
                            size="sm"
                            borderRadius="full"
                            _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
                        />
                    </Flex>
                )}

                {/* Photo/video and Post Button */}
                <Flex mt={2} justifyContent="space-between" alignItems="center">
                    <HStack spacing={3}>
                        <Flex
                            alignItems="center"
                            gap={1}
                            cursor="pointer"
                            onClick={() => imageRef.current.click()}
                            color={useColorModeValue("gray.600", "gray.400")}
                            _hover={{
                                color: useColorModeValue("green.500", "green.300"),
                                transform: "scale(1.05)"
                            }}
                            transition="all 0.2s ease"
                        >
                            <Icon as={FaPhotoVideo} boxSize={4} />
                            <Text fontSize="xs" fontWeight="medium">Photo/video</Text>
                        </Flex>
                        <Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
                    </HStack>
                    <Flex alignItems="center" gap={2}>
                        <Text
                            fontSize="xs"
                            fontWeight="medium"
                            color={remainingChar === 0 ? "red.500" : useColorModeValue("gray.500", "gray.400")}
                        >
                            {remainingChar}/{MAX_CHAR}
                        </Text>
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={handleCreatePost}
                            isLoading={postLoading}
                            isDisabled={!postText && !imgUrl}
                            borderRadius="full"
                            px={5}
                            fontSize="sm"
                            fontWeight="medium"
                            bgGradient={useColorModeValue(
                                "linear(to-r, blue.400, blue.500)",
                                "linear(to-r, blue.500, blue.600)"
                            )}
                            color="white"
                            _hover={{
                                bgGradient: useColorModeValue(
                                    "linear(to-r, blue.500, blue.600)",
                                    "linear(to-r, blue.600, blue.700)"
                                ),
                                transform: "scale(1.05)"
                            }}
                            _active={{
                                bgGradient: useColorModeValue(
                                    "linear(to-r, blue.600, blue.700)",
                                    "linear(to-r, blue.700, blue.800)"
                                )
                            }}
                            transition="all 0.2s ease"
                        >
                            Post
                        </Button>
                    </Flex>
                </Flex>
            </Box>

            {/* Post Feed */}
            <Flex gap='10' alignItems={"flex-start"}>
			<Box flex={70}>
				{!loading && posts.length === 0 && <h1>Follow some users to see the feed</h1>}

				{loading && (
					<Flex justify='center'>
						<Spinner size='xl' />
					</Flex>
				)}

				{posts.map((post) => (
					<Post key={post._id} post={post} postedBy={post.postedBy} />
				))}
			</Box>
			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				{/* <SuggestedUsers /> */}
			</Box>
		</Flex>

            {/* CreatePost Button (Visible only when scrolling down) */}
            {showPostButton && <CreatePost />}
        </>
    );
};

export default HomePage;
