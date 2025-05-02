import { Avatar, Box, Flex, Text } from "@chakra-ui/react"
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";


const Message = ({ ownMessage, message }) => {
    const selectedConversation = useRecoilValue(selectedConversationAtom);
    const user = useRecoilValue(userAtom);
    return (
        <>
            {
                ownMessage ? (
                    <Flex
                        justifyContent="flex-end"
                        w="full"
                        mb={2}
                        position="relative"
                    >
                        <Flex
                            maxW="65%"
                            bg="#e1ffc7"
                            p={3}
                            borderRadius="14px"
                            boxShadow="0 1px 1px rgba(0, 0, 0, 0.08)"
                            position="relative"
                            _before={{
                                content: '""',
                                position: 'absolute',
                                right: '-7px',
                                top: '8px',
                                borderWidth: '0 0 15px 15px',
                                borderColor: 'transparent transparent transparent #e1ffc7',
                                transform: 'rotate(0deg)',
                                filter: 'drop-shadow(1px 0 0 rgba(0, 0, 0, 0.04))'
                            }}
                        >
                            <Flex direction="column" w="full">
                                <Text
                                    color="#303030"
                                    fontSize="15px"
                                    fontWeight="450"
                                    lineHeight="20px"
                                    letterSpacing="0.1px"
                                    wordBreak="break-word"
                                    pr={2}
                                >
                                    {message.text}
                                </Text>

                                <Box
                                    alignSelf="flex-end"
                                    color={message.seen ? "#53bdeb" : "#a8abb3"}
                                    mt={1}
                                >
                                    <BsCheck2All size={14} />
                                </Box>
                            </Flex>
                        </Flex>
                    </Flex>

                )
                    : (
                        <Flex gap={2}
                        >
                            <Avatar src={selectedConversation.userProfilePic} w={7} h={7} />
                            <Text maxW={"350px"} bg={"gray.400"} p={1} borderRadius={"md"} color={"black"}>
                                {message.text}
                            </Text>

                        </Flex>
                    )
            }



        </>
    )
}



export default Message