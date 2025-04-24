import { AddIcon } from "@chakra-ui/icons"
import {
    Button, useColorModeValue, useDisclosure, Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Textarea,
    Input,
    FormControl,
    Text,
    Flex,
    CloseButton,
    Image
} from "@chakra-ui/react"
import { BsFillImageFill } from "react-icons/bs"
import usePreviewImg from "../hooks/usePreviewImg.js" // Custom hook to handle image preview
import { useRef, useState } from "react"
import useShowToast from "../hooks/useShowToast.js"
import { useRecoilState, useRecoilValue } from "recoil"
import userAtom from "../../atoms/userAtom.js"
import postsAtom from "../../atoms/postsAtom.js"
import { useParams } from "react-router-dom"

const MAX_CHAR = 500; // Maximum characters allowed in the post text

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure(); 
// Chakra UI hook to control the open/close state of the modal

const [postText, setPostText] = useState("");
// Holds the text content of the post

const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
// Custom hook to handle image upload preview functionality

const imageRef = useRef(null);
// Ref to access the hidden file input element

const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
// Tracks how many characters the user can still type (e.g. 500 max)

const user = useRecoilValue(userAtom);
// Retrieves current user info from Recoil global state

const showToast = useShowToast();
// Custom hook to show Chakra UI toast notifications

const [loading, setLoading] = useState(false);
// Tracks loading state for submit button/UX feedback

const [posts, setPosts] = useRecoilState(postsAtom);
// Recoil state for list of posts to update UI when a new post is added

const { username } = useParams();
// Gets `username` from the route URL using React Router

const handleTextChange = (e) => {
	const inputText = e.target.value;

	if (inputText.length > MAX_CHAR) {
		const truncatedText = inputText.slice(0, MAX_CHAR);
		setPostText(truncatedText); // Ensure we don't exceed max length
		setRemainingChar(0);
	} else {
		setPostText(inputText); // Update post text state
		setRemainingChar(MAX_CHAR - inputText.length); // Update remaining characters
	}
};

const handleCreatePost = async () => {
	setLoading(true); // Start loading animation/spinner
	try {
		const res = await fetch("/api/posts/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
			// Send post data to backend
		});

		const data = await res.json();
		if (data.error) {
			showToast("Error", data.error, "error"); // Show backend error to user
			return;
		}
		showToast("Success", "Post created successfully", "success"); // Show success notification
		if (username === user.username) {
			setPosts([data, ...posts]); // Optimistically update UI with new post
		}
		onClose(); // Close modal
		setPostText(""); // Clear post input
		setImgUrl(""); // Clear image preview
	} catch (error) {
		showToast("Error", error.message || "Something went wrong!", "error");
		// Catch unexpected errors and show fallback message
	} finally {
		setLoading(false); // Stop loading spinner regardless of success/failure
	}
};



    return (
        <>

            <Button
                position={"fixed"}
                bottom={10}
                right={5}
                bg={useColorModeValue("gray.300", "gray.dark")} // Dynamic background color based on theme
                leftIcon={<AddIcon />} // Icon for "Post" button
                onClick={onOpen} // Open modal on click
                size={{ base: "sm", sm: "md" }}
            >
                Post
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}> {/* Modal display logic */}
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder='Post content goes here..'
                                onChange={handleTextChange} // Handle character limit and update state
                                value={postText}
                            />
                            <Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
                                {remainingChar}/{MAX_CHAR} {/* Show remaining characters */}
                            </Text>

                            <Input type='file' hidden ref={imageRef} onChange={handleImageChange} /> {/* Hidden image input */}

                            <BsFillImageFill
                                style={{ marginLeft: "5px", cursor: "pointer" }}
                                size={20}
                                onClick={() => imageRef.current.click()} // Trigger hidden input click
                            />
                        </FormControl>


                        {imgUrl && (
                            <Flex mt={5} w={"full"} position={"relative"}>
                                <Image src={imgUrl} alt='Selected img' />
                                <CloseButton
                                    onClick={() => {
                                        setImgUrl("");
                                    }}
                                    bg={useColorModeValue("white", "gray.800")}
                                    position={"absolute"}
                                    top={2}
                                    right={2}
                                />
                            </Flex>
                        )}

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default CreatePost
