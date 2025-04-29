import { Avatar, AvatarBadge, Box, Flex, Image, Stack, Text, useColorMode, useColorModeValue, WrapItem } from '@chakra-ui/react'
import React from 'react'
import { BsCheck2All, BsFillImageFill } from 'react-icons/bs'

const Conversations = () => {
  return (
    <Flex
      gap={2}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        bg: useColorModeValue("gray.600", "gray.dark"),
        color: "white",
        borderRadius: "md"
      }}
    >
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
        >
          <AvatarBadge
            boxSize='1em'
            bg='green.500'
          />
        </Avatar>
      </WrapItem>

      <Stack direction={"column"} fontSize={"sm"}>
        <Text fontWeight='700' display={"flex"} alignItems={"center"}>
          Miraz
          <Image src='/verified.png' w={4} h={4} ml={1} />
        </Text>
        <Text fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          Hello Makalele
        </Text>
      </Stack>
    </Flex>
  )
}

export default Conversations
