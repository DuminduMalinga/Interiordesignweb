import { createBrowserRouter } from "react-router";
import Welcome from "./pages/Welcome";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UploadFloorPlan from "./pages/UploadFloorPlan";
import Processing from "./pages/Processing";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Welcome,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/signin",
    Component: SignIn,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/upload",
    Component: UploadFloorPlan,
  },
  {
    path: "/processing",
    Component: Processing,
  },
  {
    path: "*",
    Component: Welcome, // Redirect unknown routes to welcome
  },
]);