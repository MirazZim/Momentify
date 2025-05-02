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

  // Determine if the conversation is unseen
  const isUnseen = currentUser._id !== lastMessage.sender && !lastMessage.seen && selectedConversation?._id !== conversation._id;

  // Function to mark the conversation as seen
  const markAsSeen = async () => {
    try {
      const response = await fetch(`/api/conversations/${conversation._id}/mark-as-seen`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error('Failed to mark conversation as seen');
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
        bg: useColorModeValue('gray.600', 'gray.dark'),
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
          markAsSeen(); // Mark the conversation as seen when opened
        }
      }}
      bg={
        selectedConversation?._id === conversation._id
          ? useColorMode().colorMode === 'light'
            ? 'gray.400'
            : 'gray.dark'
          : isUnseen
            ? useColorMode().colorMode === 'light'
              ? 'gray.200'
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
        <Text
          fontWeight={isUnseen ? '700' : '500'} // Bold for unseen conversations
          display={'flex'}
          alignItems={'center'}
        >
          {user.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
          {/* // Blue dot for unseen conversations */}
          {isUnseen && (
            <Box
              ml={2}
              w={2}
              h={2}
              borderRadius="full"
              bg="blue.500"
            />
          )}
        </Text>
        <Text
          fontSize={'xs'}
          display={'flex'}
          alignItems={'center'}
          gap={1}
          fontWeight={isUnseen ? '600' : 'normal'} // Bold last message for unseen
        >
          {currentUser._id === lastMessage.sender ? (
            <Box color={lastMessage.seen ? 'blue.400' : ''}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ''
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