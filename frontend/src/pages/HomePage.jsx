import { useRecoilValue } from "recoil";
 // adjust path if needed
import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import userAtom from "../../atoms/userAtom.js";

const HomePage = () => {
    const currentUser = useRecoilValue(userAtom);

    return (
        <div>
            {currentUser && (
                <Link to={`/${currentUser.username}`}>
                    <Flex w={"full"} justifyContent={"center"}>
                        <Button mx={"auto"}>Visit my profile</Button>
                    </Flex>
                </Link>
            )}
        </div>
    );
};

export default HomePage;
