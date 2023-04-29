const Platform = function(ctx, x, y, gameArea, option) {
    const sprite = Sprite(ctx, x, y);
    const sequences = {
        ground: {
            x: 99,
            y: 0,
            width: 40,
            height: 40,
            count: 1,
            timing: 2000,
            loop: false,
            moving: false,
            movDistance: 0
        },
        wall: {
            x: 192,
            y: 0,
            width: 48,
            height: 16,
            count: 1,
            timing: 2000,
            loop: false,
            moving: false,
            movDistance: 0

        },
        start: {
            x: 0,
            y: 24,
            width: 64,
            height: 40,
            count: 1,
            timing: 2000,
            loop: false,
            moving: false,
            movDistance: 0
        }
    }
    switch (option) {
        case 1:
            sprite.setSequence(sequences.ground)
                .setScale(1)
                .setShadowScale({
                    x: 0.0,
                    y: 0.0
                })
                .useSheet("./assets/platform/Terrain.png");
            break;
        case 2:
            sprite.setSequence(sequences.wall)
                .setScale(1)
                .setShadowScale({
                    x: 0.0,
                    y: 0.0
                })
                .useSheet("./assets/platform/Terrain.png");
            break;
        case 3:
            sprite.setSequence(sequences.start)
                .setScale(1)
                .setShadowScale({
                    x: 0.0,
                    y: 0.0
                })
                .useSheet("./assets/start/Start.png");
    }

    const moveLeft = function() {
        let {
            x,
            y
        } = sprite.getXY();
        sprite.setXY(x - 4, y);
    }
    const moveRight = function() {
        let {
            x,
            y
        } = sprite.getXY();
        sprite.setXY(x + 4, y);
    }
    const move = function(distance) {
        let {
            x,
            y
        } = sprite.getXY();
        sprite.setXY(x - distance, y);
    }
    return {
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        moveLeft: moveLeft,
        moveRight: moveRight,
        move: move
    };
}