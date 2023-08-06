import { _decorator, Camera, Component, EventKeyboard, EventMouse, game, Input, input, instantiate, KeyCode, Vec2, Vec3, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('player')
export class player extends Component {
    static instance: typeof this.prototype;
    onLoad() {
        let c; c = this.constructor; c.instance = this;
        window[c.name] = c;
    }

    start() {
        input.on(Input.EventType.KEY_DOWN, this.onKey, this);
        input.on(Input.EventType.KEY_PRESSING, this.onKey, this);
        input.on(Input.EventType.KEY_UP, this.onKey, this);
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);

    }

    update(deltaTime: number) {
        let addX = 0;
        if (this.isW && (this.isW < this.isS || !this.isS)) addX = .1;
        if (this.isS && (this.isS < this.isW || !this.isW)) addX = -.1;
        let addZ = 0;
        if (this.isD && (this.isD < this.isA || !this.isA)) addZ = .1;
        if (this.isA && (this.isA < this.isD || !this.isD)) addZ = -.1;

        let addY = 0;
        if (this.isSpace) {
            addY = 0.2;
            this.isSpace = Math.max(0, this.isSpace - addY);
        }

        let aa = this.node.getPosition();
        let bbb = (new Vec2(addX, addZ)).rotate((this.node.eulerAngles.y) / -180 * Math.PI)
        addX = bbb.x;
        addZ = bbb.y

        this.node.setPosition(aa.x + addX, aa.y + addY, aa.z + addZ);

        if (this.bullet) {
            let bb = this.bullet.getPosition();
            this.bullet.setPosition(bb.x + 1, bb.y, bb.z);
            if (bb.x > 100) {
                this.bullet.removeFromParent();
                this.bullet.destroy();
                this.bullet = null;
            }
        }
    }

    private isW = 0;
    private isS = 0;
    private isA = 0;
    private isD = 0;
    private isSpace = 0;

    private onKey(event: EventKeyboard) {
        let isDown = event.getType() == Input.EventType.KEY_DOWN;
        let isUp = event.getType() == Input.EventType.KEY_UP;
        switch (event.keyCode) {
            case KeyCode.KEY_W:
                if (isUp) this.isW = 0;
                else this.isW = this.isS + 1;
                break;
            case KeyCode.KEY_S:
                if (isUp) this.isS = 0;
                else this.isS = this.isW + 1;
                break;
            case KeyCode.KEY_A:
                if (isUp) this.isA = 0;
                else this.isA = this.isD + 1;
                break;
            case KeyCode.KEY_D:
                if (isUp) this.isD = 0;
                else this.isD = this.isA + 1;
                break;
            case KeyCode.SPACE:
                if (isDown && this.isSpace == 0) this.isSpace = 3;
                break;
            case KeyCode.KEY_P:
                if (isUp) game.canvas.requestFullscreen()
                break;
        }
    }

    private onMouseDown(event: EventMouse) {
        if (!document.pointerLockElement) {
            game.canvas.requestPointerLock()
            return;
        }

        if (!this.bullet) {
            this.bullet = instantiate(this.node.getChildByName("Sphere"));
            this.node.addChild(this.bullet);
        }
    }
    private bullet: Node;

    private onMouseMove(event: EventMouse) {
        let addZ = event.getDeltaY() > 0 ? 0.7 : (event.getDeltaY() < 0 ? -0.7 : 0)
        let addY = event.getDeltaX() > 0 ? -2.2 : (event.getDeltaX() < 0 ? 2.2 : 0)
        let resY = this.node.eulerAngles;
        this.node.eulerAngles = Vec3.add(resY, resY, { x: 0, y: addY, z: 0 })
        let resZ = this.node.children[0].eulerAngles;
        this.node.children[0].eulerAngles = Vec3.add(resZ, resZ, { x: 0, y: 0, z: addZ })
    }

}
