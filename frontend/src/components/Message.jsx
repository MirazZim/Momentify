import {
  Avatar,
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Button,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { BsCheck2All, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useState } from "react";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";
import { Smile } from "react-feather";
import { useSocket } from "../../context/SocketContext";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageClick = (imgUrl) => {
    setPreviewImage(imgUrl);
  };

  const handleClosePreview = () => {
    setPreviewImage(null);
  };

  const handleReaction = async (emoji) => {
    try {
      const response = await fetch("/api/messages/reactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          messageId: message._id,
          emoji,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add reaction");
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const renderReceivedMessage = () => (
    <Flex align="center" position="relative" _hover={{ "& .reaction-button": { opacity: 1 } }}>
      <Avatar src={selectedConversation.userProfilePic} w="8" h="8" flexShrink={0} mr={2} />
      <Flex direction="column" position="relative">
        <Flex
          bg="gray.400"
          p={3}
          borderRadius="lg"
          maxW="350px"
          position="relative"
        >
          {message.text && (
            <Text color="black" wordBreak="break-word">
              {message.text}
            </Text>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={2} w="200px">
              <Image
                src={message.img}
                hidden
                onLoad={() => setImgLoaded(true)}
                alt="Message image"
                borderRadius={4}
              />
              <Skeleton w="200px" h="200px" />
            </Flex>
          )}
          {message.img && imgLoaded && (
            <Flex
              mt={2}
              w="200px"
              position="relative"
              onClick={() => handleImageClick(message.img)}
              cursor="pointer"
            >
              <Image
                src={message.img}
                alt="Message image"
                borderRadius={4}
                objectFit="contain"
              />
            </Flex>
          )}
        </Flex>
        {message.reactions?.length > 0 && (
          <Box
            position="absolute"
            bottom="0"
            right="-2"
            transform="translateY(50%)"
            bg="gray.300"
            borderRadius="md"
            zIndex={2}
          >
            <Flex gap={1}>
              {message.reactions.map((reaction, index) => (
                <Text key={index} fontSize="sm">
                  {reaction.emoji}
                </Text>
              ))}
            </Flex>
          </Box>
        )}
      </Flex>
      <Box
        className="reaction-button"
        opacity={0}
        transition="opacity 0.2s"
        ml={4}
      >
        <Popover placement="top" isLazy>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="ghost"
              p={1}
              minW="auto"
              h="auto"
              borderRadius="full"
              bg="white"
              boxShadow="md"
            >
              <Smile size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent width="auto">
            <PopoverBody>
              <Flex gap={1}>
                {["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (
                  <Box
                    key={emoji}
                    cursor="pointer"
                    fontSize="xl"
                    onClick={() => handleReaction(emoji)}
                    _hover={{ transform: "scale(1.2)" }}
                    transition="transform 0.2s"
                  >
                    {emoji}
                  </Box>
                ))}
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    </Flex>
  );

  const renderSentMessage = () => (
    <Flex gap={2} alignSelf="flex-end">
      <Flex direction="column" position="relative">
        <Flex bg="green.800" maxW="350px" p={3} borderRadius="lg">
          {message.text && (
            <Text color="white">{message.text}</Text>
          )}
          <Box
            alignSelf="flex-end"
            ml={1}
            color={message.seen ? "blue.400" : ""}
            fontWeight="bold"
          >
            <BsCheck2All size={16} />
          </Box>
        </Flex>
        {message.img && !imgLoaded && (
          <Flex mt={2} w="200px">
            <Image
              src={message.img}
              hidden
              onLoad={() => setImgLoaded(true)}
              alt="Message image"
              borderRadius={4}
            />
            <Skeleton w="200px" h="200px" />
          </Flex>
        )}
        {message.img && imgLoaded && (
          <Flex
            mt={2}
            w="200px"
            position="relative"
            onClick={() => handleImageClick(message.img)}
            cursor="pointer"
          >
            <Image
              src={message.img}
              alt="Message image"
              borderRadius={4}
              objectFit="contain"
            />
            <Box
              position="absolute"
              bottom="5px"
              right="5px"
              color={message.seen ? "blue.400" : ""}
              fontWeight="bold"
            >
              <BsCheck2All size={16} />
            </Box>
          </Flex>
        )}
        {message.reactions?.length > 0 && (
          <Box
            position="absolute"
            bottom="0"
            right="0"
            transform="translateY(50%)"
            bg="green.700"
            borderRadius="md"
            zIndex={1}
          >
            <Flex gap={1}>
              {message.reactions.map((reaction, index) => (
                <Text key={index} fontSize="sm" color="white">
                  {reaction.emoji}
                </Text>
              ))}
            </Flex>
          </Box>
        )}
      </Flex>
      <Avatar src={user.profilePic} w="8" h="8" />
    </Flex>
  );

  return (
    <>
      {ownMessage ? renderSentMessage() : renderReceivedMessage()}

      {/* Image preview modal */}
      <Modal isOpen={!!previewImage} onClose={handleClosePreview} isCentered size="full">
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton
            color="white"
            bg="rgba(0, 0, 0, 0.5)"
            _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
            position="absolute"
            top="20px"
            right="20px"
            zIndex={10}
          />
          <ModalBody
            p={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          >
            <Image
              src={previewImage}
              alt="Full-screen preview"
              maxW="90vw"
              maxH="90vh"
              objectFit="contain"
              borderRadius="md"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Message;