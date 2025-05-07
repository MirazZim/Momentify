import { Button, Flex, Image, Link, useColorMode, IconButton, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import userAtom from "../../atoms/userAtom.js"
import { Link as RouterLink } from "react-router-dom"
import { AiFillHome, AiOutlineUser } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { LuLogOut, LuMenu } from "react-icons/lu"
import useLogout from "../hooks/useLogout.js"
import authScreenAtom from "../../atoms/authAtom.js"
import { BsFillChatQuoteFill, BsPeople } from "react-icons/bs"

const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode()
    const user = useRecoilValue(userAtom)
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    
    return (
        <Flex justifyContent={"space-between"} mt={6} mb={12} alignItems="center">

            {/* Left side */}
            <Flex alignItems="center" gap={4}>
                {user && (
                    <Link as={RouterLink} to="/" >
                        <AiFillHome size={24} />
                    </Link>
                )}
                {!user && (
                    <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen('login')} >
                        Login
                    </Link>
                )}
            </Flex>

            {/* Center - Logo */}
            <Image
                cursor={"pointer"}
                alt="logo"
                w={7}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                onClick={toggleColorMode}
            />

            {/* Right side */}
            <Flex alignItems={"center"} gap={4}>
                {user && (
                    <>
                        {/* Mobile menu */}
                        <Menu>
                            <MenuButton 
                                as={IconButton}
                                icon={<LuMenu />}
                                variant="ghost"
                                display={{ base: "block", md: "none" }}
                            />
                            <MenuList>
                                <MenuItem icon={<AiOutlineUser />} as={RouterLink} to={`/${user.username}`}>
                                    Profile
                                </MenuItem>
                                <MenuItem icon={<BsFillChatQuoteFill />} as={RouterLink} to="/chat">
                                    Messenger
                                </MenuItem>
                                <MenuItem icon={<BsPeople />} as={RouterLink} to="/users/all">
                                    Connections
                                </MenuItem>
                                <MenuItem icon={<LuLogOut />} onClick={logout}>
                                    Logout
                                </MenuItem>
                            </MenuList>
                        </Menu>

                        {/* Desktop icons */}
                        <Link as={RouterLink} to={`/${user.username}`} display={{ base: "none", md: "block" }}>
                            <RxAvatar size={24} />
                        </Link>
                        <Link as={RouterLink} to="/chat" display={{ base: "none", md: "block" }}>
                            <BsFillChatQuoteFill size={20} />
                        </Link>
                        <Button
                            size={"xs"}
                            onClick={logout}
                            display={{ base: "none", md: "block" }}
                        >
                            <LuLogOut size={20} />
                        </Button>
                    </>
                )}
                {!user && (
                    <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen('Sign Up')} >
                        Sign Up
                    </Link>
                )}
            </Flex>
        </Flex>
    )
}

export default Header