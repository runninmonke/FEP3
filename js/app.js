// Effective width and height of the game map tiles.
// Most frequently used for positioning entities
// usually with a small offset based on what looks best.
var ROW_HEIGHT = 83;
var COLUMN_WIDTH = 101;

// Enemy class. Initialize at a randomized x position and speed.
// Parameter: row, the row the enemy should be located in.
var Enemy = function(row) {
    this.x = Math.floor(Math.random()*1500) - 900;
    this.y = row*ROW_HEIGHT - 25;
    this.speed = Math.floor(Math.random()*400) + 100;
};

//Image file for enemy character
Enemy.prototype.sprite = 'images/enemy-bug.png';

//Return whether or not the enemy has collided with the player
Enemy.prototype.collision = function(){
    if (this.x > player.x - 56 && this.x < player.x + 56 && this.y == player.y - 15) {
        return true;
    };
    return false;
};

// Update the enemy's position. Re-initialize enemy position and speed if
// they have traveled far enough off canvas. New position and speed randomized
// to limit predicability and randomize time of re-entry to canvas.
// Also imparts an animation to the player if a collision is detected.
// Parameter: dt, a time delta between ticks from engine.js to provide smooth animation
// used in the same manner in the other update functions
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed*dt;
    if (this.x > 700) {
        this.x = Math.floor(Math.random()*-900) - COLUMN_WIDTH;
        this.speed = Math.floor(Math.random()*400) + 100;
    }
    if (this.collision()) {
        player.speed = 1000;
    }
};

// Draw the enemy image on the screen using ctx from engine.js
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Class for animated stars that appear when player reaches water. They get created
// in player.winStars array with an index that corelates to the column they occupy.
// Parameters: x & y, position coordinates for the winStar to be created at.
var WinStar = function(x,y) {
    this.x = x;
    this.y = y;
    this.speed = 100;
    this.sprite = 'images/Star.png';
};

// Animates winStar. Animation changes if victory conditions are met.
WinStar.prototype.update = function(dt) {
    var lowerBound = window.victoryConditionsMet ? (5*ROW_HEIGHT + 50) : 0;
    this.y = this.y - (this.speed*dt);
    if (this.y < -ROW_HEIGHT) {
        this.speed *= -1;
    }
    else if (this.y > lowerBound) {
        this.speed *= -1;
    }
};

// Draw the winStar on the screen using ctx from engine.js
WinStar.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class. Includes properties and methods for responding to
// user input appropriately and handling winStars.
var Player = function(){
    this.reset();
    this.sprite = 'images/char-cat-girl.png';
    this.rightDelay, this.leftDelay, this.upDelay, this.downDelay = false;
    this.winStars = [null, null, null, null, null];
};

// Handle property updating not directly related to user input.
Player.prototype.update = function(dt){

    // winStar animation and check for victory
    var victory = true;
    this.winStars.forEach(function(star, i, stars) {
        if (star) {
            star.update(dt);
        } else {
            victory = false;
        }
    })
    if (victory) {
        win();
    }

    // winStar creation
    if (this.y < 0) {
        this.winStars[(this.x == 0) ? 0 : (this.x/COLUMN_WIDTH)] = new WinStar(this.x, this.y);

        this.reset();
    }

    // Collision animation
    if (this.speed) {
        this.x = this.x + this.speed*dt;
        if (this.x > 1000) {
            delete this.speed;
            this.reset();
        }
    }
};

// Move the player if an input key is pressed, but only if that key has been depressed
// since last input and the player is not undergoing a collision animation
// Parameter: dir, value of key that has been pressed
Player.prototype.handleInput = function(dir){
    if (this.speed) {
        return;
    }
    switch(dir) {
        case 'left':
            if (this.leftDelay) {
                break;
            }
            this.leftDelay = true;
            if (this.x > 0){
                this.x = this.x - COLUMN_WIDTH;
            }
            break;
        case 'right':
            if (this.rightDelay) {
                break;
            }
            this.rightDelay = true;
            if (this.x < (COLUMN_WIDTH*4)){
                this.x = this.x + COLUMN_WIDTH;
            }
            break;
        case 'down':
            if (this.downDelay) {
                break;
            }
            this.downDelay = true;
            if (this.y < (ROW_HEIGHT*5)-10){
                this.y = this.y + ROW_HEIGHT;
            }
            break;
        case 'up':
            if (this.upDelay) {
                break;
            }
            this.upDelay = true;
            if (this.y > 0){
                this.y = this.y - ROW_HEIGHT;
            }
            break;
    }
};

// Keep track of when an input key has been depressed
// Parameter: key, value of key that was depressed
Player.prototype.keyDepress = function(key){
    switch(key) {
        case 'left':
            this.leftDelay = false;
            break;
        case 'right':
            this.rightDelay = false;
            break;
        case 'down':
            this.downDelay = false;
            break;
        case 'up':
            this.upDelay = false;
            break;
    }
};

// Draw the images for the player and any existing winStars
Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.winStars.forEach(function(star, i, stars) {
        if (star) {
            star.render();
        }
    });
};

// Reset the player to the starting position
Player.prototype.reset = function() {
    this.y = 5*ROW_HEIGHT - 10;
    this.x = 2*COLUMN_WIDTH;
};

// Trigger victory animation. A global variable used to trigger the victory
// animation because part of it is accomplished by a conditional hack coded
// into the render() method in engine.js since that method is inaccessible here.
var win = function() {
    // Player would still be rendered with hack if not repositioned.
    player.y = 1500;
    player.x = -1500;
    window.victoryConditionsMet = true;
};

// Instantiate enemy objects in an array and the player object
var allEnemies = [];
var player = new Player();

// Populate the enemies. Loops result in rows with 5, 4, and 3 enemies.
for (var row = 1; row < 4; row++) {
    for (var r = 6; r > row; r--) {
        allEnemies.push(new Enemy(row));
    }
}


// Listen for key presses and send to player.handleInput()
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Listen for key depressed and send to player.keyDepress()
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.keyDepress(allowedKeys[e.keyCode]);
});