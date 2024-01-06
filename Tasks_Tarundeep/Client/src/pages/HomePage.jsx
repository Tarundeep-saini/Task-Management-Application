import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import NewTask from "../components/NewTask";
import NavBar from "../components/NavBar";
import { userContext } from "../Context/User-Context";
import TaskItem from "../components/TaskItem";

const Tasks = () => {
  const { id } = useContext(userContext);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [isloading, setIsLoading] = useState(false);
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

  const handleRemoveTask = async (itemId) => {
    try {
      await axios.post("/removeTasks", { id, itemId });
      setFilteredTasks((prevTasks) =>
        prevTasks.filter((task) => task._id != itemId)
      );
    } catch (error) {
      handleWaning("Error Occured Removing task");
    }
  };

  useEffect(() => {
    const getTasks = async () => {
      setIsLoading(true);
      if (!id) {
        return;
      }
      try {
        const response = await axios.get(`/myTasks/${id}`);
        const data = response.data;
        setTasks(data.tasks);
        setFilteredTasks(data.tasks);
      } catch (error) {
        handleWaning("Error Occured Fetching Tasks");
      } finally {
        setIsLoading(false);
      }
    };
    getTasks();
  }, [id]);

  const applyFilter = () => {
    switch (filter) {
      case "COMPLETED":
        setFilteredTasks(tasks.filter((task) => task.completed));
        break;
      case "Work":
        setFilteredTasks(tasks.filter((task) => task.category === "work"));
        break;
      case "Personal":
        setFilteredTasks(tasks.filter((task) => task.category === "personal"));
        break;
      case "Shopping":
        setFilteredTasks(tasks.filter((task) => task.category === "shopping"));
        break;
      case "Misc":
        setFilteredTasks(tasks.filter((task) => task.category === "misc"));
        break;
      default:
        setFilteredTasks(tasks);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [filter, tasks]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <NavBar />
      <div className=" p-2 flex  justify-center items-center">
        <label>
          Filter by:
          <select
            className="bg-white p-2 ml-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Tasks</option>
            <option value="COMPLETED">Completed Tasks</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Shopping">Shopping</option>
            <option value="Misc">Misc</option>
          </select>
        </label>
      </div>
      {!isloading ? (
        <div className="">
          {!isError.error ? (
            <div className="flex flex-col w-full  items-center gap-2 pt-8 pb-24">
              {filteredTasks.length === 0 ? (
                <div>No tasks available.</div>
              ) : (
                filteredTasks.map((task, index) => (
                  <TaskItem
                    setFilteredTasks={setFilteredTasks}
                    id={task._id}
                    task={task}
                    key={index}
                    handleRemoveTask={handleRemoveTask}
                  />
                ))
              )}
            </div>
          ) : (
            <div className="text-center text-2xl  ">{isError.message}</div>
          )}
        </div>
      ) : (
        "Loading..."
      )}
      <NewTask setFilteredTasks={setFilteredTasks} />
    </div>
  );
};

export default Tasks;
