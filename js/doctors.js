const projectileImage = new Image();
projectileImage.src = '../assets/syringe.png';
projectileImage.style.transform = 'rotate(90deg)';

var shootSound = new Audio('../assets/shoot.mp3');
shootSound.volume = 0.2;
const spriteWidth = 37.7;
const spriteHeight = 46;

export class Doctor {
    constructor(x, y,ctx,grid,canvas,health,isShooting,img) {
        this.x = x;
        this.y = y;
        this.width = grid.cellWidth;
        this.height = grid.cellHeight;
        this.isShooting = isShooting;
        this.health = health;
        this.projectiles = [];
        this.ctx = ctx;
        this.grid = grid;
        this.canvas = canvas;
        this.frameX = 0;
        this.frameY = 1;
        this.gameFrame = 0;
        this.staggerFrames = 20;
        this.img = img;
        // Shoot projectiles every 2 seconds
        this.shootInterval = setInterval(() => {
            this.shoot();
        }, 2000);
    }

    shoot() {
        if(this.isShooting){
            const projectile = new Projectile(this.x + this.width, this.y + this.height / 2 - 10,this.ctx);
            this.projectiles.push(projectile);
            shootSound.play();
        }
        else{

            clearInterval(this.shootInterval);
        }
        
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
        if(this.isShooting){
            this.ctx.drawImage(this.img,spriteWidth*this.frameX,70,spriteWidth,spriteHeight,this.x, this.y, this.width, this.height);
            //something is not working properly here check later
            if(this.gameFrame % this.staggerFrames === 0){
                if(this.frameX < 4)this.frameX++;
                else this.frameX = 0;
            }
            this.gameFrame++;
            requestAnimationFrame(this.draw);
        }
        else{
            this.ctx.drawImage(this.img,this.x, this.y, this.width, this.height)
        }
        
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