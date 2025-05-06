
import { Box, Container} from "@chakra-ui/react"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import userAtom from "../atoms/userAtom.js"
import { useRecoilValue } from "recoil"

import UpdateProfilePage from "./pages/UpdateProfilePage.jsx"
import CreatePost from "./components/CreatePost.jsx"
import ChatPage from "./pages/ChatPage.jsx"



function App() {

  const user = useRecoilValue(userAtom);
  console.log("Currently Logged in ",user)

  const {pathname} = useLocation();

 

  return (
    <>
    <Box position="relative" w="full">
      <Container maxW={ pathname === "/" ? "900px" : "620px"} >
        <Header />
         <Routes>

          //homepage
         <Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />

         //auth
         <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />

         //updateProfile
         <Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />


          <Route path="/:username" element={ user ? (
            <>
            <UserPage />
            <CreatePost />
            </>
          ) : (
            <UserPage />
          )} />

          
          <Route path="/:username/post/:pid" element={<PostPage />} />
          <Route path="/chat" element={user ? <ChatPage /> : <Navigate to='/auth' />} />
         </Routes>

         
         
      </Container>
      </Box>
      
    </>
  )
}

export default App
