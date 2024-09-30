const plantImage = new Image();
plantImage.src = '../assets/doctor.png';


const projectileImage = new Image();
projectileImage.src = '../assets/syringe.png';
projectileImage.style.transform = 'rotate(90deg)';

const spriteWidth = 37.7;
const spriteHeight = 46;

export class Plant {
    constructor(x, y,ctx,grid,canvas) {
        this.x = x;
        this.y = y;
        this.width = grid.cellWidth;
        this.height = grid.cellHeight;
        this.health = 100;
        this.projectiles = [];
        this.ctx = ctx;
        this.grid = grid;
        this.canvas = canvas;
        this.frameX = 0;
        this.frameY = 1;
        this.gameFrame = 0;
        this.staggerFrames = 20;
        // Shoot projectiles every 2 seconds
        this.shootInterval = setInterval(() => {
            this.shoot();
        }, 2000);
    }

    shoot() {
        const projectile = new Projectile(this.x + this.width, this.y + this.height / 2 - 10,this.ctx);
        this.projectiles.push(projectile);
    }

    update() {
        this.projectiles.forEach((projectile, index) => {
            projectile.move();
            projectile.draw();

            // Remove if it goes off-screen
            if (projectile.x > this.canvas.width) {
                this.projectiles.splice(index, 1);
            }
        });
    }

    draw() {
    
        this.ctx.drawImage(plantImage,spriteWidth*this.frameX,70,spriteWidth,spriteHeight,this.x, this.y, this.width, this.height);
        //something is not working properly here check later
        if(this.gameFrame % this.staggerFrames === 0){
            if(this.frameX < 4)this.frameX++;
            else this.frameX = 0;
        }
        this.gameFrame++;
        requestAnimationFrame(this.draw);
    }

    // Clear the shooting interval if plant is destroyed
    destroy() {
        clearInterval(this.shootInterval);
    }
}
export class Projectile{
    constructor(x,y,ctx){
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 3;
        this.ctx = ctx;
    }
    move(){
        this.x += this.speed;
    }
    draw(){
        this.ctx.fillStyle ='purple';
        this.ctx.drawImage(projectileImage,this.x,this.y,this.width,this.height);
    }
}