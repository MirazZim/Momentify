
import { Container} from "@chakra-ui/react"
import { Navigate, Route, Routes } from "react-router-dom"
import UserPage from "./pages/UserPage"
import PostPage from "./pages/PostPage"
import Header from "./components/Header"
import HomePage from "./pages/HomePage"
import AuthPage from "./pages/AuthPage"
import userAtom from "../atoms/userAtom.js"
import { useRecoilValue } from "recoil"
import LogoutButton from "./components/LogoutButton.jsx"
import UpdateProfilePage from "./pages/UpdateProfilePage.jsx"



function App() {

  const user = useRecoilValue(userAtom);
  console.log("Currently Logged in ",user)

 

  return (
    <>
      <Container maxW="620px" >
        <Header />
         <Routes>

          //homepage
         <Route path='/' element={user ? <HomePage /> : <Navigate to='/auth' />} />

         //auth
         <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />

         //updateProfile
         <Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />


          <Route path="/:username" element={<UserPage />} />
          <Route path="/:username/post/:pid" element={<PostPage />} />
         </Routes>

         {user && <LogoutButton />}
      </Container>
      
    </>
  )
}

export default App
