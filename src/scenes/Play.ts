import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;

  starfield?: Phaser.GameObjects.TileSprite;
  spinner?: Phaser.GameObjects.Shape;
  spaceship?: Phaser.GameObjects.Graphics;

  rotationSpeed = Phaser.Math.PI2 / 1000; // radians per millisecond

  isLaunching: boolean = false;
  spaceshipSpeed: number = 5;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.spinner = this.add.rectangle(100, 100, 50, 50, 0xff0000);
    this.spaceship = this.add.graphics({
      x: (this.game.config.width as number) / 2,
      y: (this.game.config.height as number) - 30,
    });
    this.spaceship.fillStyle(0xff0000);
    this.spaceship.fillTriangle(-10, 10, 10, 10, 0, -10);
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;

    if (this.left!.isDown) {
      this.spinner!.rotation -= delta * this.rotationSpeed;
    }
    if (this.right!.isDown) {
      this.spinner!.rotation += delta * this.rotationSpeed;
    }

    if (this.fire!.isDown) {
      this.tweens.add({
        targets: this.spinner,
        scale: { from: 1.5, to: 1 },
        duration: 300,
        ease: Phaser.Math.Easing.Sine.Out,
      });
    }

    if (!this.isLaunching) {
      if (this.left!.isDown) {
        this.spaceship!.x -= this.spaceshipSpeed;
      }
      if (this.right!.isDown) {
        this.spaceship!.x += this.spaceshipSpeed;
      }
    }
    if (this.fire!.isDown && !this.isLaunching) {
      this.isLaunching = true;

      this.tweens.add({
        targets: this.spaceship,
        y: 0,
        duration: 2000,
        ease: Phaser.Math.Easing.Sine.Out,
        onComplete: () => {
          this.isLaunching = false;
          this.spaceship!.y = (this.game.config.height as number) - 30;
        },
      });
    }
  }
}
