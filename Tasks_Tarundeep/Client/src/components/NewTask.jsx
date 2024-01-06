import axios from "axios";
import React, { useContext, useState } from "react";
import { userContext } from "../Context/User-Context";

const NewTask = ({ setFilteredTasks }) => {
  const { id } = useContext(userContext);

  const [task, setTask] = useState("");
  const [category, setCategory] = useState("work");
  const [isloading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ error: false, message: "" });

  const handleWaning = (mess = "Error Occured") => {
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

  const handleTaskChange = (e) => {
    setTask(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleAddTask = async () => {
    if (task === "") {
      handleWaning("Write The Task");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.post("/newTask", { task, category, id });
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1;
      let dd = today.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const createdOn = dd + "/" + mm + "/" + yyyy;
      setFilteredTasks((prevTasks) => {
        const updatedTasks = [
          ...prevTasks,
          { task, category, _id: data, createdOn },
        ];
        return updatedTasks;
      });

      setTask("");
      setCategory("work");
    } catch (error) {
      handleWaning("Error Occured While Adding new Task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex flex-col md:flex-row gap-4 items-center border-t border-gray-500 ">
      <div className="w-full md:w-11/12 gap-4  block md:flex items-center">
        {isError.error ? (
          <div className="w-full text-center text-red-500 border p-2 border-red-300  ">
            {" "}
            {isError.message}{" "}
          </div>
        ) : (
          <input
            className="w-full md:w-3/4 border border-gray-400 text-xl px-2 py-1 mb-2 md:mb-0 md:mr-2"
            type="text"
            placeholder="New Task"
            value={task}
            onChange={handleTaskChange}
          />
        )}
        <select
          className="w-full md:w-1/4 border px-2 py-1"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="work">Work</option>
          <option value="personal">Personal</option>
          <option value="shopping">Shopping</option>
          <option value="misc">Misc</option>
        </select>
      </div>
      <button
        disabled={isloading || isError.error}
        className={`w-full md:w-1/12 p-2 ${
          isloading ? "bg-green-400" : "bg-blue-500"
        } text-white`}
        onClick={handleAddTask}
      >
        {!isloading ? "Add" : "Loading"}
      </button>
    </div>
  );
};

export default NewTask;
