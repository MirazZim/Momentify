import { Flex, Input, InputGroup, InputRightElement, IconButton, Spinner, ModalHeader } from "@chakra-ui/react";
import { BsFillImageFill } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Image, Button } from "@chakra-ui/react";
import { useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { conversationsAtom, selectedConversationAtom } from "../../atoms/messagesAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import { useColorModeValue } from "@chakra-ui/react";

const MessageInput = ({ setMessages }) => {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imageRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText && !imgUrl) return;
    if (isSending) return;

    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: {
                text: messageText || "Image",
                sender: data.sender,
              },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });

      setMessageText("");
      setImgUrl("");
      onClose();
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Flex
      gap={2}
      alignItems="center"
      p={1}
      bg={bgColor}
      borderRadius="xl"
      
      borderColor={borderColor}
      boxShadow="sm"
      _hover={{ boxShadow: "md" }}
      transition="all 0.2s"
    >
      <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup>
          <Input
            w="full"
            placeholder="Type a message"
            bg={useColorModeValue("gray.100", "gray.700")}
            border="none"
            borderRadius="full"
            py={2}
            px={4}
            fontSize="sm"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
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
              isLoading={isSending}
              onClick={handleSendMessage}
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
          onClick={() => imageRef.current.click()}
        />
        <Input
          type="file"
          accept="image/*"
          hidden
          ref={imageRef}
          onChange={(e) => {
            handleImageChange(e);
            if (e.target.files[0]) onOpen();
          }}
        />
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setImgUrl("");
          onClose();
        }}
        isCentered
      >
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
              {imgUrl && (
                <Image
                  src={imgUrl}
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
                onClick={() => {
                  setImgUrl("");
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="teal"
                isLoading={isSending}
                onClick={handleSendMessage}
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