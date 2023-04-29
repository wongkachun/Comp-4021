const Cherry = function(ctx, x, y, gameArea) {
    let collected = false;
    const sprite = Sprite(ctx, x, y);
    const sequences = {
        cherry: {
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
    const collide = function(box) {
        if (collected) {
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
        return left <= x + sequences.cherry.width / 2 && right >= x - sequences.cherry.width / 2 && top <= y + sequences.cherry.height / 2 && bottom >= y - sequences.cherry.height / 2;
    }
    const collect = function() {
        if (!collected) {
            sprite.useSheet("");
            collected = true;
        }
    }
    return {
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        moveLeft: gameObject.moveLeft,
        moveRight: gameObject.moveRight,
        move: gameObject.move,
        update: sprite.update,
        collide: collide,
        collect: collect
    };
}