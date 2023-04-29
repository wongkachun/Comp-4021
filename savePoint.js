const SavePoint = function(ctx, x, y, gameArea, option) {
    const sprite = Sprite(ctx, x, y);
    let playerGet = false;
    const sequences = {
        before: {
            x: 0,
            y: 0,
            width: 64,
            height: 64,
            count: 1,
            timing: 2000,
            loop: false,
            moving: false,
            movDistance: 0
        },
        after: {
            x: 0,
            y: 0,
            width: 64,
            height: 64,
            count: 10,
            loop: true,
            moving: false,
            movingDistance: 0,
        }
    }
    sprite.setSequence(sequences.before)
        .setScale(1)
        .setShadowScale({
            x: 0.0,
            y: 0.0
        })
        .useSheet("./assets/savepoint/saveBefore.png");
    const gameObject = GameObject(sprite);
    const collide = function(box) {
        if (playerGet) {
            return false;
        }
        const {
            top,
            left,
            bottom,
            right
        } = box.getFourSegment();
        //console.log(top, left, bottom, right);
        let {
            x,
            y
        } = sprite.getXY();
        return left <= x + sequences.before.width / 2 && right >= x - sequences.before.width / 2 && top <= y + sequences.before.height / 2 && bottom >= y - sequences.before.height / 2;
    }
    const makePoint = function() {
        if (!playerGet) {
            sprite.setSequence(sequences.after)
                .setScale(1)
                .setShadowScale({
                    x: 0.0,
                    y: 0.0
                })
                .useSheet("./assets/savepoint/saveAfter.png");
            playerGet = true;
        }
    }
    return {
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        moveLeft: gameObject.moveLeft,
        moveRight: gameObject.moveRight,
        move: gameObject.move,
        collide: collide,
        makePoint: makePoint
    };
}