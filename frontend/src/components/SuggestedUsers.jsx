import { Box, Flex, Skeleton, SkeletonCircle, Text, VStack, Divider, Button, useColorMode } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import useShowToast from '../hooks/useShowToast'
import SuggestedUser from './SuggestedUser'

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true)
    const [suggestedUsers, setSuggestedUsers] = useState([])
    const showToast = useShowToast()
    const { colorMode } = useColorMode()

    const isDark = colorMode === "dark"
    const cardBg = isDark ? "gray.900" : "white"
    const textColor = isDark ? "white" : "gray.800"
    const secondaryTextColor = isDark ? "gray.400" : "gray.600"
    const borderColor = isDark ? "gray.700" : "gray.200"
    const gradientStart = isDark ? "blue.600" : "blue.500"
    const gradientEnd = isDark ? "purple.600" : "purple.500"
    const hoverBg = isDark ? "gray.800" : "gray.50"
    const hoverBgSkeleton = isDark ? "gray.800" : "gray.100"
    const buttonColor = isDark ? "blue.300" : "blue.500"
    const buttonHoverColor = isDark ? "blue.400" : "blue.600"

    useEffect(() => {
        const getSuggestedUsers = async () => {
            setLoading(true)
            try {
                const res = await fetch("/api/users/suggested")
                const data = await res.json()
                if (data.error) {
                    showToast("Error", data.error, "error")
                    return
                }
                setSuggestedUsers(data)
            } catch (error) {
                showToast("Error", error.message, "error")
            } finally {
                setLoading(false)
            }
        }

        getSuggestedUsers()
    }, [showToast])

    return (
        <VStack
            spacing={4}
            align="stretch"
            bg={cardBg}
            p={4}
            borderRadius="xl"
            boxShadow={isDark ? "0 4px 20px rgba(0, 0, 0, 0.5)" : "0 4px 12px rgba(0, 0, 0, 0.1)"}
            maxW="400px"
            mx="auto"
            transition="all 0.3s"
            _hover={{ boxShadow: isDark ? "0 6px 24px rgba(0, 0, 0, 0.6)" : "0 6px 24px rgba(0, 0, 0, 0.2)" }}
        >
            <Text
                fontSize="lg"
                fontWeight="bold"
                color={textColor}
                textAlign="center"
                bgGradient={`linear(to-r, ${gradientStart}, ${gradientEnd})`}
                bgClip="text"
            >
                Suggested Connections
            </Text>
            <Divider borderColor={borderColor} />
            <Flex direction="column" gap={3}>
                {!loading &&
                    suggestedUsers.map((user) => (
                        <SuggestedUser
                            key={user._id}
                            user={user}
                            _hover={{ bg: hoverBg, transform: "translateX(4px)" }}
                            transition="all 0.2s"
                            borderRadius="md"
                            p={2}
                        />
                    ))}
                {loading &&
                    [0, 1, 2, 3, 4].map((_, idx) => (
                        <Flex
                            key={idx}
                            gap={3}
                            alignItems="center"
                            p={3}
                            borderRadius="md"
                            bg={hoverBg}
                            _hover={{ bg: hoverBgSkeleton }}
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
                <Text color={secondaryTextColor} textAlign="center" fontSize="sm">
                    No suggestions available
                </Text>
            )}
            <Divider borderColor={borderColor} />
            <Button
                variant="link"
                color={buttonColor}
                fontSize="sm"
                fontWeight="medium"
                _hover={{ color: buttonHoverColor, textDecoration: "underline" }}
                onClick={() => (window.location.href = "/users/all")}
            >
                See All Users
            </Button>
        </VStack>
    )
}

export default SuggestedUsers