import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "../App.tsx";
import Signup from "@/components/examples/dialog/standard/dialog-signup-form.tsx";
import Signin from "@/components/examples/dialog/standard/dialog-signin-form.tsx";
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="*" element={<div>Not Found</div>} />
    </Route>,
  ),
);

export default router;
