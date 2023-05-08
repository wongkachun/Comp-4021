const express = require("express");
const {
    register,
    signin,
    signout,
    validate
} = require("./controller/authentication.js");
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
    cookie: {
        maxAge: 300000
    },
});
app.use(chatSession);


// // Handle the /player endpoint
app.post("/player", (req, res) => {
    res.json({
        status: "success"
    });
});

// Handle the /register endpoint
app.post("/register", register);

// Handle the /signin endpoint
app.post("/signin", signin);

// Handle the /validate endpoint
app.get("/validate", validate);

// Handle the /signout endpoint
app.get("/signout", signout);


// Use a web server to listen at port 8000

const {
    createServer
} = require("http");
const {
    Server
} = require("socket.io");
const httpServer = createServer(app);
const io = new Server(httpServer);
const port = 8000;

httpServer.listen(8000, () => {
    console.log(`Server started at http://localhost:${port}`);
});

io.use((socket, next) => {
    chatSession(socket.request, {}, next);
});
const connections = [null, null]
const onlineUsers = {};

io.on("connection", (socket) => {
    const newUser = socket.request.session.user;
    console.log(newUser);
    if (newUser && newUser.username in onlineUsers) {
        socket.emit('player-number', onlineUsers[newUser.username].index)
        io.emit('player-connection', onlineUsers[newUser.username].index)
    } else {
        let playerIndex = -1;
        for (const i in connections) {
            if (connections[i] === null) {
                playerIndex = i
                break
            }
        }
        socket.emit('player-number', playerIndex);
        console.log(playerIndex);
        if (playerIndex === -1) return
        connections[playerIndex] = false;
        onlineUsers[newUser.username] = {
            name: newUser.name,
            index: playerIndex
        }
        io.emit('player-connection', playerIndex)
    }
    socket.on('emit-player-connection', (playerIndex) => {
        io.emit('player-connection', playerIndex)
    })
    socket.on('player-move', (message) => {
        socket.broadcast.emit('second-player-move', message);
        socket.emit('first-player-move', message);
    })
    socket.on('player-stop', (message) => {
        socket.broadcast.emit('second-player-stop', message);
        socket.emit('first-player-stop', message);
    })
    socket.on('player-cheat', (message) => {
        socket.broadcast.emit('second-player-cheat', message);
        socket.emit('first-player-cheat', message);
    })
    socket.on('reset-player-cheat', (message) => {
        socket.broadcast.emit('second-reset-player-cheat', message);
        socket.emit('first-reset-player-cheat', message);
    })
    socket.on('game-win', (message) => {
        const match = {
            players: Object.keys(onlineUsers),
            winner: newUser.username
        }
        const jsonData = fs.readFileSync("data/matches.json");
        const matches = JSON.parse(jsonData);
        matches.push(match);
        fs.writeFileSync("data/matches.json", JSON.stringify(matches, null, " "));
    })

    socket.on('player-focus', (message) => {
        socket.broadcast.emit('player-focus', message);
    })
});