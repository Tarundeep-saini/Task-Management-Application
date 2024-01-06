import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../Context/User-Context";

const TaskItem = ({ task, handleRemoveTask, setFilteredTasks }) => {
  const { id } = useContext(userContext);
  const [editTask, setEditTask] = useState(task.task);
  const [category, setCategory] = useState(task.category);
  const [checked, setChecked] = useState(task.completed);
  const [toggleEdit, setToggleEdit] = useState(false);
  const [checkStatus, setCheckStatus] = useState("");
  const [isError, setIsError] = useState({ error: false, message: "" });

  const handleWarning = (message = "Error Occurred") => {
    setIsError({
      error: true,
      message,
    });
    setTimeout(() => {
      setIsError({
        error: false,
        message: "",
      });
    }, 3000);
  };

  const handleStatusError = () => {
    setCheckStatus("error");
    setTimeout(() => {
      setCheckStatus("");
    }, 2000);
  };

  const handleToggleComplete = async () => {
    setCheckStatus("loading");
    try {
      await axios.patch("/toggleComplete", { taskId: task._id, id });
      setChecked(!checked);
      setCheckStatus("");
    } catch (error) {
      handleStatusError();
    }
  };

  useEffect(() => {
    setChecked(task.completed);
  }, [task.completed]);

  const handleToggleEdit = () => {
    setToggleEdit(!toggleEdit);
  };

  const handleTaskChange = (e) => {
    setEditTask(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleEditTask = async () => {
    if (editTask === "") {
      handleWarning("Task cannot be empty");
      return;
    }

    try {
      const response = await axios.patch("/updateTask", {
        editTask,
        category,
        id,
        taskId: task._id,
      });
      const { data } = response;
      setFilteredTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? data : t))
      );
      setToggleEdit(false);
    } catch (error) {
      handleWarning("Error occurred while updating task");
    }
  };

  return (
    <div className="w-10/12 flex flex-col gap-4 border border-gray-400 hover:border-gray-600 py-2 px-6 bg-white hover:bg-[#fbfbfb] rounded-md hover:rounded-lg shadow-sm hover:shadow-md">
      <div className="w-full flex justify-center items-center">
        <h2 className="pr-2 text-center underline border-r border-gray-600">
          {task.createdOn}
        </h2>
        <h2 className="w-5/12 pl-1 border-r border-gray-600">
          Task: {task.task}
        </h2>
        <p className="w-3/12 pl-1">Category: {task.category}</p>
        <div className="flex ml-auto gap-8 justify-center items-center">
          {checkStatus === "" && (
            <input
              className="h-6 w-6"
              type="checkbox"
              checked={checked}
              onChange={handleToggleComplete}
            />
          )}
          {checkStatus === "loading" && <h2>Loading</h2>}
          {checkStatus === "error" && <h2 className="text-red-400">Error</h2>}

          <button
            onClick={() => handleRemoveTask(task._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Remove
          </button>
          <button
            onClick={handleToggleEdit}
            className="bg-gray-200 px-2 py-1 rounded"
          >
            Edit
          </button>
        </div>
      </div>
      {toggleEdit && (
        <div className="border-t flex gap-3 w-full p-1">
          {isError.error ? (
            <div className="w-full md:w-3/4 text-center text-red-500 border p-1 border-red-300">
              {isError.message}
            </div>
          ) : (
            <input
              className="w-full md:w-3/4 border text-lg px-2 py-1 mb-2 md:mb-0 md:mr-2"
              type="text"
              placeholder="New Task"
              value={editTask}
              onChange={handleTaskChange}
            />
          )}
          <select
            className="w-3/12"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="shopping">Shopping</option>
            <option value="misc">Misc</option>
          </select>
          <button
            className="w-2/12 border-2 p-1 rounded-md"
            onClick={handleEditTask}
          >
            Edit This Task
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
