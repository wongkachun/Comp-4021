const GameState = (function() {
    let isStart = false;
    let players = {
        player1: null,
        player2: null,
    }

    let gameState = {
        player1: {
            cherryLeft: 3,
            win: false,
            isCheat: false,
        },
        player2: {
            cherryLeft: 3,
            win: false,
            isCheat: false,
        },
        finish: false,
        winId: 0,
        yourId: 1,
    }
    const getIsStart = function() {
        return isStart;
    }
    const getPlayer = function() {
        return players;
    }
    const getGameState = function() {
        return gameState;
    }
    const startPlay = function() {
        isStart = true;
        $("#game-start").hide();
        $('#background-sound')[0].play();
        $("#waiting").hide();
    }
    const playerMove = function(index) {
        players.player2.move(index);
    }
    const playerStop = function(index) {
        players.player2.stop(index);
    }
    const cheat = function() {
        players.player2.cheat();
    }
    const resetCheat = function() {
        players.player2.resetCheat();
    }
    const sync = function(totalDistance, y) {
        let curDistance = players.player2.getTotalDistance();
        let diff = parseInt(totalDistance) - curDistance;
        players.player2.setY(y);
        if (diff < 0) {
            for (let i = 0; i < -diff; i = i + 4) {
                players.player2.move(1);
                players.player2.stop(1);
            }
        } else {
            for (let i = 0; i < diff; i = i + 4) {
                players.player2.move(2);
                players.player2.stop(2);
            }
        }
    }
    const gameover = function() {
        $("#game-over").show();
    }
    return {
        gameover: gameover,
        sync,
        getIsStart,
        startPlay,
        getPlayer,
        getGameState,
        playerMove,
        playerStop,
        cheat,
        resetCheat
    }
})();