import { Player } from './Player'
import { playerAnimationKey } from '../../Constant/AnimationKey'
import { State } from './State'

export class HitState extends State<Player> {
    public Enter(): void {
        this.parent.play(playerAnimationKey.HIT)
    }

    public Update(): void {
        // Reduce HP
    }

    public Exit(): void {
        this.parent.stop()
    }
}