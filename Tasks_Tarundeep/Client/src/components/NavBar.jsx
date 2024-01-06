import React from "react";
import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { userContext } from "../Context/User-Context";

const NavBar = () => {
  const navigate = useNavigate();
  const { setUsername } = useContext(userContext);

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 2170 00:00:00 UTC; path=/;";
    navigate("/");
    setUsername(null);
  };
  return (
    <nav className=" flex items-center justify-between px-4 py-2  border-b bg-white  ">
      <div>
        <NavLink
          to={"/home"}
          className=" text-3xl font-semibold tracking-wider"
        >
          Tasks <span className="text-sm" >By Tarundeep</span>
        </NavLink>
      </div>
      <div className="flex  items-center justify-center gap-8">
        <button onClick={handleLogout} className="text-lg  px-3 py-1 bg-gray-300 border  ">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
