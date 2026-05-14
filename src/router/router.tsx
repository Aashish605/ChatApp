import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "../App.tsx";
import Signin from "@/components/examples/card/standard/login-card.tsx";
import Signup from "@/components/examples/card/standard/Signup-card.tsx";
import { Message } from "@/components/Message.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="/" element={<Message />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
    </Route>,
  ),
);

export default router;
