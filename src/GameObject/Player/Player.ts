import { playerAnimationKey } from '../../Constant/AnimationKey'
import { RunState } from './RunState'
import { FallState } from './FallState'
import { IdleState } from './IdleState'
import { HitState } from './HitState'
import { DoubleJumpState, JumpState, WallJumpState } from './JumpState'
import { State } from './State'
import { Stack } from '../../Container/Stack'
import { spriteObj } from '../../Constant/AssetKey'

const TIME_TO_CHECK_TOUCH_WALL = 3

export class Player extends Phaser.Physics.Arcade.Sprite {
    /* Player Asset */
    private playerSpriteObj: PlayerSpriteObj

    public playerStateStack: Stack<State<Player>> = new Stack<State<Player>>()
    public playerState: Map<string, State<Player>> = new Map<string, State<Player>>()

    private readonly BODY_SCALE_FACTOR = { x: 0.5, y: 0.8 }
    private readonly BODY_OFFSET = { x: 7.5, y: 5 }

    private timeToCheckTouchWall = 0

    /* Player's Flag */
    public isGrounded = true
    public isTouchingWall = false
    public isTouchingWallLeft = false
    public isFacingLeft = false
    public jumpCount = 0
    public maxJumpCount = 2
    public isDead = false

    constructor(scene: Phaser.Scene, x: number, y: number, playerSpriteObj: PlayerSpriteObj) {
        super(scene, x, y, playerSpriteObj.IDLE.key)

        this.playerSpriteObj = playerSpriteObj
        this.create()

        this.scene.add.existing(this)
        this.scene.physics.world.enable(this)

        if (this.body !== null) {
            this.body
                .setSize(
                    this.width * this.BODY_SCALE_FACTOR.x,
                    this.height * this.BODY_SCALE_FACTOR.y
                )
                .setOffset(this.BODY_OFFSET.x, this.BODY_OFFSET.y)
        }
    }

    private create(): void {
        this.createAnimations()
        this.createState()
    }

    private createState(): void {
        this.playerState.set(playerAnimationKey.RUN, new RunState(this))
        this.playerState.set(playerAnimationKey.FALL, new FallState(this))
        this.playerState.set(playerAnimationKey.IDLE, new IdleState(this))
        this.playerState.set(playerAnimationKey.HIT, new HitState(this))
        this.playerState.set(playerAnimationKey.JUMP, new JumpState(this))
        this.playerState.set(playerAnimationKey.WALL_JUMP, new WallJumpState(this))
        this.playerState.set(playerAnimationKey.DOUBLE_JUMP, new DoubleJumpState(this))

        const playerStateDefault = this.playerState.get(playerAnimationKey.IDLE)
        if (playerStateDefault !== undefined) {
            this.playerStateStack.push(playerStateDefault)
        }
    }

    private createAnimations(): void {
        Object.values(playerAnimationKey).forEach((key) => {
            if (this.scene.anims.exists(key)) {
                this.scene.anims.remove(key)
            }
        })

        this.anims.create({
            key: playerAnimationKey.DISAPPEARING,
            frames: this.anims.generateFrameNumbers(spriteObj.DISAPPEARING.key, {
                start: 0,
                end: -1,
            }),
            frameRate: 15,
            repeat: 0,
        })

        this.anims.create({
            key: playerAnimationKey.JUMP,
            frames: this.anims.generateFrameNumbers(this.playerSpriteObj.JUMP.key, {
                start: 0,
                end: -1,
            }),
            frameRate: 15,
            repeat: -1,
        })

        this.anims.create({
            key: playerAnimationKey.DOUBLE_JUMP,
            frames: this.anims.generateFrameNumbers(this.playerSpriteObj.DOUBLE_JUMP.key, {
                start: 0,
                end: -1,
            }),
            frameRate: 15,
            repeat: 0,
        })

        this.anims.create({
            key: playerAnimationKey.WALL_JUMP,
            frames: this.anims.generateFrameNumbers(this.playerSpriteObj.WALL_JUMP.key, {
                start: 0,
                end: -1,
            }),
            frameRate: 15,
            repeat: 0,
        })

        this.anims.create({
            key: playerAnimationKey.HIT,
            frames: this.anims.generateFrameNumbers(this.playerSpriteObj.HIT.key, {
                start: 0,
                end: -1,
            }),
            frameRate: 15,
            repeat: 0,
        })

        this.anims.create({
            key: playerAnimationKey.FALL,
            frames: this.anims.generateFrameNumbers(this.playerSpriteObj.FALL.key, {
                start: 0,
                end: -1,
            }),
            frameRate: 15,
            repeat: 0,
        })

        this.anims.create({
            key: playerAnimationKey.IDLE,
            frames: this.anims.generateFrameNumbers(this.playerSpriteObj.IDLE.key, {
                start: 0,
                end: -1,
            }),
            frameRate: 15,
            repeat: -1,
        })

        this.anims.create({
            key: playerAnimationKey.RUN,
            frames: this.anims.generateFrameNumbers(this.playerSpriteObj.RUN.key, {
                start: 0,
                end: -1,
            }),
            frameRate: 15,
            repeat: -1,
        })

        this.play(playerAnimationKey.IDLE)
    }

    public gotoState(state: string) {
        if (this.playerStateStack.length() > 1) {
            this.playerStateStack.top()?.Exit()
            this.playerStateStack.pop()
        }

        const playerState = this.playerState.get(state)
        if (playerState !== undefined) {
            this.playerStateStack.push(playerState)
            this.playerStateStack.top()?.Enter()
        }
    }

    public applyForceX(force: number): void {
        this.setVelocityX(force)
    }

    public flipPlayerLeft(): void {
        this.flipX = true
        this.isFacingLeft = true
    }

    public flipPlayerRight(): void {
        this.flipX = false
        this.isFacingLeft = false
    }

    update() {
        this.updateFlags()
        this.playerStateStack.top()?.Update()
    }

    public persistenceForce(): void {
        if (this.isFacingLeft) {
            this.applyForceX(-0.00000001)
        } else if (!this.isFacingLeft) {
            this.applyForceX(0.00000001)
        }
    }
    private updateFlags(): void {
        if (this.body?.blocked.down) {
            this.isGrounded = true
        } else {
            this.isGrounded = false
        }

        this.timeToCheckTouchWall += 1
        if (this.timeToCheckTouchWall >= TIME_TO_CHECK_TOUCH_WALL) {
            this.timeToCheckTouchWall = 0

            if (this.body?.blocked.left) {
                this.isTouchingWall = true
                this.isTouchingWallLeft = true
            } else if (this.body?.blocked.right) {
                this.isTouchingWall = true
                this.isTouchingWallLeft = false
            } else {
                this.isTouchingWall = false
            }
        }
    }
}
