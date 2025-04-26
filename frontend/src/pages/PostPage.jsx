import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text } from "@chakra-ui/react"
import { BsThreeDots } from "react-icons/bs"
import Actions from "../components/Actions"
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { useParams } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatDistanceToNow } from "date-fns";
import Swal from "sweetalert2";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../../atoms/postsAtom";
import userAtom from "../../atoms/userAtom";



const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [post, setPost] = useState(null);
  const showToast = useShowToast();
  const { pid } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPost(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPost(null);
      }
    };
    getPost();
  }, [])


   const handleDeletePost = async (e) => {
      e.preventDefault();
      Swal.fire({
        title: "Delete Post?",
        text: "This action is permanent!",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#ff5252",
        cancelButtonColor: "#3e8e41",
        confirmButtonText: "Delete",
        cancelButtonText: "Cancel"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const res = await fetch(`/api/posts/${post._id}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (data.error) {
              showToast("Error", data.error, "error");
              return;
            } 
            showToast("Success", "Post deleted", "success");
            setPosts(posts.filter((p) => p._id !== post._id));
          } catch (error) {
            showToast("Error", error.message, "error");
          }
        }
      });
    };

  if (!user && loading) {
    return (
      <Flex
        justifyContent="center"
        alignItems="center"

      >
        <Spinner
          size="xl"
          thickness="4px"
        />
      </Flex>
    )
  }

  if (!post) return null;


  return (
    <>

      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar name={user.username} src={user.profilePic} size="md" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>{user.username}</Text>
            <Image src="/verified.png" w={4} h={4} ml={1} />
          </Flex>
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"xs"} width={36} textAlign={"right"} color={"gray.light"}>
            {formatDistanceToNow(new Date(post.createdAt))} ago
          </Text>
          {currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}
        </Flex>
      </Flex>

      <Text my={3}>{post.text}</Text>

      {
        post.img && (
          <Box
            borderRadius={6}
            overflow={"hidden"}
            border={"1px solid"}
            borderColor={"gray.light"}
          >
            <Image src={post.img} w={"full"} />
          </Box>
        )
      }


      <Flex gap={3} my={3}>
        <Actions post={post} />
      </Flex>

      <Divider my={4} />


      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      {/* <Comment comments="Looks really good" /> */}





    </>
  )
}

export default PostPage