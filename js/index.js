import { Plant } from "./plants.js";
const virusImage = new Image();
virusImage.src = '../assets/Enemy1.png';

const virusAltImage = new Image();
virusAltImage.src = '../assets/Enemy2.png';

const plantImage = new Image();
plantImage.src = '../assets/doctor.png';

const potatoImage = new Image();
potatoImage.src = '../assets/potato.png';

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const coinsElement = document.querySelector("#coin-text");
const playButton = document.querySelector('#play-button');
const gameIntro = document.querySelector('#game-intro');
const gameContainer = document.querySelector('#game-container');
const gameEnd = document.querySelector('#game-end');
const livesContainer = document.querySelector('#lives-text')
const restartButton = document.querySelector('#restart-button');
const waveContainer = document.querySelector('#wave-text');
const countDowntext = document.querySelector('#countdown-text');
const freezeButton = document.querySelector('#freeze-button');
const doctorButton = document.querySelector('#doctor-button');
const potatoButton = document.querySelector('#potato-button');
const charSelectorContainer = document.querySelector('#character-selection-container');
const doctorText = document.querySelector('#doctor-text');
const potatoText = document.querySelector('#potato-text');



canvas.width = 800;
canvas.height = 600;

const plants = [];
const zombies =[];

let charSelected = 'doctor';



