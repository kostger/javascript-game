const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const coinsElement = document.querySelector("#coin-text");

canvas.width = 800;
canvas.height = 600;

const plants = [];
const zombies =[];
const plantImage = new Image();
plantImage.src = '../assets/plant.png';
const projectileImage = new Image();
projectileImage.src = '../assets/projectile.png';

// MAP DRAWING
function drawBackground() {
    ctx.fillStyle = "#32a852";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
const grid = {
    rows: 5,
    columns: 9,
    cellWidth: 80,
    cellHeight: 120,
};
function drawGrid() {
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.columns; col++) {
            ctx.strokeStyle = "#000";
            ctx.strokeRect(col * grid.cellWidth, row * grid.cellHeight, grid.cellWidth, grid.cellHeight);
        }
    }
}



//CLASSES
class Plant {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = grid.cellWidth;
        this.height = grid.cellHeight;
        this.health = 100;
        this.projectiles = [];

        // Shoot projectiles every 2 seconds
        this.shootInterval = setInterval(() => {
            this.shoot();
        }, 2000);
    }

    shoot() {
        const projectile = new Projectile(this.x + this.width, this.y + this.height / 2 - 10);
        this.projectiles.push(projectile);
    }

    update() {
        this.projectiles.forEach((projectile, index) => {
            projectile.move();
            projectile.draw();

            // Remove if it goes off-screen
            if (projectile.x > canvas.width) {
                this.projectiles.splice(index, 1);
            }
        });
    }

    draw() {
        ctx.fillStyle = 'green';
        ctx.drawImage(plantImage,this.x, this.y, this.width, this.height);
    }

    // Clear the shooting interval if plant is destroyed
    destroy() {
        clearInterval(this.shootInterval);
    }
}
class Projectile{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 1;
    }
    move(){
        this.x += this.speed;
    }
    draw(){
        ctx.fillStyle ='purple';
        ctx.drawImage(projectileImage,this.x,this.y,this.width,this.height);
    }
}
class Zombie {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = grid.cellWidth;
        this.height = grid.cellHeight;
        this.health = 100; // Zombie health
        this.speed = 1; // Zombie movement speed
    }

    move() {
        this.x -= this.speed;
    }

    draw() {
        ctx.fillStyle = "brown";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
class Game{
    constructor(){
        this.coins = 0;
    }
    giveCoins(){
        this.coins += 100;
        this.updateCoinDisplay();
    }
    deductCoins(amount){
        this.coins -= amount;
        this.updateCoinDisplay();
    }
    updateCoinDisplay() {
        coinsElement.textContent = this.coins;
    }

}


//LISTENERS
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const gridX = Math.floor(mouseX / grid.cellWidth) * grid.cellWidth;
    const gridY = Math.floor(mouseY / grid.cellHeight) * grid.cellHeight;

    // Place a new plant if there's not already one at the clicked position
    if(game.coins >= 200 ){
        game.deductCoins(200); 
        plants.push(new Plant(gridX, gridY));
}
});

//COLLIDE FUNCTION
function isColliding(objectA, objectB) {
    return (
        objectA.x < objectB.x + objectB.width &&
        objectA.x + objectA.width > objectB.x &&
        objectA.y < objectB.y + objectB.height &&
        objectA.y + objectA.height > objectB.y
    );
}

//ZOMBIE SPAWNER
function spawnZombie() {
    const zombie = new Zombie(800, Math.floor(Math.random() * grid.rows) * grid.cellHeight);
    zombies.push(zombie);  // Add the new zombie to the array
}
setInterval(spawnZombie,3000);

const game = new Game();
setInterval(()=>{
    game.giveCoins();
    
},3000);

//GAME LOOP
function gameLoop() {
    drawBackground();
    drawGrid();

   
    // Update and draw plants
    plants.forEach(plant => {
        plant.draw();
        plant.update();
    });

    // Update and draw zombies
    zombies.forEach((zombie, index) => {
        zombie.move();
        zombie.draw();

        // Check for collisions with plants or projectiles
        plants.forEach(plant => {
            // Check for collisions with the plant itself
            if (isColliding(zombie, plant)) {
                console.log('Collision detected between zombie and plant!');
                zombie.speed = 0;  // Stop the zombie
                plant.health -= 10;  // Damage the plant
            }

            // Check for collisions with plant's projectiles
            plant.projectiles.forEach((projectile, projIndex) => {
                if (isColliding(zombie, projectile)) {
                    console.log('Zombie hit by projectile!');
                    zombie.health -= 20;  // Reduce zombie health
                    plant.projectiles.splice(projIndex, 1);  // Remove projectile
                }
            });
        });

        // Remove zombie if it goes off-screen or is dead
        if (zombie.x + zombie.width < 0 || zombie.health <= 0) {
            zombies.splice(index, 1);  // Remove the zombie
        }
    });

    requestAnimationFrame(gameLoop);
}

gameLoop()
