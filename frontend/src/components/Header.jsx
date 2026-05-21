import { useAuth } from "../store/authStore"
import PublicNavBar from "./PublicNavBar"

function Header() {
   const isAuthenticated=useAuth(state=>state.isAuthenticated)
    return !isAuthenticated ? <PublicNavBar/> : null;
}

export default Header
