import { useContext } from "react";
import "./App.css";
import axios from "axios";
import Auth from "./pages/Auth";
import Tasks from "./pages/HomePage";
import NavBar from "./components/NavBar";
import { UserContextProvider, userContext } from "./Context/User-Context";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  axios.defaults.baseURL = "https://task-management-application-api.vercel.app";
  axios.defaults.withCredentials = true;
  const { username } = useContext(userContext);

  return (
    <Router>
      <UserContextProvider>
        <AppContents />
      </UserContextProvider>
    </Router>
  );
}
function AppContents() {
  const { username } = useContext(userContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Tasks />} />
      </Routes>
    </>
  );
}

export default App;
