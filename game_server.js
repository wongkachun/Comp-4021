const express = require("express");

const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");

// Create the Express app
const app = express();

// Use the 'public' folder to serve static files
app.use(express.static("public"));

// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const chatSession = session({
  secret: "game",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 300000 },
});
app.use(chatSession);

// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
  return /^\w+$/.test(text);
}

// Handle the /player endpoint
app.post("/player", (req, res) => {
  const { player, x, y, status } = req.body;

  const jsonData = fs.readFileSync("data/player.json");
  const players = JSON.parse(jsonData);
  // console.log(players)

  players[player] = { x, y, status };

  fs.writeFileSync("data/player.json", JSON.stringify(players, null, " "));

  const testData = fs.readFileSync("data/player.json");
  const tests = JSON.parse(testData);

  //console.log(tests);

  res.json({ status: "success" });
});

// Handle the /register endpoint
app.post("/register", (req, res) => {
  // Get the JSON data from the body
  const { username, name, password } = req.body;

  //
  // D. Reading the users.json file
  //
  const jsonData = fs.readFileSync("data/users.json");
  const users = JSON.parse(jsonData);

  //
  // E. Checking for the user data correctness
  //
  if (!username || !name || !password) {
    res.json({
      status: "error",
      error: "Username/name/password cannot be empty.",
    });
    return;
  }
  if (!/^\w+$/i.test(username)) {
    res.json({ status: "error", error: "Username is not valid." });
    return;
  }
  if (users[username]) {
    res.json({ status: "error", error: "Username is already taken." });
    return;
  }
  //
  // G. Adding the new user account
  //
  const hash = bcrypt.hashSync(password, 10);
  users[username] = { name, password: hash };

  //
  // H. Saving the users.json file
  //
  fs.writeFileSync("data/users.json", JSON.stringify(users, null, " "));

  //
  // I. Sending a success response to the browser
  //
  res.json({ status: "success" });

  // Delete when appropriate
  // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
  // Get the JSON data from the body
  const { username, password } = req.body;

  //
  // D. Reading the users.json file
  //
  const jsonData = fs.readFileSync("data/users.json");
  const users = JSON.parse(jsonData);

  //
  // E. Checking for username/password
  //
  if (!users[username]) {
    res.json({ status: "error", error: "Username is not found." });
    return;
  }
  const hashedPassword = users[username].password;
  if (!bcrypt.compareSync(password, hashedPassword)) {
    res.json({ status: "error", error: "Wrong password." });
    return;
  }

  //
  // G. Sending a success response with the user account
  //
  req.session.user = { username, name: users[username].name };
  res.json({ status: "success", user: req.session.user });

  // Delete when appropriate
  // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {
  //
  // B. Getting req.session.user
  //
  if (!req.session.user) {
    res.json({ status: "error", error: "You have not signed in." });
    return;
  }
  //
  // D. Sending a success response with the user account
  //
  res.json({ status: "success", user: req.session.user });

  // Delete when appropriate
  // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {
  //
  // Deleting req.session.user
  //
  if (req.session.user) {
    delete req.session.user;
  }
  //
  // Sending a success response
  //
  res.json({ status: "success" });

  // Delete when appropriate
  // res.json({ status: "error", error: "This endpoint is not yet implemented." });
});

//
// ***** Please insert your Lab 6 code here *****
//

// Use a web server to listen at port 8000

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 8000;

httpServer.listen(8000, () => {
  console.log(`Server started at http://localhost:${port}`);
});

io.use((socket, next) => {
  chatSession(socket.request, {}, next);
});

const onlineUsers = {};

io.on("connection", (socket) => {
  if (socket.request.session.user) {
    const { username, name } = socket.request.session.user;
    onlineUsers[username] = { name };
    console.log(onlineUsers);
    io.emit("add user", JSON.stringify(socket.request.session.user));
  }

  socket.on("disconnect", () => {
    if (socket.request.session.user) {
      const { username } = socket.request.session.user;
      if (onlineUsers[username]) delete onlineUsers[username];
      console.log(onlineUsers);
      io.emit("remove user", JSON.stringify(socket.request.session.user));
    }
  });

  socket.on("get users", () => {
    socket.emit("users", JSON.stringify(onlineUsers));
  });

  socket.on("get scores", () => {
    const leaderboard = JSON.parse(fs.readFileSync("data/leaderboard.json"));
    socket.emit("scores", JSON.stringify(leaderboard));
  });

  socket.on("post scores", (content) => {
    if (socket.request.session.user) {
      const message = {
        user: socket.request.session.user,
        datetime: new Date(),
        content: content,
      };
      const leaderboard = JSON.parse(fs.readFileSync("data/leaderboard.json"));
      leaderboard.push(message);
      fs.writeFileSync(
        "data/leaderboard.json",
        JSON.stringify(leaderboard, null, " ")
      );
      io.emit("scores", JSON.stringify(leaderboard));
    }
  });

  socket.on("player move", (type) => {
    if (socket.request.session.user) {
      const message = {
        type: type,
        onlineUsers: onlineUsers,
      };
      io.emit("initiate player move", JSON.stringify(message));
    }
  });

  socket.on("player stop", (type) => {
    if (socket.request.session.user) {
      const message = {
        type: type,
        onlineUsers: onlineUsers,
      };
      io.emit("initiate player stop", JSON.stringify(message));
    }
  });

  socket.on("player attack start", (type) => {
    if (socket.request.session.user) {
      const message = {
        type: type,
        onlineUsers: onlineUsers,
      };
      io.emit("initiate player attack start", JSON.stringify(message));
    }
  });

  socket.on("player attack stop", (type) => {
    if (socket.request.session.user) {
      const message = {
        type: type,
        onlineUsers: onlineUsers,
      };
      io.emit("initiate player attack stop", JSON.stringify(message));
    }
  });

  socket.on("game start", () => {
    if (socket.request.session.user) {
      io.emit("check game start", JSON.stringify(onlineUsers));
    }
  });

  socket.on("update player score", () => {
    type = 0;
    if (socket.request.session.user) {
      const message = {
        type: type,
        onlineUsers: onlineUsers,
      };
      io.emit("update leaderboard", JSON.stringify(message));
    }
  });

  socket.on("cheat mode", (type) => {
    if (socket.request.session.user) {
      const message = {
        type: type,
        onlineUsers: onlineUsers,
      };
      io.emit("activate cheat mode", JSON.stringify(message));
    }
  });

  socket.on("reset game", (type) => {
    if (socket.request.session.user) {
      const message = {
        type: type,
        onlineUsers: onlineUsers,
      };
      io.emit("reset game page", JSON.stringify(message));
    }
  });

  socket.on("score event", (message) => {
    if (socket.request.session.user) {
      io.emit("update score event", JSON.stringify(message));
    }
  });

  socket.on("update player status", (data) => {
    if (socket.request.session.user) {
      const message = {
        x: data.x,
        y: data.y,
        status: data.status,
        name: data.name,
        onlineUsers: onlineUsers,
      };
      io.emit("update player status", JSON.stringify(message));
    }
  });
});
