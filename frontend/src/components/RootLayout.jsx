import { Outlet, useLocation } from "react-router"
import Header from './Header'
import Footer from './Footer'

function RootLayout() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="flex flex-col min-h-screen">
        {!isDashboard && <Header/>}
        <main className="flex-1">
            {/* placeholder */}
            <Outlet/>
        </main>
        {!isDashboard && <Footer/>}
    </div>
  )
}

export default RootLayout
