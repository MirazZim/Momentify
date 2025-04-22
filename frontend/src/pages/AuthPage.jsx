import { useRecoilValue } from "recoil"
import Login from "../components/LoginCard.jsx"
import SignUp from "../components/SignUpCard.jsx"
import authScreenAtom from "../../atoms/authAtom.js"


const AuthPage = () => {

  const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <>
    {
      authScreenState === "login" ? <Login/> : <SignUp/>
    }

    </>
  )
}

export default AuthPage