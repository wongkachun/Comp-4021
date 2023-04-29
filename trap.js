const Trap = function(ctx, x, y, gameArea, option) {
    const sprite = Sprite(ctx, x, y);
    const sequences = {
        spike: {
            x: 0,
            y: 8,
            width: 16,
            height: 8,
            count: 1,
            timing: 2000,
            loop: false,
            moving: false,
            movDistance: 0
        },
        saw: {
            x: 0,
            y: 0,
            width: 38,
            height: 38,
            count: 8,
            timing: 50,
            loop: true,
            moving: true,
            movDistance: 60,
        }
    }
    switch (option) {
        case 1:
            sprite.setSequence(sequences.spike)
                .setScale(2)
                .setShadowScale({
                    x: 1.0,
                    y: 0.0
                })
                .useSheet("./assets/trap/spike.png");
            break;
        case 2:
            sprite.setSequence(sequences.saw)
                .setScale(1)
                .setShadowScale({
                    x: 1.0,
                    y: 0.0
                })
                .useSheet("./assets/trap/saw.png");
            break;
    }
    const gameObject = GameObject(sprite);

    return {
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        moveLeft: gameObject.moveLeft,
        moveRight: gameObject.moveRight,
        move: gameObject.move,
        collide: gameObject.collide,
        update: sprite.update
    };
}