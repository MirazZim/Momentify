import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react"
import { useRecoilValue, useSetRecoilState } from "recoil"
import userAtom from "../../atoms/userAtom.js"
import { Link as RouterLink } from "react-router-dom"
import { AiFillHome } from "react-icons/ai"
import { RxAvatar } from "react-icons/rx"
import { LuLogOut } from "react-icons/lu"
import useLogout from "../hooks/useLogout.js"
import authScreenAtom from "../../atoms/authAtom.js"


const Header = () => {
    const { colorMode, toggleColorMode } = useColorMode()

    const user = useRecoilValue(userAtom)
    const logout = useLogout();
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    return (
        <Flex justifyContent={"space-between"} mt={6} mb={12}>

            {
                user && (
                    <Link as={RouterLink} to="/" >
                        <AiFillHome size={24} />
                    </Link>
                )
            }
            {
                !user && (
                    <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen('login')} >
                        Login
                    </Link>
                )
            }

            <Image
                cursor={"pointer"}
                alt="logo"
                w={7}
                src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
                onClick={toggleColorMode}
            />


            {
                user && (
                    <Flex alignItems={"center"} gap={4}>
                        <Link as={RouterLink} to={`/${user.username}`} >
                            <RxAvatar size={24} />
                        </Link>

                        <Button

                            size={"xs"}

                            onClick={logout}


                        >
                            <LuLogOut size={20} />
                        </Button>
                    </Flex>
                )
            }

            {
                !user && (
                    <Link as={RouterLink} to={"/auth"} onClick={() => setAuthScreen('Sign Up')} >
                        Sign Up
                    </Link>
                )
            }
        </Flex>
    )
}



export default Header