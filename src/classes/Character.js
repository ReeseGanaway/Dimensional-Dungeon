export class Character {
  step = 0;
  waiting = false;

  constructor(hero) {
    this.id = hero.id;
    this.name = hero.name;
    this.spriteSheet = new Image();
    this.spriteSheet.src = hero.spriteSheet;
    this.icon = hero.icon;
    this.position = hero.position;
    this.previousPosition = { ...hero.position };
    this.used = hero.used;
    this.maxStats = { ...hero.maxStats };
    this.currentStats = { ...hero.currentStats };
  }

  draw() {
    if (!this.spriteSheet.complete) {
      this.spriteSheet.onload = () => {
        this.checkDirection();
      };
    } else {
      this.checkDirection();
    }
  }

  checkDirection() {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    if (this.used) {
      context.filter = "grayscale(1)";
    }

    switch (this.position.dir) {
      case "down":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            0,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            0,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            0,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        }
        break;
      case "up":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            144,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            144,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            144,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        }
        break;
      case "left":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            48,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            48,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            48,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        }
        break;
      case "right":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            96,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            96,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            96,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        }
        break;
    }
    context.filter = "grayscale(0)";
  }

  drawAttack(attackPosition, direction) {
    let attackCanvas = document.getElementById("attack-canvas");
    let context = attackCanvas.getContext("2d");
    //context.clearRect(0, 0, attackCanvas.width, attackCanvas.height);

    switch (direction) {
      case "right":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            96,
            48,
            48,
            attackPosition.x,
            attackPosition.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            96,
            48,
            48,
            attackPosition.x,
            attackPosition.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            96,
            48,
            48,
            attackPosition.x,
            attackPosition.y,
            48,
            48
          );
        }
        this.updatePos(this.position.x + 1, this.position.y);
        break;
      case "left":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            48,
            48,
            48,
            attackPosition.x,
            attackPosition.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            48,
            48,
            48,
            attackPosition.x,
            attackPosition.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            48,
            48,
            48,
            attackPosition.x,
            attackPosition.y,
            48,
            48
          );
        }
        this.updatePos(this.position.x + 1, this.position.y);
        break;
    }
  }

  //update the characters current position
  updatePos(newX, newY) {
    this.position.x = newX;
    this.position.y = newY;
    if (this.step === 47) {
      this.step = 0;
    } else {
      this.step++;
    }
  }

  //update the characters previous position
  updatePrevPos(newX, newY, newDir) {
    this.previousPosition.x = newX;
    this.previousPosition.y = newY;
    this.previousPosition.dir = newDir;
  }

  revertPos() {
    this.position = { ...this.previousPosition };
  }

  setDirection(dir) {
    this.position.dir = dir;
  }

  toggleUsed() {
    this.used = !this.used;
  }

  toggleWaiting() {
    this.waiting = !this.waiting;
  }

  draw2() {
    if (!this.spriteSheet.complete) {
      this.spriteSheet.onload = () => {
        this.checkDirection2();
      };
    } else {
      this.checkDirection2();
    }
  }

  checkDirection2() {
    let canvas = document.getElementById("attack-canvas");
    let context = canvas.getContext("2d");
    // context.clearRect(0, 0, canvas.width, canvas.height);

    switch (this.position.dir) {
      case "down":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            0,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            0,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            0,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        }
        break;
      case "up":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            144,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            144,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            144,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        }
        break;
      case "left":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            48,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            48,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            48,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        }
        break;
      case "right":
        if (this.step > 0 && this.step < 24) {
          context.drawImage(
            this.spriteSheet,
            0,
            96,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step >= 24 && this.step < 48) {
          context.drawImage(
            this.spriteSheet,
            96,
            96,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        } else if (this.step === 0) {
          context.drawImage(
            this.spriteSheet,
            48,
            96,
            48,
            48,
            this.position.x,
            this.position.y,
            48,
            48
          );
        }
        break;
    }
  }
}
