import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Skeleton, SkeletonCircle, Text, useColorMode } from '@chakra-ui/react'
import React from 'react'
import Conversation from '../components/Conversations'
import Conversations from '../components/Conversations'

const ChatPage = () => {
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
                    {false && (
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

                    <Conversations/>
                    <Conversations/>
                    <Conversations/>
                    <Conversations/>
                </Flex>
                <Flex flex={70}>Message Containers</Flex>

            </Flex>



        </Box>
    )
}


export default ChatPage