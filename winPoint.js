const WinPoint = function(ctx, x, y, gameArea) {
    const sprite = Sprite(ctx, x, y);
    const sequences = {
        cherry: {
            x: 8,
            y: 8,
            width: 56,
            height: 56,
            count: 1,
            timing: 0,
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
        .useSheet("./assets/end/End.png");
    const gameObject = GameObject(sprite);
    return {
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        moveLeft: gameObject.moveLeft,
        moveRight: gameObject.moveRight,
        move: gameObject.move,
        update: sprite.update,
        collide: gameObject.collide
    };
}