import { Flex, Divider, Avatar, Text, Skeleton, SkeletonCircle, useColorModeValue, Image, useColorMode, Box } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { useSocket } from "../../context/SocketContext";
import { keyframes } from "@emotion/react";

const typingAnimation = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0); }
`;

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const currentUser = useRecoilValue(userAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
  const { socket } = useSocket();
  const { colorMode } = useColorMode();

  const [isTyping, setIsTyping] = useState(false);
  const typingIndicatorRef = useRef(null);


  //animation strings
  const typingDot1 = `${typingAnimation} 1s infinite`;
  const typingDot2 = `${typingAnimation} 1s infinite 0.2s`;
  const typingDot3 = `${typingAnimation} 1s infinite 0.4s`;

  useEffect(() => {
    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
      setConversations((prev) => {
        const updatedConversations = prev.map((conversation) => {
          if (conversation._id === message.conversationId) {
            return {
              ...conversation,
              lastMessage: {
                text: message.text,
                sender: message.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
    });

    return () => socket.off("newMessage");
  }, [socket, selectedConversation, setConversations]);

  useEffect(() => {
    const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
    if (lastMessageIsFromOtherUser) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages(prev => prev.map(msg => ({ ...msg, seen: true })));
        setConversations(prev => prev.map(conv => {
          if (conv._id === conversationId) {
            return {
              ...conv,
              lastMessage: { ...conv.lastMessage, seen: true }
            };
          }
          return conv;
        }));
      }
    });

    return () => socket.off("messagesSeen");
  }, [socket, currentUser._id, messages, selectedConversation]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    // Scroll to bottom when messages change OR when typing status changes
    if (messages.length > 0 || isTyping) {
      if (isTyping) {
        typingIndicatorRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [messages, isTyping]);


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
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  useEffect(() => {
    socket.on("typing", ({ senderId, isTyping: typingStatus }) => {
      if (selectedConversation.userId === senderId) {
        setIsTyping(typingStatus);
      }
    });

    return () => {
      socket.off("typing");
    };
  }, [socket, selectedConversation.userId]);

  return (
    <Flex
      flex="70"
      bg={colorMode === "light" ? "gray.200" : "gray.700"}
      borderRadius="md"
      p={3}
      flexDirection="column"
    >
      <Flex w="full" h={12} alignItems="center" gap={2}>
        <Avatar src={selectedConversation.userProfilePic} size="sm" />
        <Text display="flex" alignItems="center">
          {selectedConversation.username}{" "}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>
      </Flex>

      <Divider />

      {/* Messages container */}
      <Flex
        flexDir="column"
        gap={4}
        my={4}
        p={2}
        height="450px"
        overflowY="auto"
      >
        {/* Loading skeletons */}
        {loadingMessages &&
          [...Array(5)].map((_, i) => (
            <Flex
              key={i}
              gap={2}
              alignItems="center"
              p={1}
              borderRadius="md"
              alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
            >
              {i % 2 === 0 && <SkeletonCircle size={7} />}
              <Flex flexDir="column" gap={2}>
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
                <Skeleton h="8px" w="250px" />
              </Flex>
              {i % 2 !== 0 && <SkeletonCircle size={7} />}
            </Flex>
          ))}

        {/* Messages */}
        {!loadingMessages && (
          <>
            {messages.map((message) => (
              <Flex
                key={message._id}
                direction="column"
                ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
              >
                <Message
                  message={message}
                  ownMessage={currentUser._id === message.sender}
                  messages={messages}
                />
              </Flex>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <Flex gap={2} ref={typingIndicatorRef}>
                <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
                <Flex bg="gray.400" p={2} borderRadius="md" alignSelf="flex-start">
                  <Flex gap={1}>
                    <Box 
                      w="8px" 
                      h="8px" 
                      bg="gray.500" 
                      borderRadius="full" 
                      animation={typingDot1}
                    />
                    <Box 
                      w="8px" 
                      h="8px" 
                      bg="gray.500" 
                      borderRadius="full" 
                      animation={typingDot2}
                    />
                    <Box 
                      w="8px" 
                      h="8px" 
                      bg="gray.500" 
                      borderRadius="full" 
                      animation={typingDot3}
                    />
                  </Flex>
                </Flex>
              </Flex>
            )}
          </>
        )}
      </Flex>

      <MessageInput setMessages={setMessages} />

    </Flex>
  );
};

export default MessageContainer;