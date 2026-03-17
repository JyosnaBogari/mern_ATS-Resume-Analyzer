import { useAuth } from "../store/authStore"
import PublicNavBar from "./PublicNavBar"
import UserNavBar from "./UserNavBar"

function Header() {
   const isAuthenticated=useAuth(state=>state.isAuthenticated)
   const currentUser=useAuth(state=>state.currentUser)
   // if user not logged in then should have publicNavbar
   if(!isAuthenticated && !currentUser)
   {
    return <PublicNavBar/>
   }
   //if user logged in then should show UserNavBar
   if(isAuthenticated && currentUser)
   {
    return <UserNavBar/>
   }
}

export default Header
