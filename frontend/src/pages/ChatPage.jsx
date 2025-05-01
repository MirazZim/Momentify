import { SearchIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorMode, IconButton, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import Conversations from '../components/Conversations';
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../hooks/useShowToast.js';
import { useRecoilState, useRecoilValue } from 'recoil';
import { conversationsAtom, selectedConversationAtom } from '../../atoms/messagesAtom.js';
import { GiConversation } from 'react-icons/gi';
import { CloseIcon } from '@chakra-ui/icons';
import userAtom from '../../atoms/userAtom.js';

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

    // Initialize originalConversations when conversations are first loaded
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await fetch("/api/messages/conversations");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setConversations(data);
                setOriginalConversations(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingConversations(false);
            }
        };

        getConversations();
    }, [showToast, setConversations]);

    // Handle search form submission
    const handleConversationSearch = async (e) => {
        e.preventDefault();
        setSearchingUser(true);
        try {
            const res = await fetch(`/api/users/profile/${searchText}`);
            const searchedUser = await res.json();

            if (searchedUser.error || !searchedUser._id) {
                showToast("Error", "No user found with this name", "error");
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
                (conversation) => conversation.participants[0]._id === searchedUser._id
            );

            if (conversationAlreadyExists) {
                setSelectedConversation({
                    _id: conversationAlreadyExists._id,
                    userId: searchedUser._id,
                    username: searchedUser.username,
                    userProfilePic: searchedUser.profilePic,
                });
                setConversations([conversationAlreadyExists]);
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

        } catch (error) {
            showToast("Error", "An error occurred while searching", "error");
            setConversations([]);
        } finally {
            setSearchingUser(false);
        }
    };

    // Handle search input change and clearing
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchText(value);

        if (value === "") {
            setConversations(originalConversations);
            setSelectedConversation({ _id: "" });
        }
    };

    // Handle canceling the search
    const handleCancelSearch = () => {
        setSearchText("");
        setConversations(originalConversations);
        setSelectedConversation({ _id: "" });
    };

    // Handle closing the MessageContainer
    const handleCloseChat = () => {
        setConversations(originalConversations);
        setSelectedConversation({ _id: "" });
        setSearchText("");
    };

    return (
        <Box
            position={"absolute"}
            left={"50%"}
            w={{ lg: "900px", md: "90%", base: "100%" }}
            p={{ base: 2, md: 4 }}
            transform={"translateX(-50%)"}
            bg={colorMode === "light" ? "white" : "gray.800"}
            borderRadius="2xl"
            boxShadow="lg"
            border="none"
            backdropFilter="blur(10px)"
            bgGradient={colorMode === "light" ? "linear(to-br, white, gray.50)" : "linear(to-br, gray.800, gray.900)"}
        >
            <Flex
                gap={4}
                flexDirection={{ base: "column", md: "row" }}
                maxW={{ sm: "500px", md: "full" }}
                mx="auto"
                h={{ base: "auto", md: "600px" }}
            >
                <Flex
                    flex={30}
                    gap={3}
                    flexDirection="column"
                    maxW={{ sm: "300px", md: "full" }}
                    mx="auto"
                    bg={colorMode === "light" ? "gray.50" : "gray.700"}
                    p={4}
                    borderRadius="xl"
                    boxShadow="md"
                >
                    <Text
                        fontWeight={600}
                        fontSize="lg"
                        color={colorMode === "light" ? "gray.700" : "gray.200"}
                    >
                        Your Conversations
                    </Text>
                    <form onSubmit={handleConversationSearch}>
                        <Flex alignItems="center" gap={2}>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none">
                                    <SearchIcon color={colorMode === "light" ? "gray.400" : "gray.500"} />
                                </InputLeftElement>
                                <Input
                                    placeholder="Search for a user"
                                    value={searchText}
                                    onChange={handleSearchInputChange}
                                    bg={colorMode === "light" ? "white" : "gray.600"}
                                    border="none"
                                    borderRadius="full"
                                    boxShadow="sm"
                                    _focus={{
                                        boxShadow: "outline",
                                        borderColor: colorMode === "light" ? "blue.300" : "blue.500",
                                    }}
                                    _hover={{ boxShadow: "md" }}
                                />
                            </InputGroup>
                            <Button
                                size="sm"
                                isLoading={searchingUser}
                                type="submit"
                                bgGradient={colorMode === "light" ? "linear(to-r, blue.400, blue.500)" : "linear(to-r, blue.500, blue.600)"}
                                color="white"
                                borderRadius="full"
                                _hover={{ bgGradient: colorMode === "light" ? "linear(to-r, blue.500, blue.600)" : "linear(to-r, blue.600, blue.700)" }}
                                transition="all 0.3s"
                            >
                                <SearchIcon />
                            </Button>
                            {searchText && (
                                <Button
                                    size="sm"
                                    onClick={handleCancelSearch}
                                    bg={colorMode === "light" ? "gray.200" : "gray.600"}
                                    color={colorMode === "light" ? "gray.700" : "gray.200"}
                                    borderRadius="full"
                                    _hover={{ bg: colorMode === "light" ? "gray.300" : "gray.500" }}
                                    transition="all 0.3s"
                                >
                                    Cancel
                                </Button>
                            )}
                        </Flex>
                    </form>
                    {loadingConversations && (
                        [0, 1, 2, 3, 4].map((_, i) => (
                            <Flex
                                p={3}
                                borderRadius="lg"
                                gap={3}
                                alignItems="center"
                                key={i}
                                bg={colorMode === "light" ? "white" : "gray.600"}
                                boxShadow="sm"
                            >
                                <SkeletonCircle size="8" speed={0.8} />
                                <Flex w="full" flexDirection="column" gap={2}>
                                    <Skeleton height="10px" w="100px" speed={0.8} />
                                    <Skeleton height="8px" w="80%" speed={0.8} />
                                </Flex>
                            </Flex>
                        ))
                    )}

                    {!loadingConversations && conversations.length === 0 && !searchText ? (
                        <Text
                            color={colorMode === "light" ? "gray.500" : "gray.400"}
                            fontSize="sm"
                            textAlign="center"
                            p={4}
                        >
                            No conversations available
                        </Text>
                    ) : (
                        !loadingConversations &&
                        conversations.map((conversation) => (
                            <Conversations key={conversation._id} conversation={conversation} />
                        ))
                    )}
                </Flex>

                {!selectedConversation._id && (
                    <Flex
                        flex={70}
                        borderRadius="xl"
                        p={4}
                        flexDir="column"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        bg={colorMode === "light" ? "gray.50" : "gray.700"}
                        boxShadow="md"
                        transition="all 0.3s"
                    >
                        <GiConversation
                            size={80}
                            color={colorMode === "light" ? "gray.400" : "gray.500"}
                        />
                        <Text
                            fontSize="lg"
                            color={colorMode === "light" ? "gray.600" : "gray.300"}
                            mt={4}
                            textAlign="center"
                        >
                            Select a conversation to start messaging
                        </Text>
                    </Flex>
                )}

                {selectedConversation._id && (
                    <Box flex={70} position="relative" borderRadius="xl" overflow="hidden" boxShadow="md">
                        <IconButton
                            icon={<CloseIcon />}
                            size="sm"
                            position="absolute"
                            top={3}
                            right={3}
                            onClick={handleCloseChat}
                            aria-label="Close chat"
                            bg={colorMode === "light" ? "gray.200" : "gray.600"}
                            color={colorMode === "light" ? "gray.700" : "gray.200"}
                            borderRadius="full"
                            _hover={{ bg: colorMode === "light" ? "gray.300" : "gray.500", transform: "scale(1.1)" }}
                            transition="all 0.2s"
                            zIndex={1}
                        />
                        <MessageContainer />
                    </Box>
                )}
            </Flex>
        </Box>
    );
};

export default ChatPage;