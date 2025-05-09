'use client'

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useSetRecoilState } from 'recoil'
import authScreenAtom from '../atoms/authAtom.js'
import useShowToast from '../hooks/useShowToast.js'
import userAtom from '../atoms/userAtom.js'

const Login = () => {
    const [showPassword, setShowPassword] = useState(false)
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const setUser = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false);

    const showToast = useShowToast();

    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });


   

    const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (data.message) {
            showToast("Error", data.message, "error");
            return;
			}

            showToast("Login Successful", "You have successfully logged in.", "success");
			localStorage.setItem("user-threads", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

    return (
        <Flex

            align={'center'}
            justify={'center'}
        >
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'} textAlign={'center'}>
                        Login
                    </Heading>

                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.dark')}
                    boxShadow={'lg'}
                    p={8}
                    w={{
                        base: "full",
                        sm: '400px',
                        md: '480px'
                    }}
                >
                    <Stack spacing={4}>
                        <FormControl isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input type="email" value={inputs.email} onChange={(e) => setInputs({ ...inputs, email: e.target.value })} />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input type={showPassword ? 'text' : 'password'} value={inputs.password} onChange={(e) => setInputs({ ...inputs, password: e.target.value })} />
                                <InputRightElement h={'full'}>
                                    <Button
                                        variant={'ghost'}
                                        onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Logging in..."
                                size="lg"
                                bg={useColorModeValue('gray.600', 'gray.700')}
                                color={'white'}
                                _hover={{
                                    bg: useColorModeValue('gray.700', 'gray.800')
                                }}
                                onClick={handleLogin}
                                isLoading={loading}
                            >
                                Login
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={'center'}>
                                Dont have an account? <Link onClick={() => { setAuthScreen("signup") }} color={'blue.400'}>Sign Up</Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    )
}

export default Login