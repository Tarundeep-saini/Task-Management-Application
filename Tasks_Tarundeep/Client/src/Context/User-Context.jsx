import axios from "axios";
import { createContext, useEffect, useState } from "react";
export const userContext = createContext({});
import { useNavigate } from "react-router-dom";

export function UserContextProvider({ children }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("/profile");
      setUsername(() => data.username);
      setId(() => data.id);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (username) {
      navigate("/home");
    }
  }, [username]);

  return (
    <userContext.Provider
      value={{
        username,
        setUsername,
        id,
        setId,
      }}
    >
      {children}
    </userContext.Provider>
  );
}
