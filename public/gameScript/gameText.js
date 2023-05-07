const Cherry = function(ctx, x, y, gameArea) {
    const sprite = Sprite(ctx, x, y);
    const sequences = {
        text: {
            x: 0,
            y: 0,
            width: 32,
            height: 32,
            count: 17,
            timing: 500,
            loop: false,
            moving: false,
            movDistance: 0
        }
    }
    sprite.setSequence(sequences.cherry)
        .setScale(1)
        .setShadowScale({
            x: 1.0,
            y: 0.0
        })
        .useSheet("./assets/collect/Cherries.png");
    const gameObject = GameObject(sprite);
    return {
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        moveLeft: gameObject.moveLeft,
        moveRight: gameObject.moveRight,
        move: gameObject.move,
        update: sprite.update,
    };
}