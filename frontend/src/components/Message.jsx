import { Avatar, Box, Flex, Image, Skeleton, Text, Modal, ModalOverlay, ModalContent, ModalBody, IconButton, ModalCloseButton } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";

import { BsCheck2All, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useState } from "react";
import { selectedConversationAtom } from "../../atoms/messagesAtom";
import userAtom from "../../atoms/userAtom";

const Message = ({ ownMessage, message, messages }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter messages to only include those with images
  const imageMessages = messages.filter((m) => m.img);

  const handleImageClick = (imgUrl) => {
    setPreviewImage(imgUrl);
    const index = imageMessages.findIndex((m) => m.img === imgUrl);
    setCurrentIndex(index);
    console.log("Opening image at index:", index, "URL:", imgUrl);
  };

  const handleClosePreview = () => {
    console.log("Closing preview modal");
    setPreviewImage(null);
    setCurrentIndex(0);
  };

  const handleNext = () => {
    if (imageMessages.length === 0) {
      console.log("No images to navigate to");
      return;
    }
    const nextIndex = (currentIndex + 1) % imageMessages.length;
    setCurrentIndex(nextIndex);
    const nextImage = imageMessages[nextIndex]?.img;
    setPreviewImage(nextImage || null);
    console.log("Navigating to next image. Index:", nextIndex, "URL:", nextImage);
  };

  const handlePrev = () => {
    if (imageMessages.length === 0) {
      console.log("No images to navigate to");
      return;
    }
    const prevIndex = (currentIndex - 1 + imageMessages.length) % imageMessages.length;
    setCurrentIndex(prevIndex);
    const prevImage = imageMessages[prevIndex]?.img;
    setPreviewImage(prevImage || null);
    console.log("Navigating to previous image. Index:", prevIndex, "URL:", prevImage);
  };

  return (
    <>
      {ownMessage ? (
        <Flex gap={2} alignSelf="flex-end">
          {message.text && (
            <Flex bg="green.800" maxW="350px" p={1} borderRadius="md">
              <Text color="white">{message.text}</Text>
              <Box
                alignSelf="flex-end"
                ml={1}
                color={message.seen ? "blue.400" : ""}
                fontWeight="bold"
              >
                <BsCheck2All size={16} />
              </Box>
            </Flex>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w="200px">
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
              mt={5}
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
          <Avatar src={user.profilePic} w="7" h={7} />
        </Flex>
      ) : (
        <Flex gap={2}>
          <Avatar src={selectedConversation.userProfilePic} w="7" h={7} />
          {message.text && (
            <Text maxW="350px" bg="gray.400" p={1} borderRadius="md" color="black">
              {message.text}
            </Text>
          )}
          {message.img && !imgLoaded && (
            <Flex mt={5} w="200px">
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
              mt={5}
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
      )}

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
          <ModalBody p={0} display="flex" justifyContent="center" alignItems="center" height="100vh">
            {imageMessages.length > 1 && (
              <IconButton
                aria-label="Previous image"
                icon={<BsArrowLeft />}
                onClick={handlePrev}
                position="absolute"
                left="20px"
                top="50%"
                transform="translateY(-50%)"
                color="white"
                bg="rgba(0, 0, 0, 0.5)"
                _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
                zIndex={10}
              />
            )}
            <Image
              src={previewImage}
              alt="Full-screen preview"
              maxW="90vw"
              maxH="90vh"
              objectFit="contain"
              borderRadius="md"
            />
            {imageMessages.length > 1 && (
              <IconButton
                aria-label="Next image"
                icon={<BsArrowRight />}
                onClick={handleNext}
                position="absolute"
                right="20px"
                top="50%"
                transform="translateY(-50%)"
                color="white"
                bg="rgba(0, 0, 0, 0.5)"
                _hover={{ bg: "rgba(0, 0, 0, 0.7)" }}
                zIndex={10}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Message;