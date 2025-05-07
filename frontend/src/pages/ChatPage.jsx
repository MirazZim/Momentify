import {
    Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text,
    useColorMode, IconButton, InputGroup, InputLeftElement,
    Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, useDisclosure,
    useBreakpointValue, VStack
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useEffect, useState } from 'react';
import Conversations from '../components/Conversations';
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../hooks/useShowToast.js';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../../atoms/messagesAtom.js';
import { GiConversation } from 'react-icons/gi';
import userAtom from '../../atoms/userAtom.js';
import { useSocket } from '../../context/SocketContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const ChatPage = () => {
    const [searchText, setSearchText] = useState("");
    const [searchingUser, setSearchingUser] = useState(false);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);
    const [originalConversations, setOriginalConversations] = useState([]);
    const currentUser = useRecoilValue(userAtom);
    const showToast = useShowToast();
    const { colorMode } = useColorMode();
    const { socket, onlineUsers } = useSocket();
    const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
    const isMobile = useBreakpointValue({ base: true, md: false });

    useEffect(() => {
        socket?.on("messagesSeen", ({ conversationId }) => {
            setConversations((prev) => {
                const updatedConversations = prev.map((conversation) => {
                    if (conversation._id === conversationId) {
                        return {
                            ...conversation,
                            lastMessage: {
                                ...conversation.lastMessage,
                                seen: true,
                            },
                        };
                    }
                    return conversation;
                });
                return updatedConversations;
            });
        });
    }, [socket, setConversations]);

    useEffect(() => {
        const getConversations = async () => {
            setLoadingConversations(true);
            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                // Filter out conversations with invalid participants
                const validConversations = data.filter(
                    (conversation) => conversation.participants && conversation.participants[0] && conversation.participants[0]._id
                );
                setConversations(validConversations);
                setOriginalConversations(validConversations);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingConversations(false);
            }
        };
        getConversations();
    }, [showToast, setConversations]);

    const handleConversationSearch = async (e) => {
        e.preventDefault();
        if (!searchText.trim()) {
            showToast("Error", "Please enter a username to search", "error");
            return;
        }

        setSearchingUser(true);
        try {
            const res = await fetch(`/api/users/profile/${searchText}`);
            const searchedUser = await res.json();

            if (searchedUser.error || !searchedUser._id) {
                showToast("Error", searchedUser.error || "No user found with this name", "error");
                setConversations([]);
                return;
            }

            if (!searchedUser._id.match(/^[0-9a-fA-F]{24}$/)) {
                showToast("Error", "Invalid user ID returned from server", "error");
                setConversations([]);
                return;
            }

            const messagingYourself = searchedUser._id === currentUser._id;
            if (messagingYourself) {
                showToast("Error", "You cannot message yourself", "error");
                setConversations([]);
                return;
            }

            const conversationAlreadyExists = originalConversations.find(
                (conversation) => conversation.participants && conversation.participants[0] && conversation.participants[0]._id === searchedUser._id
            );

            if (conversationAlreadyExists) {
                setSelectedConversation({
                    _id: conversationAlreadyExists._id,
                    userId: searchedUser._id,
                    username: searchedUser.username,
                    userProfilePic: searchedUser.profilePic,
                });
                setConversations([conversationAlreadyExists]);
                if (isMobile) onDrawerClose();
                return;
            }

            const mockConversation = {
                mock: true,
                lastMessage: {
                    text: "",
                    sender: "",
                },
                _id: Date.now(),
                participants: [
                    {
                        _id: searchedUser._id,
                        username: searchedUser.username,
                        profilePic: searchedUser.profilePic,
                    },
                ],
            };

            setConversations([mockConversation]);
            if (isMobile) onDrawerClose();

        } catch (error) {
            showToast("Error", "An error occurred while searching", "error");
            setConversations([]);
        } finally {
            setSearchingUser(false);
        }
    };

    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (value === "") {
            setConversations(originalConversations);
            setSelectedConversation({ _id: "" });
        }
    };

    const handleCancelSearch = () => {
        setSearchText("");
        setConversations(originalConversations);
        setSelectedConversation({ _id: "" });
    };

    const handleCloseChat = () => {
        setSelectedConversation({ _id: "" });
        setSearchText("");
        if (isMobile) onDrawerOpen();
    };

    const handleSelectConversation = (conversation) => {
        if (!conversation.participants || !conversation.participants[0]) return;
        setSelectedConversation({
            _id: conversation._id,
            userId: conversation.participants[0]._id,
            username: conversation.participants[0].username,
            userProfilePic: conversation.participants[0].profilePic,
        });
        if (isMobile) onDrawerClose();
    };

    return (
        <Box
            position={{ base: "relative", md: "absolute" }}
            left={{ base: "0", md: "50%" }}
            w={{ base: "100%", md: "90%", lg: "900px" }}
            p={{ base: 0, md: 4 }}
            transform={{ base: "none", md: "translateX(-50%)" }}
            bg={colorMode === "light" ? "white" : "gray.800"}
            borderRadius={{ base: "none", md: "2xl" }}
            boxShadow={{ base: "none", md: "lg" }}
            h={{ base: "100vh", md: "auto" }}
            overflow="hidden"
        >
            <Drawer
                isOpen={isDrawerOpen}
                placement="left"
                onClose={onDrawerClose}
                size={{ base: "xs", md: "full" }}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader
                        borderBottomWidth="1px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={3}
                    >
                        <Text fontWeight="bold">Conversations</Text>
                        <IconButton
                            icon={<CloseIcon />}
                            variant="ghost"
                            onClick={onDrawerClose}
                            aria-label="Close drawer"
                            size="sm"
                        />
                    </DrawerHeader>
                    <DrawerBody p={0}>
                        <VStack spacing={3} p={3}>
                            <form onSubmit={handleConversationSearch} style={{ width: '100%' }}>
                                <Flex gap={2} alignItems="center">
                                    <InputGroup>
                                        <InputLeftElement pointerEvents="none">
                                            <SearchIcon color={colorMode === "light" ? "gray.400" : "gray.500"} />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Search users..."
                                            value={searchText}
                                            onChange={handleSearchInputChange}
                                            borderRadius="full"
                                            bg={colorMode === "light" ? "gray.100" : "gray.700"}
                                        />
                                    </InputGroup>
                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        borderRadius="full"
                                        px={4}
                                        isLoading={searchingUser}
                                    >
                                        Search
                                    </Button>
                                </Flex>
                            </form>

                            {loadingConversations && (
                                [0, 1, 2, 3, 4].map((_, i) => (
                                    <Flex
                                        key={i}
                                        p={3}
                                        borderRadius="lg"
                                        gap={3}
                                        alignItems="center"
                                        w="full"
                                        bg={colorMode === "light" ? "white" : "gray.600"}
                                    >
                                        <SkeletonCircle size="10" />
                                        <VStack align="start" spacing={1} flex={1}>
                                            <Skeleton height="3" w="120px" />
                                            <Skeleton height="3" w="80%" />
                                        </VStack>
                                    </Flex>
                                ))
                            )}

                            {!loadingConversations && conversations.length === 0 && !searchText && (
                                <Text color="gray.500" textAlign="center" py={4}>
                                    No conversations available
                                </Text>
                            )}

                            {!loadingConversations && conversations.map((conversation) => (
                                conversation.participants && conversation.participants[0] ? (
                                    <Box
                                        key={conversation._id}
                                        onClick={() => handleSelectConversation(conversation)}
                                        w="full"
                                        p={2}
                                        borderRadius="md"
                                        _hover={{ bg: colorMode === "light" ? "gray.100" : "gray.600" }}
                                        cursor="pointer"
                                    >
                                        <Conversations
                                            isOnline={onlineUsers && conversation.participants[0] && onlineUsers.includes(conversation.participants[0]._id)}
                                            conversation={conversation}
                                        />
                                    </Box>
                                ) : null
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>

            <Flex
                gap={4}
                flexDirection={{ base: "column", md: "row" }}
                h={{ base: "100vh", md: "600px" }}
            >
                <Flex
                    display={{ base: "none", md: "flex" }}
                    flex={30}
                    flexDirection="column"
                    bg={colorMode === "light" ? "gray.50" : "gray.700"}
                    p={4}
                    borderRadius="xl"
                    boxShadow="md"
                >
                    <Text fontSize="xl" fontWeight="bold" mb={4}>
                        Your Conversations
                    </Text>

                    <form onSubmit={handleConversationSearch}>
                        <Flex mb={4} gap={2}>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <SearchIcon color="gray.400" />
                                </InputLeftElement>
                                <Input
                                    placeholder="Search users..."
                                    value={searchText}
                                    onChange={handleSearchInputChange}
                                    borderRadius="full"
                                    bg={colorMode === "light" ? "white" : "gray.600"}
                                />
                            </InputGroup>
                            <Button
                                type="submit"
                                colorScheme="blue"
                                borderRadius="full"
                                px={4}
                                isLoading={searchingUser}
                            >
                                Search
                            </Button>
                        </Flex>
                    </form>

                    {loadingConversations && (
                        [0, 1, 2, 3, 4].map((_, i) => (
                            <Flex
                                key={i}
                                p={3}
                                borderRadius="lg"
                                gap={3}
                                alignItems="center"
                                mb={2}
                                bg={colorMode === "light" ? "white" : "gray.600"}
                            >
                                <SkeletonCircle size="10" />
                                <VStack align="start" spacing={1} flex={1}>
                                    <Skeleton height="3" w="120px" />
                                    <Skeleton height="3" w="80%" />
                                </VStack>
                            </Flex>
                        ))
                    )}

                    {!loadingConversations && conversations.length === 0 && !searchText && (
                        <Text color="gray.500" textAlign="center" py={4}>
                            No conversations available
                        </Text>
                    )}

                    {!loadingConversations && conversations.map((conversation) => (
                        conversation.participants && conversation.participants[0] ? (
                            <Box
                                key={conversation._id}
                                onClick={() => handleSelectConversation(conversation)}
                                p={2}
                                borderRadius="md"
                                _hover={{ bg: colorMode === "light" ? "gray.100" : "gray.600" }}
                                cursor="pointer"
                            >
                                <Conversations
                                    isOnline={onlineUsers && conversation.participants[0] && onlineUsers.includes(conversation.participants[0]._id)}
                                    conversation={conversation}
                                />
                            </Box>
                        ) : null
                    ))}
                </Flex>

                <AnimatePresence>
                    {selectedConversation._id ? (
                        <motion.div
                            key="message-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                flex: 70,
                                height: { base: "100vh", md: "600px" },
                                position: "relative"
                            }}
                        >
                            <Box
                                position="relative"
                                w="full"
                                h={{ base: "100vh", md: "600px" }}
                                bg={colorMode === "light" ? "gray.100" : "gray.800"}
                            >
                                <IconButton
                                    icon={<CloseIcon />}
                                    size="sm"
                                    position="absolute"
                                    top={3}
                                    right={3}
                                    onClick={handleCloseChat}
                                    aria-label="Close conversation"
                                    bg={colorMode === "light" ? "gray.200" : "gray.600"}
                                    color={colorMode === "light" ? "gray.700" : "gray.200"}
                                    borderRadius="full"
                                    _hover={{ bg: colorMode === "light" ? "gray.300" : "gray.500", transform: "scale(1.1)" }}
                                    transition="all 0.2s"
                                    zIndex={1}
                                />
                                <MessageContainer />
                            </Box>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                                flex: 70,
                                height: { base: "100vh", md: "600px" },
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <Flex
                                flexDir="column"
                                alignItems="center"
                                justifyContent="center"
                                p={6}
                                textAlign="center"
                                onClick={isMobile ? onDrawerOpen : undefined}
                                cursor={isMobile ? "pointer" : "default"}
                            >
                                <GiConversation
                                    size={60}
                                    color={colorMode === "light" ? "gray.400" : "gray.500"}
                                />
                                <Text fontSize="xl" mt={4} fontWeight="medium">
                                    {isMobile ? (
                                        <>
                                            Tap to view conversations
                                            <ChevronRightIcon ml={2} />
                                        </>
                                    ) : "Select a conversation to start messaging"}
                                </Text>
                            </Flex>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Flex>
        </Box>
    );
};

export default ChatPage;