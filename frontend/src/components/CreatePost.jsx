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
    Text
} from "@chakra-ui/react"
import { BsFillImageFill } from "react-icons/bs"
import usePreviewImg from "../hooks/usePreviewImg.js" // Custom hook to handle image preview
import { useRef, useState } from "react"

const MAX_CHAR = 500; // Maximum characters allowed in the post text

const CreatePost = () => {
    const { isOpen, onOpen, onClose } = useDisclosure() // Modal visibility controls

    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg(); // Image preview hook

    const imageRef = useRef(null); // Ref to trigger hidden file input
    const [postText, setPostText] = useState(""); // State for post text
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR); // State for remaining characters


    const handleTextChange = (e) => {
        const inputText = e.target.value;

        if (inputText.length > MAX_CHAR) {
            const truncatedText = inputText.slice(0, MAX_CHAR); // Prevent text from exceeding MAX_CHAR
            setPostText(truncatedText);
            setRemainingChar(0);
        } else {
            setPostText(inputText); // Update text as user types
            setRemainingChar(MAX_CHAR - inputText.length); // Calculate remaining characters
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

                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost'>Post</Button> {/* You can add post submission logic here */}
                    </ModalFooter>
                </ModalContent>
            </Modal>

        </>
    )
}

export default CreatePost
