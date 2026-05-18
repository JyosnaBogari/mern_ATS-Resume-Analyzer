import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from './components/RootLayout';
import UploadResume from "./components/UploadResume";
import { Toaster } from "react-hot-toast";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import CreateResume from "./components/CreateResume";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import DashboardSidebar from "./components/DashboardSideBar";
import DashboardUploadResume from "./components/DashboardUploadResume";
import DashboardHeader from "./components/DashnoardHeader";
import ResumeHistory from "./components/ResumeHistory";
import AnalysisResults from "./components/AnalysisResults";
import EditResume from "./components/EditResume";
import ResumeContextProvider from "./contexts/ResumeContextProvider";
import { useAuth } from "./store/authStore";
import { useEffect } from "react";

function App() {
  // create routerObj for routing
  const checkAuth =
  useAuth(state => state.checkAuth);

useEffect(() => {

  checkAuth();

}, []);

//create route Object
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      errorElement: <div className="flex items-center justify-center min-h-screen"><h1 className="text-2xl text-red-500">Something went wrong!</h1></div>,
      children: [
        {
          path: "",
          element: <UploadResume />
        },
        {
          path: "signin",
          element: <SignIn />
        },
        {
          path: "signup",
          element: <SignUp />
        },
        {
          path: "create-resume",
          element: <CreateResume />
        },
        {
          path: "edit-resume/:id",
          element: <EditResume />
        },
        // here after user login
        {
          path: "dashboard",
          element: (
            <ResumeContextProvider>
              <DashboardLayout />
            </ResumeContextProvider>
          ),
          children: [
            {
              path: "",
              element: <Dashboard />
            },
            {
              path: "upload-resume",
              element: <DashboardUploadResume />
            },
            {
              path: "create-resume",
              element: <CreateResume />
            },
            {
              path: "history",
              element: <ResumeHistory />
            },
            {
              path: "analysis",
              element: <AnalysisResults />
            }
          ]
        },
      ]
    }
  ]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={routerObj} />
    </>
  );
}

export default App;