// MAP DRAWING
function drawBackground() {
    ctx.fillStyle = "#a7ced6";
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


class Zombie {
    constructor(x, y,health,img) {
        this.x = x;
        this.y = y;
        this.width = grid.cellWidth;
        this.height = grid.cellHeight;
        this.health = health; // Zombie health
        this.speed = 1; // Zombie movement speed
        this.img = img;
    }

    move() {
        this.x -= this.speed;
    }

    draw() {
        // ctx.fillStyle = "brown";
        ctx.drawImage(this.img,this.x, this.y, this.width, this.height);
    }
}
class Game{
    constructor(){
        this.coins = 0;
        this.lives = 5;
        this.wave = 1;
        this.zombiesPerWave = 10;
        this.zombiesRemaining = this.zombiesPerWave;
        this.zombieFrequency = 5000;
    }
    giveCoins(){
        this.coins += 100;
        this.updateCoinDisplay();
    }
    deductCoins(amount){
        this.coins -= amount;
        this.updateCoinDisplay();
    }
    reduceLives(){
        this.lives--;
        this.updateLivesDisplay();
    }
    updateCoinDisplay() {
        coinsElement.textContent = this.coins;
    }
    updateLivesDisplay(){
        livesContainer.textContent = this.lives;
    }
    updateWaveDisplay(){
        waveContainer.textContent = this.wave;
    }
    nextWave(){
        this.wave++;
    }
    spawnWave() {
        let zombieCount = 0;

        const spawnInterval = setInterval(() => {
            if (zombieCount < this.zombiesPerWave) {
                let ran = Math.floor(Math.random()*2)+1;
                spawnZombie(ran === 1? 100+(this.wave*100): 100+(this.wave*50),ran === 1? virusImage:virusAltImage);  // Spawn a zombie
                zombieCount += 1;
            } else {
                clearInterval(spawnInterval);  // Stop spawning once wave zombies are spawned
                this.nextWave();
            }
        }, this.zombieFrequency);  // Spawn a zombie every 1 second
    }
    nextWave() {
        countDowntext.style.display = 'flex';
        setTimeout(() => {
            countDowntext.style.display = 'none'; // Change display back to none
        }, 3000);
        this.wave += 1;
        this.zombiesPerWave += 10;  // Increase number of zombies for the next wave
        this.zombieFrequency = this.zombieFrequency/2;
        this.zombiesRemaining = this.zombiesPerWave;
        this.updateWaveDisplay();
        this.spawnWave();
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
    const plantExists = plants.some(plant => plant.x === gridX && plant.y === gridY);
    let health;
    let isShooting;
    let image;
    if(charSelected === 'doctor'){
        //doctor chars
        health = 100;
        isShooting = true;
        image = plantImage;

    }
    if(charSelected === 'potato'){
        //potato stats
        health = 700;
        isShooting = false;
        image = potatoImage;

    }
   console.log(health,isShooting)
    if (!plantExists) {
        if(game.coins >= 200) {
            game.deductCoins(200); 
            plants.push(new Plant(gridX, gridY, ctx, grid, canvas,health,isShooting,image));
        } else {
            console.log("Not enough coins to plant.");
        }
    } else {
        console.log("A plant already exists at this position.");
    }
});

playButton.addEventListener("click",()=>{
    gameIntro.style.display = 'none';
    gameContainer.style.display = 'flex';
    charSelectorContainer.style.display = 'flex';
    gameLoop();
})

restartButton.addEventListener('click',()=>location.reload());

freezeButton.addEventListener('click',()=>{
    zombies.forEach((zombie)=>{
        zombie.speed = 0.05;
        setTimeout(()=>{
            zombie.speed = 1;
        },3000);
    })
    startCooldown(freezeButton);
}
);

doctorButton.addEventListener('click',()=>{
    doctorButton.style.backgroundColor = '#04ca01';
    doctorText.style.color = '#fff';
    potatoText.style.color = '#04ca01';
    potatoButton.style.backgroundColor = '#fff';

    charSelected ='doctor'
});
potatoButton.addEventListener('click',()=>{
    potatoButton.style.backgroundColor = '#04ca01';
    potatoText.style.color = '#fff';
    doctorText.style.color = '#04ca01';
    doctorButton.style.backgroundColor = '#fff';
    charSelected ='potato'
});

function startCooldown(element){
    element.disabled = true;
    element.style.backgroundColor = 'gray';
    setTimeout(() => {
        element.disabled=false;
        element.style.backgroundColor = 'aqua';
    },10000);
}

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
function spawnZombie(health,img) {
    const zombie = new Zombie(800, Math.floor(Math.random() * grid.rows) * grid.cellHeight,health,img);
    zombies.push(zombie);  // Add the new zombie to the array
}


const game = new Game();
setInterval(()=>{
    game.giveCoins();
    
},3000);

//GAME LOOP
function gameLoop() {
    drawBackground();
    drawGrid();

    // console.log(plants);
    // console.log(zombies);
    // Update and draw plants
    plants.forEach((plant,plantIndex) => {
        plant.draw();
        plant.update();
 
    });

    // Update, draw zombies and check for all collisions 
    zombies.forEach((zombie, index) => {
        zombie.move();
        zombie.draw();

        // Check for collisions with plants or projectiles
        plants.forEach((plant,plantIndex) => {
            // Check for collisions with the plant itself
            if (isColliding(zombie, plant)) {
                console.log('Collision detected between zombie and plant!'); //Here we want the zombie to eat the plant slowly
                zombie.speed = 0;                                           // Stop the zombie
                plant.health -= 1;                                         // Damage the plant
                if(plant.health <= 0){
                    plants.splice(plantIndex,1);
                    zombie.speed = 1;
                }  
            }

            // Check for collisions with plant's projectiles
            plant.projectiles.forEach((projectile, projIndex) => {
                if (isColliding(zombie, projectile)) {
                    console.log('Zombie hit by projectile!');                   
                    zombie.health -= 50;                                    // Reduce zombie health
                    plant.projectiles.splice(projIndex, 1);                 // Remove projectile
                }
                //If projectile goes off-screen we remove it
                if(projectile.x > 900){ 
                    plant.projectiles.splice(projIndex, 1);
                }
            });
        });

        // Remove zombie if it goes off-screen and reduce lives by 1
        if (zombie.x + zombie.width < 0 ) {
            zombies.splice(index, 1);// Remove the zombie
            game.reduceLives();
        }
        // Remove zombie if it died
        if(zombie.health <= 0){
            zombies.splice(index, 1);// Remove the zombie
            
        }
        
    });
    if(game.lives>0){
        requestAnimationFrame(gameLoop);//the actual loop so the animation is possible
    }
    else{
        charSelectorContainer.style.display = 'none';
        gameContainer.style.display='none';
        gameEnd.style.display='flex';
    }                                   
}

game.spawnWave();
