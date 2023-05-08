const Socket = (function() {
    let userIndex = -1;
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

        });
        socket.on('player-number', (playerIndex) => {
            userIndex = parseInt(playerIndex);
        })
        socket.on('player-connection', (playerIndex) => {
            console.log("Get index", playerIndex);
            if (userIndex != -1) {
                if (userIndex != parseInt(playerIndex)) {
                    if (userIndex == 0) {
                        socket.emit('emit-player-connection', userIndex);
                    }
                    // start the game
                    GameState.startPlay();

                }
            }
        })
        socket.on('second-player-move', (index) => {
            console.log("move", index);
            GameState.secondPlayerMove(parseInt(index.index));
            //GameState.sync(parseInt(index.distance), index.y);
        })
        socket.on('second-player-stop', (index) => {
            GameState.secondPlayerStop(parseInt(index.index));
            //GameState.sync(parseInt(index.distance), index.y);
        })
        socket.on('second-player-cheat', (message) => {
            GameState.secondCheat();
        })

        socket.on('second-reset-player-cheat', (message) => {
            GameState.secondResetCheat();
        })
        socket.on('first-player-move', (index) => {
            GameState.firstPlayerMove(parseInt(index.index));
            //GameState.sync(parseInt(index.distance), index.y);
        })
        socket.on('first-player-stop', (index) => {
            GameState.firstPlayerStop(parseInt(index.index));
            //GameState.sync(parseInt(index.distance), index.y);
        })
        socket.on('first-player-cheat', (message) => {
            GameState.firstCheat();
        })

        socket.on('first-reset-player-cheat', (message) => {
            GameState.firstResetCheat();
        })
        socket.on('player-focus', (message) => {
            if (message === "0") {
                GameState.pause();
            } else {
                GameState.resume();
            }
        })
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };



    return {
        getSocket,
        connect,
        disconnect
    };
})();