import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Conversations from '../components/Conversations'
import MessageContainer from '../components/MessageContainer'
import useShowToast from '../hooks/useShowToast.js'
import { useRecoilState } from 'recoil'
import { conversationsAtom, selectedConversationAtom } from '../../atoms/messagesAtom.js'
import { GiConversation } from 'react-icons/gi'

const ChatPage = () => {
    const showToast = useShowToast();
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [conversations, setConversations] = useRecoilState(conversationsAtom);
    const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);



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

            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoadingConversations(false);
            }
        };

        getConversations();
    }, [showToast, setConversations]);


    return (
        <Box
            position={"absolute"}
            left={"50%"}
            w={{
                lg: "750px",
                md: "80%",
                base: "100%"
            }}
            p={4}
            border={"1px solid red"}
            transform={"translateX(-50%)"}>

            <Flex
                gap={4}
                flexDirection={{
                    base: "column",
                    md: "row"
                }}
                maxW={{
                    sm: "400px",
                    md: "full",
                }}

                mx={"auto"}

            >

                <Flex
                    flex={30}
                    gap={2}
                    flexDirection={"column"}
                    maxW={{
                        sm: "250px",
                        md: "full",
                    }}
                    mx={"auto"}
                >
                    <Text fontWeight={700} color={useColorMode["gray.600", "gray.400"]}>Your Conversations</Text>
                    <form>
                        <Flex alignItems={"center"} gap={2}>
                            <Input placeholder='Search For a User' />
                            <Button size={"sm"}>
                                <SearchIcon />
                            </Button>

                        </Flex>

                    </form>
                    {loadingConversations && (
                        [0, 1, 2, 3, 4, 5].map((_, i) => (
                            <Flex
                                p={1}
                                borderRadius={"md"}
                                gap={4}
                                alignItems={"center"}
                                key={i}>
                                <Box>
                                    <SkeletonCircle size={10} />
                                </Box>
                                <Flex w={"full"}
                                    flexDirection={"column"}
                                    gap={3}>
                                    <Skeleton height={"10px"} w={"80px"} />
                                    <Skeleton height={"8px"} w={"90%"} />
                                </Flex>
                            </Flex>
                        ))
                    )}

                    {!loadingConversations && (
                        conversations.map((conversation) => (
                            <Conversations key={conversation._id} conversation={conversation} />
                        ))
                    )}
                </Flex>


                {!selectedConversation._id && (
                    <Flex
                        flex={70}
                        borderRadius={"md"}
                        p={2}
                        flexDir={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        height={"400px"}
                    >
                        <GiConversation size={100} />
                        <Text fontSize={20}>Select a conversation to start messaging</Text>
                    </Flex>

                )}



                {selectedConversation._id && (
                    <MessageContainer />
                )}


            </Flex>



        </Box>
    )
}


export default ChatPage