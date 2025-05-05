import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react';
import React from 'react';
import { BsCheck2All, BsFillFileImageFill } from 'react-icons/bs';
import { useRecoilState, useRecoilValue } from 'recoil';
import userAtom from '../../atoms/userAtom.js';
import { selectedConversationAtom } from '../../atoms/messagesAtom.js';

const Conversations = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

  // Get color mode once at the top level
  const { colorMode } = useColorMode();
  // Get all color values unconditionally
  const hoverBg = useColorModeValue('gray.600', 'gray.dark');
  const selectedBgLight = useColorModeValue('gray.400', 'gray.dark');
  const unseenBgLight = useColorModeValue('gray.200', 'gray.700');

  // Determine if the conversation is unseen
  const isUnseen = currentUser._id !== lastMessage.sender && !lastMessage.seen && selectedConversation?._id !== conversation._id;

  // Function to mark the conversation as seen
  const markAsSeen = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversation._id}/mark-as-seen`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        // Update local conversation state
        setConversations(prev => prev.map(conv => {
          if (conv._id === conversation._id) {
            return {
              ...conv,
              lastMessage: { ...conv.lastMessage, seen: true }
            };
          }
          return conv;
        }));
      }
    } catch (error) {
      console.error('Error marking conversation as seen:', error);
    }
  };

  return (
    <Flex
      gap={2}
      alignItems={'center'}
      p={'1'}
      _hover={{
        cursor: 'pointer',
        bg: hoverBg,
        color: 'white',
      }}
      borderRadius="md"
      onClick={() => {
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
        });
        if (isUnseen) {
          markAsSeen();
        }
      }}
      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === 'light'
            ? selectedBgLight
            : 'gray.dark'
          : isUnseen
            ? colorMode === 'light'
              ? unseenBgLight
              : 'gray.700'
            : ''
      }
    >
      <WrapItem>
        <Avatar
          size={{
            base: 'xs',
            sm: 'sm',
            md: 'md',
          }}
          src={user.profilePic}
        >
          {isOnline ? <AvatarBadge boxSize={'1em'} bg="green.500" /> : ''}
        </Avatar>
      </WrapItem>

      <Stack direction={'column'} fontSize={'sm'}>
        {/* Username line remains the same */}
        <Text fontWeight={isUnseen ? '700' : '500'} display={'flex'} alignItems={'center'} as="span">
          {user.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
          {isUnseen && <Box ml={2} w={2} h={2} borderRadius="full" bg="blue.500" />}
        </Text>

        {/* Updated last message line */}
        <Text fontSize={'xs'} display={'flex'} alignItems={'center'} gap={1}>
          {currentUser._id === lastMessage.sender && (
            <>
              <Box color={lastMessage.seen ? 'blue.400' : 'gray.400'}>
                <BsCheck2All size={16} />
              </Box>
              <Text as="span">You: </Text>
            </>
          )}
          {lastMessage.text.length > 18
            ? lastMessage.text.substring(0, 18) + '...'
            : lastMessage.text || <BsFillFileImageFill size={16} />}
        </Text>
      </Stack>
    </Flex>
  );
};

export default Conversations;