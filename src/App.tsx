import { Navbar } from "./components/ui/navbar"
import { Outlet, data } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import { useUserState } from "./hooks/useUserState";
import { supabase } from "./config/supabase";
import { useEffect } from "react";


function App() {

  const setUser = useUserState((s) => s.setUser);
  const setLoading = useUserState((s) => s.setLoading);

  useEffect(() => {
    const restore = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log(user);

      if (user) {
        setUser({
          email: user.email || "",
          name: user.user_metadata.name || "",
        });
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    restore();
  }, [setLoading, setUser]);

  return (
    <>
      <Navbar />
      <ToastContainer />
      <Outlet />

    </>

  )
}

export default App;
