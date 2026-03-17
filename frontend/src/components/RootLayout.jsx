import { Outlet } from "react-router"
import Header from './PublicNavBar'
import Footer from './Footer'

function RootLayout() {
  return (
    <div>
        <Header/>
        <div className="min-h-screen">
            {/* placeholder */}
            <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

export default RootLayout
