const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
var cors = require("cors");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./Modals/User");
var cookieParser = require("cookie-parser");
app.use(cookieParser());
var jwtKey = "shhhhh";
const PORT = process.env.PORT || 3000;

var corsOptions = {
  origin: "https://task-management-application-gold.vercel.app","*",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post("/auth", async (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res
      .status(406)
      .json({ message: "Form Not Filled Properly", isError: true });
  }
  const hashedPassword = await bcrypt.hash(password, 8);
  try {
    var user = await User.create({
      username,
      password: hashedPassword,
    });
  } catch (error) {
    res.status(406).json({
      message: "Error Occured Creating User Try Again",
      isError: true,
    });
  }
  if (!user) {
    return;
  }
  jwt.sign(
    { username, id: user._id },
    jwtKey,
    {
      expiresIn: "5y", // Expires in 5 years
    },
    (err, token) => {
      if (err) {
        res.status(406).json({
          message: "Error Occured Creating User Try Again",
          isError: true,
        });
      }

      res.cookie("token", token).status(201).json(user);
    }
  );
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Form Not Filled Properly", isError: true });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", isError: true });
    }

    const token = jwt.sign({ username, id: existingUser._id }, jwtKey, {
      expiresIn: "5y", // Expires in 5 years
    });

    res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .json(existingUser);
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal Server Error", isError: true });
  }
});

app.use("/profile",  (req, res) => {
  const token = req.cookies?.token;
  if (!token) {
    return;
  }

  try {
    const data = jwt.verify(token, jwtKey);

    res.json(data);
  } catch (error) {
    console.error("Error in decoding JWT:", error);
    res.status(406).json({
      message: "Error Occured Creating User Try Again",
      isError: true,
    });
  }
});

app.post("/newTask", async (req, res) => {
  const { task, category, id } = req.body;
  if (!id) {
    console.log("No ID");
  }
  console.log(task, category, id);
  try {
    const user = await User.findById(id);
    if (!user) {
      return;
    }
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const createdOn = dd + "/" + mm + "/" + yyyy;

    user.tasks.push({ task, category, completed: false, createdOn });
    await user.save();
    const newTaskId = user.tasks[user.tasks.length - 1]._id;
    res.json(newTaskId);
  } catch (error) {
    console.log(error);
  }
});

app.get("/myTasks/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) {
    console.log("SAdas");
    return;
  }

  try {
    const user = await User.findOne({ _id: id });

    if (!user) {
      console.log("No User");
      return res.status(404).json({ error: "User not found" });
    }

    let tasks = user.tasks;
    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/removeTasks", async (req, res) => {
  const { itemId, id } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log("Found User");
    user.tasks = user.tasks.filter((task) => task._id != itemId);
    await user.save();
    res.json(user.tasks);
  } catch (error) {
    console.error("Error removing task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/updateTask", async (req, res) => {
  const { editTask, category, id, taskId } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const taskIndex = user.tasks.findIndex(
      (task) => task._id.toString() === taskId
    );

    if (taskIndex !== -1) {
      const today = new Date();
      const yyyy = today.getFullYear();
      let mm = today.getMonth() + 1;
      let dd = today.getDate();

      if (dd < 10) dd = "0" + dd;
      if (mm < 10) mm = "0" + mm;

      const createdOn = dd + "/" + mm + "/" + yyyy;
      user.tasks[taskIndex].createdOn = createdOn;
      user.tasks[taskIndex].task = editTask;
      user.tasks[taskIndex].category = category;
      await user.save();

      res.json(user.tasks[taskIndex]);
    } else {
      res.status(404).json({ error: "Task not found" });
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.patch("/toggleComplete", async (req, res) => {
  const { id, taskId } = req.body;
  console.log(taskId);

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    const foundTask = user.tasks.find((task) => task._id == taskId);

    if (foundTask) {
      foundTask.completed = !foundTask.completed;
    }
    await user.save();
    console.log(user.tasks);
    res.json("Done");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/", (req, res, next) => {
  res.json({ message: "Welcome" });
  next();
});

mongoose.connect("mongodb+srv://tarundeepsaini037:Testing1234@location.in8fipa.mongodb.net/Tasks?retryWrites=true&w=majority").then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
