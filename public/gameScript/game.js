const gameArea = function(players, gameState, canvasId, sounds) {

    const groundPoint = 580;
    /* Get the canvas and 2D context */
    const cv = $(canvasId).get(0);
    const context = cv.getContext("2d");
    // Create ID player
    let id = 1;
    if (canvasId === "#player2") {
        id = 2;
    }
    /* Create the sounds */

    let gameStartTime = 0; // The timestamp when the game starts
    /* Create the game area */
    const gameArea = BoundingBox(context, 165, 60, groundPoint - 20, 600);

    /* Create the sprites in the game */
    // Create all object
    const moveObject = [];
    // Create ground
    const grounds = [];
    // Create cherries
    const cherries = [];
    //Create wall
    const walls = [];
    // Create saving points
    const savePoints = [];
    // Create trap
    const traps = [];
    // List ground
    for (let i = -200; i < 2000; i++) {
        grounds.push(Platform(context, 22 + i * 40, groundPoint, gameArea, 1));
    }
    // List wall
    walls.push(Platform(context, 350, 480, gameArea, 2));
    walls.push(Platform(context, 398, 480, gameArea, 2));
    walls.push(Platform(context, 446, 400, gameArea, 2));
    walls.push(Platform(context, 494, 400, gameArea, 2));
    walls.push(Platform(context, 734, 400, gameArea, 2));
    walls.push(Platform(context, 782, 400, gameArea, 2));
    walls.push(Platform(context, 830, 320, gameArea, 2));
    walls.push(Platform(context, 878, 320, gameArea, 2));
    walls.push(Platform(context, 734, 220, gameArea, 2));
    walls.push(Platform(context, 782, 220, gameArea, 2));
    walls.push(Platform(context, 1550, 420, gameArea, 2));
    walls.push(Platform(context, 1598, 420, gameArea, 2));

    // Moving wall
    walls.push(Platform(context, 974, 220, gameArea, 4));
    walls.push(Platform(context, 1022, 220, gameArea, 4));

    // Save point 1
    walls.push(Platform(context, 638, 480, gameArea, 2));
    walls.push(Platform(context, 686, 480, gameArea, 2));
    savePoints.push(SavePoint(context, 640, 440, gameArea, 1));
    // Save point 2
    walls.push(Platform(context, 1450, 340, gameArea, 2));
    walls.push(Platform(context, 1498, 340, gameArea, 2));
    savePoints.push(SavePoint(context, 1460, 300, gameArea, 1));

    // Create start
    const start = Platform(context, 150, 545, gameArea, 3);
    // Trap to end

    // Create end
    walls.push(Platform(context, 2626, 400, gameArea, 2));
    walls.push(Platform(context, 2674, 400, gameArea, 2));
    const end = WinPoint(context, 2640, 364, gameArea);

    // List traps
    for (let i = 0; i < 500; i++) {
        traps.push(Trap(context, 280 + i * 32, 552, gameArea, 1));
    }
    // Moving trap 1
    traps.push(Trap(context, 590, 300, gameArea, 2));
    // Moving trap 2
    traps.push(Trap(context, 660, 120, gameArea, 2));
    // Double mobing trap
    traps.push(Trap(context, 1420, 196, gameArea, 3));
    traps.push(Trap(context, 1558, 136, gameArea, 2));
    // Trap wall to end
    for (let i = 0; i < 20; i++) {
        walls.push(Platform(context, 1650 + i * 48, 340, gameArea, 2));
    }
    for (let i = 0; i < 10; i++) {
        traps.push(Trap(context, 1682 + i * 98, 324, gameArea, 4));
    }
    // Cherry 3
    cherries.push(Cherry(context, 2000, 316, gameArea));

    // Cherry 1 
    walls.push(Platform(context, 532, 220, gameArea, 2));
    walls.push(Platform(context, 580, 220, gameArea, 2));
    cherries.push(Cherry(context, 560, 196, gameArea));
    // Cherry 2 
    walls.push(Platform(context, 1282, 156, gameArea, 2));
    walls.push(Platform(context, 1330, 156, gameArea, 2));
    walls.push(Platform(context, 1378, 156, gameArea, 2));
    cherries.push(Cherry(context, 1378, 132, gameArea));
    traps.push(Trap(context, 1266, 140, gameArea, 4));
    // Create cherry Point
    const cherryPoint = []
    for (let i = 0; i < 3; i++) {
        cherryPoint.push(Cherry(context, 120 + i * 20, 25, gameArea));
    }
    // Set up moveObj
    grounds.forEach(e => moveObject.push(e));
    walls.forEach(e => moveObject.push(e))
    traps.forEach(e => moveObject.push(e));
    savePoints.forEach(e => moveObject.push(e));
    cherries.forEach(e => moveObject.push(e));
    moveObject.push(start);
    moveObject.push(end);
    //Player
    let player = Player(context, 150, 535, gameArea, moveAll, moveBack, walls, traps, savePoints, cherries, end, gameState, id, cherryPoint, sounds); // The player
    if (canvasId === "#player1") {
        players.player1 = player
    } else {
        players.player2 = player
    }
    /* The main processing of the game */

    function doFrame(now) {
        // TODO show the game over here
        if (gameState.finish) {
            if (gameState.winId === 1) {
                sounds.background.pause();
                sounds.gameover.play();
                $("#winner-game").text("Player 1 win");
            } else if (gameState.winId === 2) {
                sounds.background.pause();
                sounds.gameover.play();
                $("#winner-game").text("Player 2 win");
            }

            $("#game-over").show();
            return;
        }
        if (gameStartTime == 0) gameStartTime = now;

        /* Update the time remaining */
        const gameTimeSoFar = now - gameStartTime;


        player.update(now);
        traps.forEach(e =>
            e.update(now)
        );
        walls.forEach(e => {
            e.update(now);
        })
        cherries.forEach(e => e.update(now));


        /* Clear the screen */
        context.clearRect(0, 0, cv.width, cv.height);

        /* Draw the sprites */
        player.draw();
        start.draw();
        end.draw();
        grounds.forEach(e => {
            e.draw();
        });
        walls.forEach(e => {
            e.draw();
        });
        traps.forEach(e => {
            e.draw();
        });
        savePoints.forEach(e => {
            e.draw();
        });
        cherries.forEach(e => {
            e.draw();
        });
        cherryPoint.forEach(e => {
            e.draw();
        });
        /* Process the next frame */
        requestAnimationFrame(doFrame);
    }

    function moveAll(dir) {
        // move left
        if (dir === 2) {
            moveObject.forEach(e => e.moveLeft());
        } else {
            moveObject.forEach(e => e.moveRight());
        }
    }

    function moveBack(distance) {
        moveObject.forEach(e => e.move(distance));
    }
    /* Start the game */
    requestAnimationFrame(doFrame);

}