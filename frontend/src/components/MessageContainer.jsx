import { Avatar, Divider, Flex, Image, Skeleton, SkeletonCircle, Text, useColorModeValue } from "@chakra-ui/react"


const MessageContainer = () => {
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
                <Avatar size={"sm"} />
                <Text display={"flex"} alignItems={"center"}>
                    Miraz <Image src='/verified.png' w={4} h={4} ml={1} />
                </Text>
            </Flex>

            <Divider />

            <Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>

                {true &&
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

            </Flex>

        </Flex>
    )
}


export default MessageContainer