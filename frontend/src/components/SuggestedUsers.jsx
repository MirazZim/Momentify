import { Box, Flex, Skeleton, SkeletonCircle, Text, VStack, Divider, Button } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast';
import SuggestedUser from './SuggestedUser';
import { useNavigate } from 'react-router-dom';

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const showToast = useShowToast();
    const navigate = useNavigate();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/users/suggested");
                const data = await res.json();
                if (data.error) {
                    showToast("Error", data.error, "error");
                    return;
                }
                setSuggestedUsers(data);
            } catch (error) {
                showToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };

        getSuggestedUsers();
    }, [showToast]);

    return (
        <VStack
            spacing={4}
            align="stretch"
            bg="white"
            p={4}
            borderRadius="xl"
            boxShadow="md"
            maxW="400px"
            mx="auto"
            transition="all 0.3s"
            _hover={{ boxShadow: "lg" }}
        >
            <Text
                fontSize="lg"
                fontWeight="bold"
                color="gray.800"
                textAlign="center"
                bgGradient="linear(to-r, blue.500, purple.500)"
                bgClip="text"
            >
                Suggested Connections
            </Text>
            <Divider borderColor="gray.200" />
            <Flex direction="column" gap={3}>
                {!loading && suggestedUsers.map((user) => (
                    <SuggestedUser 
                        key={user._id} 
                        user={user} 
                        _hover={{ bg: "gray.50", transform: "translateX(4px)" }}
                        transition="all 0.2s"
                        borderRadius="md"
                        p={2}
                    />
                ))}
                {loading && [0, 1, 2, 3, 4].map((_, idx) => (
                    <Flex
                        key={idx}
                        gap={3}
                        alignItems="center"
                        p={3}
                        borderRadius="md"
                        bg="gray.50"
                        _hover={{ bg: "gray.100" }}
                        transition="all 0.2s"
                    >
                        <SkeletonCircle size="12" speed={0.8} />
                        <Flex w="full" flexDirection="column" gap={2}>
                            <Skeleton h="10px" w="100px" speed={0.8} />
                            <Skeleton h="8px" w="120px" speed={0.8} />
                        </Flex>
                        <Skeleton h="28px" w="70px" borderRadius="full" speed={0.8} />
                    </Flex>
                ))}
            </Flex>
            {!loading && suggestedUsers.length === 0 && (
                <Text color="gray.500" textAlign="center" fontSize="sm">
                    No suggestions available
                </Text>
            )}
             <Divider borderColor="gray.200" />
             <Button
                    variant="link"
                    color="blue.500"
                    fontSize="sm"
                    fontWeight="medium"
                    _hover={{ color: "blue.600", textDecoration: "underline" }}
                    onClick={() => navigate("/users/all")}
                >
                    See All Users
                </Button>
        </VStack>
    )
}

export default SuggestedUsers