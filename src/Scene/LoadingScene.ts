import { spriteObj, virtualGuySpriteObj } from '../Constant/AssetKey'
import { depthLayer } from '../Constant/DepthLayer'
import { sceneKey } from '../Constant/SceneKey'
export class LoadingScene extends Phaser.Scene {
    preload() {
        const barWidth = 500
        const barHeight = 50

        const progressBar = this.add.graphics()
        const progressBox = this.add.graphics()

        progressBox.fillStyle(0x000000, 1)
        progressBox.fillRect(
            (this.scale.canvas.width - barWidth) / 2,
            (this.scale.canvas.height - barHeight) / 2,
            barWidth,
            barHeight
        )

        this.load.on('progress', (value: number) => {
            progressBar.clear()
            progressBar.fillStyle(0xf7f7f7, 1)
            progressBar
                .fillRect(
                    (this.scale.canvas.width - barWidth) / 2,
                    (this.scale.canvas.height - barHeight) / 2,
                    barWidth * value,
                    barHeight
                )
                .setDepth(depthLayer.UI)
        })

        this.load.on('complete', () => {
            progressBar.destroy()
            progressBox.destroy()
            this.scene.start(sceneKey.LEVEL1)
        })

        this.load.spritesheet(virtualGuySpriteObj.JUMP.key, virtualGuySpriteObj.JUMP.path, {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet(
            virtualGuySpriteObj.DOUBLE_JUMP.key,
            virtualGuySpriteObj.DOUBLE_JUMP.path,
            { frameWidth: 32, frameHeight: 32 }
        )
        this.load.spritesheet(
            virtualGuySpriteObj.WALL_JUMP.key,
            virtualGuySpriteObj.WALL_JUMP.path,
            { frameWidth: 32, frameHeight: 32 }
        )
        this.load.spritesheet(virtualGuySpriteObj.FALL.key, virtualGuySpriteObj.FALL.path, {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet(virtualGuySpriteObj.HIT.key, virtualGuySpriteObj.HIT.path, {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet(virtualGuySpriteObj.IDLE.key, virtualGuySpriteObj.IDLE.path, {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.spritesheet(virtualGuySpriteObj.RUN.key, virtualGuySpriteObj.RUN.path, {
            frameWidth: 32,
            frameHeight: 32,
        })

        this.load.image(spriteObj.BASE_TERRAIN.key, spriteObj.BASE_TERRAIN.path)
        this.load.image(spriteObj.BASE_BACKGROUND_BROWN.key, spriteObj.BASE_BACKGROUND_BROWN.path)
        this.load.image(spriteObj.BASE_BACKGROUND_BLUE.key, spriteObj.BASE_BACKGROUND_BLUE.path)
        this.load.image(spriteObj.BASE_BACKGROUND_GRAY.key, spriteObj.BASE_BACKGROUND_GRAY.path)
        this.load.image(spriteObj.BASE_BACKGROUND_GREEN.key, spriteObj.BASE_BACKGROUND_GREEN.path)
        this.load.image(spriteObj.BASE_BACKGROUND_PURPLE.key, spriteObj.BASE_BACKGROUND_PURPLE.path)
        this.load.image(spriteObj.BASE_BACKGROUND_YELLOW.key, spriteObj.BASE_BACKGROUND_YELLOW.path)
        this.load.image(spriteObj.BASE_BACKGROUND_PINK.key, spriteObj.BASE_BACKGROUND_PINK.path)
    }
}