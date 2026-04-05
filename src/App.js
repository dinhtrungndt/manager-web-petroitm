import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import Routers from "./routers";
import { LOGIN_SUCCESS } from "./stores/redux/AuthTypes";
import { getToken } from "./utils/Token";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    if (token) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { username: "admin_auto_restored" }
      });
    }
  }, [dispatch]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { zIndex: 999999 },
          duration: 3000,
        }}
      />
      <Routers />
    </>
  );
}

export default App;
