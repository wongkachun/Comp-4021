// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player
// - `gameArea` - The bounding box of the game area
const Player = function(ctx, x, y, gameArea, moveAll, moveBack, walls, traps, savePoints, cherries, end, gameState, id, cherryPoint, sounds) {
    let velocity = 0;
    const gravity = 0.5;
    let isGround = false;
    let totalDistance = 0;
    // This is the sprite sequences of the player facing different directions.
    // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
    // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
    const sequences = {
        /* Idling sprite sequences for facing different directions */
        idleLeft: {
            x: 0,
            y: 25,
            width: 24,
            height: 25,
            count: 3,
            timing: 1000,
            loop: false,
            moving: false,
            movDistance: 0
        },
        idleDown: {
            x: 0,
            y: 0,
            width: 24,
            height: 25,
            count: 3,
            timing: 1000,
            loop: false,
            moving: false,
            movDistance: 0
        },
        idleRight: {
            x: 0,
            y: 75,
            width: 24,
            height: 25,
            count: 3,
            timing: 1000,
            loop: false,
            moving: false,
            movDistance: 0
        },
        /* Moving sprite sequences for facing different directions */
        moveLeft: {
            x: 0,
            y: 125,
            width: 24,
            height: 25,
            count: 10,
            timing: 50,
            loop: true,
            moving: false,
            movDistance: 0
        },
        moveRight: {
            x: 0,
            y: 175,
            width: 24,
            height: 25,
            count: 10,
            timing: 50,
            loop: true,
            moving: false,
            movDistance: 0
        }
    };

    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the player sprite here.
    sprite.setSequence(sequences.idleRight)
        .setScale(2)
        .setShadowScale({
            x: 0.75,
            y: 0.20
        })
        .useSheet("./assets/player/player_sprite.png");

    // This is the moving direction, which can be a number from 0 to 4:
    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving up
    // - `3` - moving to the right
    // - `4` - moving down
    let direction = 0;
    let preDirection = 2;
    // This is the moving speed (pixels per second) of the player
    //let speed = 0;

    // This function sets the player's moving direction.
    // - `dir` - the moving direction (1: Left, 2: Right)
    const move = function(dir) {
        if (gameState.finish && this.velocity == 0) {
            return;
        }
        if (dir >= 1 && dir <= 3 && dir != direction) {
            switch (dir) {
                case 1:
                    preDirection = 1;
                    sprite.setSequence(sequences.moveLeft);
                    break;
                case 2:
                    preDirection = 2;
                    sprite.setSequence(sequences.moveRight);
                    break;
                case 3:
                    if (preDirection == 1) {
                        sprite.setSequence(sequences.idleLeft);
                    } else {
                        sprite.setSequence(sequences.idleRight);
                    }
                    break;

            }
            direction = dir;
        }
    };

    // This function stops the player from moving.
    // - `dir` - the moving direction when the player is stopped (1: Left, 2: Right)
    const stop = function(dir) {
        if (direction == dir) {
            switch (dir) {
                case 1:
                    sprite.setSequence(sequences.idleLeft);
                    break;
                case 2:
                    sprite.setSequence(sequences.idleRight);
                    break;
                case 3:
                    if (preDirection == 1) {
                        sprite.setSequence(sequences.idleLeft);
                    } else {
                        sprite.setSequence(sequences.idleRight);
                    }
                    break;
            }
            direction = 0;
        }
    };

    // This function updates the player depending on his movement.
    // - `time` - The timestamp when this function is called
    const update = function(time) {
        if (gameState.finish && this.velocity == 0) {
            return;
        }
        /* Update the player if the player is moving */
        let {
            x,
            y
        } = sprite.getXY();
        // Update the position and reset ground state
        y += this.velocity;
        isGround = false;
        // Check if hit any wall
        walls.forEach(e => {
            if (e.getBoundingBox().isPointInBox(x + sequences.idleDown.width, y + sequences.idleDown.height + this.velocity) ||
                e.getBoundingBox().isPointInBox(x - sequences.idleDown.width, y + sequences.idleDown.height + this.velocity)) {
                isGround = true;
                this.velocity = 0;
            }
        });
        walls.forEach(e => {
            if (e.getBoundingBox().isPointInBox(x + sequences.idleDown.width, y - sequences.idleDown.height) ||
                e.getBoundingBox().isPointInBox(x - sequences.idleDown.width, y - sequences.idleDown.height)) {
                this.velocity = 0;
            }
        });
        // Hit any traps
        hitTrap = false;
        traps.forEach(e => {
            if (e.collide(this.getBoundingBox())) {
                hitTrap = true;
            }
        });
        if (hitTrap) {
            if (gameState.yourId === id) {
                sounds.dead.play();
            }
            moveBack(-totalDistance);
            totalDistance = 0;
            sprite.setY(280);
            sprite.update(time);
            return;
        }
        // Hit any save point
        let hitSavePoint = false
        savePoints.forEach(e => {
            if (e.collide(this.getBoundingBox())) {
                e.makePoint();
                hitSavePoint = true;
            }
        });
        if (hitSavePoint) {
            if (gameState.yourId === id) {
                sounds.savepoint.play();
            }
            totalDistance = -8;
            return;
        }
        // Hit any cherry
        cherries.forEach(e => {
            if (e.collide(this.getBoundingBox())) {
                e.collect();
                if (id === 1) {
                    gameState.player1.cherryLeft -= 1;
                } else {
                    gameState.player2.cherryLeft -= 1;
                }
                sounds.collect.play();
                cherryPoint.pop();
            }
        });
        // Win condition
        if (id === 1) {
            if (end.collide(this.getBoundingBox()) && gameState.player1.cherryLeft === 0) {
                gameState.finish = true;
                gameState.winId = 1;
            }
        } else {
            if (end.collide(this.getBoundingBox()) && gameState.player2.cherryLeft === 0) {
                gameState.finish = true;
                gameState.winId = 2;
            }
        }

        /// Update the y position

        if (y + sequences.idleLeft.height + this.velocity <= gameArea.getBottom() && !isGround) {
            this.velocity += gravity;
        } else {
            this.velocity = 0;
        }
        // Handle movement
        if (direction != 0) {
            /* Move the player */
            switch (direction) {
                case 1:
                    //x -= speed / 60;
                    totalDistance -= 4;
                    break;
                case 2:
                    // x += speed / 60;
                    totalDistance += 4;
                    break;
                case 3:
                    if (y + sequences.idleLeft.height >= gameArea.getBottom() || isGround) {
                        this.velocity -= 10;
                        direction = 0;
                    }
                    break;
            }
            if (direction == 1) {
                moveAll(1);
            } else if (direction == 2) {
                moveAll(2);
            }
        }

        /* Set the new position if it is within the game area */
        if (gameArea.isPointInBox(x, y)) {
            sprite.setXY(x, y);
        } else {
            if (this.velocity != 0) {
                sprite.setY(y);
            }

        }
        /* Update the sprite object */
        sprite.update(time);
    };

    // The methods are returned as an object here.
    return {
        move: move,
        stop: stop,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: update
    };
};