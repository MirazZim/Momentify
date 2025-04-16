import { Avatar, Box, Divider, Flex, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useState } from "react";

const Comment = ({comments}) => {

    const [liked, setLiked] = useState(false);
	return (
		<>
			<Flex gap={4} py={2} my={2} w={"full"}>
				<Avatar src={"/zuck-avatar.png"} size={"sm"} />
				<Flex gap={1} w={"full"} flexDirection={"column"}>
					<Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
						<Text fontSize='sm' fontWeight='bold'>
							Mark ZuckerBurg
						</Text>
                        <Flex gap={2} alignItems={"center"}>
                            <Text fontSize='sm' color={"gray.light"}>1d ago</Text>
                        
                            <BsThreeDots />
                        
                        
                        </Flex>
					</Flex>
					<Text>
                        {comments}
                    </Text>
                    <Actions liked={liked} setLiked={setLiked} />
                    <Flex gap={3} alignItems={"center"}>
                            <Text color={"gray.light"} fontSize={"sm"}>
                               {/* Setted a state here if any user like it increaments 1 or else 0 */}
                               {(liked ? 1 : 0)} likes
                            </Text>
                          </Flex>
				</Flex>
			</Flex>
            <Divider color={"gray.light"} my={4} />
			
		</>
	);
};

export default Comment;