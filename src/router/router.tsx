import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import App from "../App.tsx";
import Signin from "@/components/examples/card/standard/login-card.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="" element={<App />}>
      <Route path="/signin" element={<Signin />} />
    </Route>,
  ),
);

export default router;
