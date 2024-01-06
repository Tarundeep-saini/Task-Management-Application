import axios from "axios";
import React, { useContext, useState } from "react";
import { userContext } from "../Context/User-Context";

const Auth = () => {
  const { setUsername, setId } = useContext(userContext);
  const [isRegister, setIsRegister] = useState(true);
  const [isloading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  
  const [isError, setIsError] = useState({ error: false, message: "" });
  const handleWaning = (mess = "Error Occured") => {
    console.log("here");
    setIsError({
      error: true,
      message: mess,
    });
    setTimeout(() => {
      setIsError({
        error: false,
        message: "",
      });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username == "" || formData.password === "") {
      return;
    }
    setIsLoading(true);
    var path = isRegister ? "auth" : "login";

    try {
      const response = await axios.post(`/${path}`, formData);
      setUsername(response.data.username);
      setId(response.data._id);
    } catch (error) {
      console.log(error);
      handleWaning("Error Occured");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen ">
      <div
        className={`bg-white rounded-md px-4 py-2 border  ${
          isError.error ? "border-red-500" : "border-gray-300"
        }   `}
      >
        <h2
          className={`text-2xl text-center mb-4  ${
            isError.error ? "text-red-500" : "text-gray-700"
          }   `}
        >
          {isRegister ? "Create to account" : " Welcome back "}
        </h2>
        <form
          className={` flex flex-col gap-5 border ${
            isError.error ? "border-red-500" : "border-gray-300"
          }   p-3 `}
        >
          <div className="text-center font-bold ">
            {isError.error ? (
              <h2 className="text-red-400"> {isError.message} </h2>
            ) : (
              <h2 className="text-gray-700">Fill the Form </h2>
            )}
          </div>
          <div className="flex justify-between items-center">
            <label className="text-md">Username : </label>
            <input
              className=" border p-2 ml-2"
              type="text"
              value={formData.username}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  username: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <label className="text-md">Password : </label>
            <input
              className=" border p-2 ml-2"
              type="text"
              value={formData.password}
              onChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  password: e.target.value,
                }));
              }}
            />
          </div>
          <div className="flex justify-center items-center">
            <button
              disabled={isloading}
              className=" text-white text-md bg-slate-500 px-2 py-1 border-2 border-slate-400 "
              onClick={(e) => handleSubmit(e)}
            >
              {!isRegister ? "Login" : "Signup"}
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center p-3">
          <button
            // className="bg-slate-400 p-2 border-2 border-slate-700 "
            onClick={() => setIsRegister(!isRegister)}
          >
            Switch to {isRegister ? "Login" : "Signup"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
