const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();

        // Wait for the socket to connect successfully
        socket.on("connect", () => {
            // Get the online user list
            socket.emit("get users");

            // Get the chatroom messages
            // socket.emit("get messages");

            // Get leaderboard score
            socket.emit("get scores")
        });

        // Set up the users event
        socket.on("users", (onlineUsers) => {
            onlineUsers = JSON.parse(onlineUsers);

            // Show the online users
            OnlineUsersStatus.update(onlineUsers);
        });

        // Set up the add user event
        socket.on("add user", (user) => {
            user = JSON.parse(user);

            // Add the online user
            OnlineUsersStatus.addUser(user);
        });

        // Set up the scores event
        socket.on("scores", (leaderboard) => {
            leaderboard = JSON.parse(leaderboard);

            // Show the chatroom messages
            BoardPanel.update(leaderboard);
        });


         // Set up the add message event
         socket.on("add scores", (message) => {
            message = JSON.parse(message);

            // Add the message to the chatroom
            BoardPanel.addScores(message);
        });

        socket.on("initiate player move", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            GamePanel.initiatePlayerMove(message.type, message.onlineUsers);
        });

        socket.on("initiate player stop", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            GamePanel.initiatePlayerStop(message.type, message.onlineUsers);
        });

        socket.on("initiate player attack start", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            GamePanel.initiatePlayerAttackStart(message.type, message.onlineUsers);
        });

        socket.on("initiate player attack stop", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            GamePanel.initiatePlayerAttackStop(message.type, message.onlineUsers);
        });

        socket.on("check game start", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            GamePanel.checkGameStart(message);
        });

        socket.on("update leaderboard", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            BoardPanel.updateBoard(message.type, message.onlineUsers);
        });

        socket.on("activate cheat mode", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            GamePanel.activateCheatMode(message.type, message.onlineUsers);
        });

        socket.on("reset game page", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            GamePanel.resetGameEvent(message.type, message.onlineUsers);
        });

        socket.on("update score event", (message) => {

            message = JSON.parse(message);
            // Add the message to the chatroom
            GamePanel.updateGameScores(message.playerScore, message.player2Score);
        });

        socket.on("update player status", (message) => {

            message = JSON.parse(message);
            GamePanel.setPlayer(message.x, message.y, message.status, message.name, message.onlineUsers)
        });

    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    // This function sends a post message event to the server
    // const postMessage = function(content) {
    //     if (socket && socket.connected) {
    //         socket.emit("post message", content);
    //     }
    // };

    const postScores = function(content) {
        if (socket && socket.connected) {
            socket.emit("post scores", content);
        }
    };

    const playerMoveEvent = function(type){
        if (socket && socket.connected) {
            socket.emit("player move", type);
        }
    }

    const playerStopEvent = function(type){
        if (socket && socket.connected) {
            socket.emit("player stop", type);
        }
    }

    const playerAttackStartEvent = function(type){
        if (socket && socket.connected) {
            socket.emit("player attack start", type);
        }
    }

    const playerAttackStopEvent = function(type){
        if (socket && socket.connected) {
            socket.emit("player attack stop", type);
        }
    }

    const GameStartEvent = function(){
        if (socket && socket.connected) {
            socket.emit("game start");
        }
    }

    const updatePlayerScore = function(){
        if (socket && socket.connected) {
            socket.emit("update player score");
        }
    }

    const playerCheatMode = function(type){
        if (socket && socket.connected) {
            socket.emit("cheat mode", type);
        }
    }

    const resetEvent = function(type){
        if (socket && socket.connected) {
            socket.emit("reset game", type);
        }
    }

    const updateScoreEvent = function(content){
        if (socket && socket.connected) {
            socket.emit("score event", content);
        }
    }

    const playerUpdate = function(data){
        if (socket && socket.connected) {
            socket.emit("update player status", data);
        }
    }

    return { getSocket, connect, disconnect, postMessage, playerMoveEvent, playerStopEvent, playerCheatMode,
        playerAttackStartEvent, playerAttackStopEvent, GameStartEvent, postScores, updatePlayerScore, resetEvent, 
        updateScoreEvent, playerUpdate};
})();
