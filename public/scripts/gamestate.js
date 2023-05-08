const GameState = (function() {
    let isStart = false;
    let isPause = false;
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
    const firstPlayerMove = function(index) {
        players.player1.move(index);
    }
    const firstPlayerStop = function(index) {
        players.player1.stop(index);
    }
    const firstCheat = function() {
        players.player1.cheat();
    }
    const firstResetCheat = function() {
        players.player1.resetCheat();
    }
    const secondPlayerMove = function(index) {
        players.player2.move(index);
    }
    const secondPlayerStop = function(index) {
        players.player2.stop(index);
    }
    const secondCheat = function() {
        players.player2.cheat();
    }
    const secondResetCheat = function() {
        players.player2.resetCheat();
    }
    const gameover = function() {
        $("#game-over").show();
        $("#waiting").hide();
    }
    const pause = function() {
        isPause = true;
        $("#focus").show();
        $("#game-start").show();
    }
    const resume = function() {
        isPause = false;
        $("#focus").hide();
        $("#game-start").hide();
    }
    const getPause = function() {
        return isPause;
    }
    return {
        pause: pause,
        resume: resume,
        getPause: getPause,
        gameover: gameover,
        getIsStart,
        startPlay,
        getPlayer,
        getGameState,
        secondCheat: secondCheat,
        secondPlayerMove: secondPlayerMove,
        secondPlayerStop: secondPlayerStop,
        secondResetCheat: secondResetCheat,
        firstCheat: firstCheat,
        firstPlayerMove: firstPlayerMove,
        firstPlayerStop: firstPlayerStop,
        firstResetCheat: firstResetCheat
    }
})();