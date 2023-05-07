const GameObject = function(sprite) {
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
    const collide = function(box) {
        const {
            top,
            left,
            bottom,
            right
        } = box.getFourSegment();
        const {
            width,
            height
        } = sprite.getSequence();
        const scale = sprite.getScale();
        //console.log(top, left, bottom, right);
        let {
            x,
            y
        } = sprite.getXY();
        return left <= x + width * scale / 2 && right >= x - width * scale / 2 && top <= y + height * scale / 2 && bottom >= y - height * scale / 2;
    }
    return {
        moveLeft: moveLeft,
        moveRight: moveRight,
        move: move,
        collide: collide,
    }
}