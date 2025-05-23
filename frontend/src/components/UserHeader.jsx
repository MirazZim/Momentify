import { Avatar, Box, Button, Flex, Link, Menu, MenuButton, MenuItem, MenuList, Portal, Text, useToast, VStack } from "@chakra-ui/react"
import { BsInstagram } from "react-icons/bs"
import { CgMoreO } from "react-icons/cg"
import { useRecoilValue } from "recoil"
import userAtom from "../atoms/userAtom.js"
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow.js"



const UserHeader = ({ user }) => {
    const toast = useToast()

    const currentUser = useRecoilValue(userAtom); //this is the user that logged in

    const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

    const copyURL = () => {
        const currentURL = window.location.href;
       // console.log("Copying URL:", currentURL);  // Debugging log

        /* function of Copying in clipBoard */
        navigator.clipboard.writeText(currentURL).then(() => {
            toast({
                title: "Success.",
                status: "success",
                description: "Profile link copied.",
                duration: 3000,
                isClosable: true,
            });
        }).catch(err => {
           // console.error("Clipboard error:", err);  // Debugging error
        });
    };

    return (
        <VStack gap={4} alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {user.name}
                    </Text>

                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>

                            Momentify.net
                        </Text>
                    </Flex>
                </Box>

                <Box>
                    {user.profilePic && <Avatar name={user.name} src={user.profilePic} size={{
                        base: "md",
                        md: "xl",
                    }} />}
                    {!user.profilePic && <Avatar name={user.name}
                        src="/avatar.png"
                        size={{
                            base: "md",
                            md: "xl",
                        }} />}
                </Box>
            </Flex>

            <Text>{user.bio}</Text>

            {currentUser?._id === user._id && (
                <Link as={RouterLink} to='/update'>
                    <Button size={"sm"} colorScheme="blue">Update Profile</Button>
                </Link>
            )}

            {currentUser?._id !== user._id && (
                <Button colorScheme="blue" size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
                    {following ? "Unfollow" : "Follow"}
                </Button>
            )}

            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} Followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>Instagram.com</Link>
                </Flex>

                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={"pointer"} />
                    </Box>

                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"} />
                            </MenuButton>
                            <Portal>
                                <MenuList >
                                    <MenuItem bg={"gray.dark : gray.light"}  onClick={copyURL}>
                                        Copy link
                                    </MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>


            <Flex w={"full"}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} pb='3' cursor={"pointer"}>
                    <Text fontWeight={"bold"}> NewsFeed</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={"1px solid gray"}
                    justifyContent={"center"}
                    color={"gray.light"}
                    pb='3'
                    cursor={"pointer"}
                >
                    <Text fontWeight={"bold"}> Replies to your Post</Text>
                </Flex>
            </Flex>
        </VStack>
    )
}

export default UserHeader;
