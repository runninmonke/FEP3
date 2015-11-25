// Enemies our player must avoid
var Enemy = function(row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.x = Math.floor(Math.random()*1500) - 900;
    this.y = row*83 - 25;
    this.speed = Math.floor(Math.random()*400) + 100;
};

Enemy.prototype.sprite = 'images/enemy-bug.png';
Enemy.prototype.collision = function(){
    if (this.x > player.x - 56 && this.x < player.x + 56 && this.y == player.y - 15) {
        return true;
    };
    return false;
};
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    this.x = this.x + this.speed*dt;
    if (this.x > 700) {
        this.x = Math.floor(Math.random()*-900) - 101;
        this.speed = Math.floor(Math.random()*400) + 100;
    }
    if (this.collision()) {
        player.speed = 1000;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var WinStar = function (x,y) {
    this.x = x;
    this.y = y;
    this.speed = 100;
    this.sprite = 'images/Star.png';
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(){
    this.reset();
    this.sprite = 'images/char-cat-girl.png';
    this.rightDelay, this.leftDelay, this.upDelay, this.downDelay = false;
};
Player.prototype.update = function(dt){
    if (this.winStar) {
        this.winStar.y = this.winStar.y - (this.winStar.speed*dt);
        if (this.winStar.y < -202) {
            delete this.winStar;
        }
    }
    if (this.y < 0) {
        this.winStar = new WinStar(this.x, this.y);
        this.reset();
    }
    if (this.speed) {
        this.x = this.x + this.speed*dt;
        if (this.x > 1000) {
            delete this.speed;
            this.reset();
        }
    }
};
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
                this.x = this.x - 101;
            }
            break;
        case 'right':
            if (this.rightDelay) {
                break;
            }
            this.rightDelay = true;
            if (this.x < (101*4)){
                this.x = this.x + 101;
            }
            break;
        case 'down':
            if (this.downDelay) {
                break;
            }
            this.downDelay = true;
            if (this.y < (83*5)-10){
                this.y = this.y + 83;
            }
            break;
        case 'up':
            if (this.upDelay) {
                break;
            }
            this.upDelay = true;
            if (this.y > 0){
                this.y = this.y - 83;
            }
            break;
    }
};

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

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    if (this.winStar) {
        ctx.drawImage(Resources.get(this.winStar.sprite), this.winStar.x, this.winStar.y);
    }
};
Player.prototype.reset = function() {
    this.y = 5*83 - 10;
    this.x = 2*101;
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();

for (var rr = 1; rr < 4; rr++) {
    for (var r = 6; r > rr; r--) {
        allEnemies.push(new Enemy(rr));
    }
}


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.keyDepress(allowedKeys[e.keyCode]);
});
