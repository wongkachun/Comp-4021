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
        socket.on('player-move', (index) => {
            GameState.playerMove(parseInt(index.index));
            //GameState.sync(parseInt(index.distance), index.y);
        })
        socket.on('player-stop', (index) => {
            GameState.playerStop(parseInt(index.index));
            //GameState.sync(parseInt(index.distance), index.y);
        })
        socket.on('player-cheat', (message) => {
            GameState.cheat();
        })

        socket.on('reset-player-cheat', (message) => {
            GameState.resetCheat();
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