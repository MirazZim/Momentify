import { Avatar, Box, Button, Divider, Flex, Image, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import { useState } from "react";


const PostPage = () => {
  const [liked, setLiked] = useState(false);
  return (
    <>

      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar name="Mark Zuck" src="/zuck-avatar.png" size="md" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>markzuck</Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
            1d ago
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>Lets Talk About Threads.</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={"/post1.png"} w={"full"} />
      </Box>


      <Flex gap={3} my={3}>
				<Actions liked={liked} setLiked={setLiked} />
			</Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
			</Flex>





    </>
  )
}

export default PostPage