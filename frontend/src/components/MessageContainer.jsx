import { Flex, Divider, Avatar, Text, Skeleton, SkeletonCircle, useColorModeValue, Image, useColorMode } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
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
  const messageEndRef = useRef(null);
  const { socket } = useSocket();
  const { colorMode } = useColorMode();

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

    // Inside the socket.on("messagesSeen") handler
socket.on("messagesSeen", ({ conversationId }) => {
  if (selectedConversation._id === conversationId) {
    // Update messages
    setMessages(prev => prev.map(msg => ({ ...msg, seen: true })));
    
    // Update conversations atom
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

      <Flex
        flexDir="column"
        gap={4}
        my={4}
        p={2}
        height="450px"
        overflowY="auto"
      >
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

        {!loadingMessages &&
          messages.map((message) => (
            <Flex
              key={message._id}
              direction="column"
              ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
                messages={messages} // Pass the messages array
              />
            </Flex>
          ))}
      </Flex>

      <MessageInput setMessages={setMessages} />
    </Flex>
  );
};

export default MessageContainer;