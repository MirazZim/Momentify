import { useEffect, useState } from 'react';
import { 
    Box, 
    Container, 
    VStack, 
    Text, 
    Flex, 
    Skeleton, 
    SkeletonCircle, 
    Divider,
    Input,
    InputGroup,
    InputLeftElement,
    Icon,
    SimpleGrid,
    useColorModeValue
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import SuggestedUser from './SuggestedUser';

const AllUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const showToast = useShowToast();
    const navigate = useNavigate();

    // Color mode values
    const cardBg = useColorModeValue('white', 'gray.800');
    const hoverBg = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const textColor = useColorModeValue('gray.600', 'gray.400');

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const res = await fetch('/api/users/all');
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setUsers(data);
                setFilteredUsers(data);
            } catch (error) {
                showToast('Error', error.message, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, [showToast]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredUsers(users);
        } else {
            const filtered = users.filter(user => 
                user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    return (
        <Container maxW="container.lg" py={8}>
            <Box
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="xl"
                p={6}
                borderWidth="1px"
                borderColor={borderColor}
            >
                <Flex justifyContent="space-between" alignItems="center" mb={8}>
                    <Text 
                        fontSize="3xl" 
                        fontWeight="extrabold"
                        bgGradient="linear(to-r, blue.400, purple.600)"
                        bgClip="text"
                        letterSpacing="tight"
                    >
                        Discover Connections
                    </Text>
                    <Box w={{ base: 'full', md: '300px' }}>
                        <InputGroup>
                            <InputLeftElement pointerEvents="none">
                                <Icon as={FiSearch} color="gray.400" />
                            </InputLeftElement>
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                borderRadius="full"
                                focusBorderColor="purple.500"
                                variant="filled"
                            />
                        </InputGroup>
                    </Box>
                </Flex>

                <Divider mb={8} borderColor={borderColor} />

                {loading ? (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {[...Array(8)].map((_, idx) => (
                            <Flex 
                                key={idx} 
                                gap={4} 
                                alignItems="center" 
                                p={4}
                                borderRadius="lg"
                                bg={hoverBg}
                            >
                                <SkeletonCircle size="12" />
                                <Flex direction="column" gap={2} flex={1}>
                                    <Skeleton height="15px" width="150px" />
                                    <Skeleton height="12px" width="200px" />
                                </Flex>
                                <Skeleton height="32px" width="85px" borderRadius="full" />
                            </Flex>
                        ))}
                    </SimpleGrid>
                ) : filteredUsers.length === 0 ? (
                    <Box textAlign="center" py={12}>
                        <Text fontSize="xl" color={textColor} mb={2}>
                            {searchQuery ? 'No users found' : 'No users to discover'}
                        </Text>
                        {searchQuery && (
                            <Text color={textColor}>
                                Try a different search term
                            </Text>
                        )}
                    </Box>
                ) : (
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        {filteredUsers.map((user) => (
                            <Box
                                key={user._id}
                                p={4}
                                borderRadius="lg"
                                borderWidth="1px"
                                borderColor={borderColor}
                                _hover={{
                                    bg: hoverBg,
                                    transform: 'translateY(-2px)',
                                    boxShadow: 'md',
                                }}
                                transition="all 0.2s ease"
                            >
                                <SuggestedUser 
                                    user={user}
                                />
                            </Box>
                        ))}
                    </SimpleGrid>
                )}
            </Box>
        </Container>
    );
};

export default AllUsersPage;