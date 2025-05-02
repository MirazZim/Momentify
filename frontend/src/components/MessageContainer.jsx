import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"
import Message from "./Message"
import MessageInput from "./MessageInput"
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";


const MessageContainer = () => {
    const showToast = useShowToast();
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messages, setMessages] = useState([]);
    const currentUser = useRecoilValue(userAtom);

    const setConversations = useSetRecoilState(conversationsAtom);

    // Reference to the last message for auto-scrolling
    const messageEndRef = useRef(null);

    // Access socket from the socket context
    const { socket } = useSocket();



    // Handle incoming new messages via socket
    useEffect(() => {
        //1. Listen for "newMessage" event from the server
        socket.on("newMessage", (message) => {
            //2. If the message belongs to the currently selected conversation
            if (selectedConversation._id === message.conversationId) {
                //3. Add the new message to the messages state
                setMessages((prev) => [...prev, message]);
            }

            // // make a sound if the window is not focused
            // if (!document.hasFocus()) {
            // 	const sound = new Audio(messageSound);
            // 	sound.play();
            // }

            //4. Update the conversations state to reflect the new last message
            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    //5. If the conversation matches the message's conversation ID
                    if (conversation._id === message.conversationId) {
                        return {
                            ...conversation,
                            //6. Update the last message details
                            lastMessage: {
                                text: message.text,
                                sender: message.sender,
                            },
                        };
                    }
                    //7. Return the conversation unchanged
                    return conversation;
                });
                return updatedConversations;
            });
        });

        //8. Clean up the socket listener when component unmounts
        return () => socket.off("newMessage");
    }, [socket, selectedConversation, setConversations]);




    //9. Scroll to the last message when messages change
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);



    useEffect(() => {
        const getMessages = async () => {
            setLoadingMessages(true);
            setMessages([]);
            try {
                if (selectedConversation.mock) return;
                const res = await fetch(`/api/messages/${selectedConversation.userId}`);
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }

                setMessages(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingMessages(false);
            }
        };

        getMessages();
    }, [showToast, selectedConversation.userId]);

    return (
        <Flex
            flex='70'
            bg={useColorModeValue("gray.200", "gray.dark")}
            borderRadius={"md"}
            p={2}
            flexDirection={"column"}
        >
            {/* Message header */}
            <Flex w={"full"} h={12} alignItems={"center"} gap={2}>
                <Avatar src={selectedConversation.userProfilePic} size={"sm"} />
                <Text display={"flex"} alignItems={"center"}>
                    {selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} />
                </Text>
            </Flex>

            <Divider />

            <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>

                {loadingMessages &&
                    [...Array(5)].map((_, i) => (
                        <Flex
                            key={i}
                            alignItems={"center"}

                            borderRadius={"md"}
                            p={2}
                            alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
                        >
                            {i % 2 === 0 && <SkeletonCircle size={7} />}
                            <Flex
                                flexDirection={"column"}
                                gap={2}>
                                <Skeleton height={"8px"} w={"250px"} />
                                <Skeleton height={"8px"} w={"250px"} />
                                <Skeleton height={"8px"} w={"250px"} />

                            </Flex>

                        </Flex>
                    ))}

                {/* Render messages, attaching ref to the last message for scrolling */}
                {!loadingMessages &&
                    messages.map((message) => (
                        <Flex
                            key={message._id}
                            direction={"column"}
                            ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
                        >
                            <Message message={message} ownMessage={currentUser._id === message.sender} />
                        </Flex>
                    ))}
            </Flex>

            <MessageInput setMessages={setMessages} />

        </Flex>
    )
}


export default MessageContainer