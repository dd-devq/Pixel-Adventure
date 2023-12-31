export class InputManager {
    private static instance: InputManager

    private scene: Phaser.Scene
    private keyboard: Phaser.Input.Keyboard.KeyboardPlugin
    private cursor: Phaser.Types.Input.Keyboard.CursorKeys

    public static get Instance(): InputManager {
        if (!InputManager.instance) {
            InputManager.instance = new InputManager()
        }
        return InputManager.instance
    }

    public initialize(scene: Phaser.Scene): void {
        this.scene = scene
        if (this.scene.input.keyboard !== null) {
            this.keyboard = this.scene.input.keyboard
            this.cursor = this.keyboard.createCursorKeys()
        }
    }

    public isSpaceKeyDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.cursor.space)
    }

    public isUpKeyDown(): boolean {
        return Phaser.Input.Keyboard.JustDown(this.cursor.up)
    }

    public isLeftKeyDown(): boolean {
        return this.cursor.left.isDown
    }

    public isRightKeyDown(): boolean {
        return this.cursor.right.isDown
    }

    public isEscKeyDown(): boolean {
        return this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)?.isDown
    }
}
