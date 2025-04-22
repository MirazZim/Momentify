import { Button, Flex } from "@chakra-ui/react"
import { Link } from "react-router-dom"


const HomePage = () => {
    return (
        <div>
            <Link to={"/:username"}>
                 
                 <Flex w={"full"} justifyContent={"center"}>
                    <Button mx={"auto"} >Visit my profile</Button>

                 </Flex>

            </Link>
        </div>
    )
}

export default HomePage