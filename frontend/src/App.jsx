import { createBrowserRouter,RouterProvider } from "react-router";
import RootLayout from './components/RootLayout';
import UploadResume from "./components/UploadResume";
import { Toaster } from "react-hot-toast";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import UserProfile from "./components/UserProfile";
import CreateResume from "./components/CreateResume";

function App() {
  // create routerObj for routing 
  const routerObj=createBrowserRouter([
    {
      path:"/",
      element:<RootLayout/>,
      children:[
        {
          path:"",
          element:<UploadResume/>
        },
        {
          path:"signin",
          element:<SignIn/>
        },
        {
          path:"signup",
          element:<SignUp/>
        },
        {
          path:"user-profile",
          element:<UserProfile/>
        },
        {
          path:"create-resume",
          element:<CreateResume/>
        }
      ]
    }
  ])
  return (
    <>
    <Toaster position="top-center" reverseOrder={false}></Toaster>
    <RouterProvider router={routerObj}/>
    </>
  )
}

export default App
