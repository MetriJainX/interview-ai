import {createBrowserRouter} from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/register";
import Protected from "./features/auth/components/protected";
import Home from "./features/interview/pages/Home"
import Interview from "./features/interview/pages/Interview";

// creating routes ki kis rpute pr konsa component aaega
export const router = createBrowserRouter([  
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },{
        path:"/",
        element:<Protected><Home/></Protected>
    },{
        path:"/interview/:interviewId",
        element:<Protected><Interview/></Protected>
    }
 ])                  
 export default router;