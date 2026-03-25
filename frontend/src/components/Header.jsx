import { useAuth } from "../store/authStore"
import PublicNavBar from "./PublicNavBar"
import DashboardLayout from "./DashboardLayout"

function Header() {
   const isAuthenticated=useAuth(state=>state.isAuthenticated)
   // const currentUser=useAuth(state=>state.currentUser)
    return isAuthenticated ? <DashboardLayout/> : <PublicNavBar/>
}

export default Header
