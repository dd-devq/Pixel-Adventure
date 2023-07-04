import { Player } from './Player'
import { playerAnimationKey } from '../../Constant/AnimationKey'

export class IdleState extends State<Player> {
    public Enter(): void {
        this.parent.play(playerAnimationKey.IDLE)
    }

    public Update(): void {
        //
    }

    public Exit(): void {
        this.parent.stop()
    }
}
