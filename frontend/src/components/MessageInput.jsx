import { Flex, Input, InputGroup, InputRightElement, IconButton, useColorModeValue } from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Image, Button } from "@chakra-ui/react";
import { useState } from "react";

const MessageInput = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      onOpen();
    }
  };

  return (
    <Flex
      gap={2}
      alignItems="center"
      p={2}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
    >
      <form style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w="full"
            placeholder="Type a message"
            bg={useColorModeValue("gray.100", "gray.700")}
            border="none"
            borderRadius="full"
            py={2}
            px={4}
            _focus={{ boxShadow: "outline", bg: useColorModeValue("white", "gray.600") }}
            _hover={{ bg: useColorModeValue("gray.200", "gray.600") }}
          />
          <InputRightElement>
            <IconButton
              aria-label="Send message"
              icon={<IoSendSharp />}
              variant="ghost"
              colorScheme="teal"
              size="sm"
              borderRadius="full"
              _hover={{ bg: useColorModeValue("teal.100", "teal.900") }}
            />
          </InputRightElement>
        </InputGroup>
      </form>

      <Flex flex={5} alignItems="center">
        <IconButton
          aria-label="Upload image"
          icon={<BsFillImageFill size={20} />}
          variant="ghost"
          colorScheme="teal"
          size="sm"
          borderRadius="full"
          _hover={{ bg: useColorModeValue("teal.100", "teal.900") }}
          as="label"
        >
          <Input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
        </IconButton>
      </Flex>

      <Modal isOpen={isOpen} onClose={() => { setSelectedImage(null); onClose(); }} isCentered>
        <ModalOverlay bg="blackAlpha.600" />
        <ModalContent
          bg={bgColor}
          borderRadius="xl"
          overflow="hidden"
          maxW="lg"
          boxShadow="lg"
        >
          <ModalHeader fontSize="lg" fontWeight="bold">
            Preview Image
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4}>
            <Flex mt={2} w="full" justifyContent="center">
              {selectedImage && (
                <Image
                  src={selectedImage}
                  alt="Selected preview"
                  maxH="400px"
                  objectFit="contain"
                  borderRadius="md"
                  boxShadow="md"
                />
              )}
            </Flex>
            <Flex justifyContent="flex-end" my={4} gap={3}>
              <Button
                size="sm"
                variant="outline"
                colorScheme="gray"
                onClick={() => { setSelectedImage(null); onClose(); }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="teal"
                onClick={() => { /* Handle image send logic */ onClose(); }}
              >
                Send
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default MessageInput;