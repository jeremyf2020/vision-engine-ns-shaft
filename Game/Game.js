// Manages the overall game state and rendering
class Game {
    constructor() {
        // size
        this.width = 320;
        this.height = 500;
        this.frameX = (window.innerWidth - this.width) / 2;
        this.frameY = (window.innerHeight - this.height) / 2 + 20;
        // having it's own detector aviod the other webcam's preload functions
        this.detector = new objectdetect.detector(160, 120, 1.1, objectdetect.frontalface);

        // game status
        this.player = new Player(this.width / 2, this.height / 4, 30);
        this.platforms = [];
        this.score = 0;
        this.gameSpeed = 1;
        this.platformGap = 100;
        this.gameOverFlag = false;
        this.frozen = false;

        // drawing the status display borad
        this.displayBoard = new DisplayBoard(this.frameX, this.frameY, this.width, this.height, this);
        // it's own webcam, diff from webcam, less compution 
        this.webcam = new WebcamDisplay(this.frameX, this.frameY, video, this.detector);

        // generate platforms
        for (let y = this.height; y > -this.platformGap; y -= this.platformGap) {
            this.spawnPlatform(y);
        }
    }

    draw() {
        // check if game is frozen (only when game over) 1/3/2025 [TODO: pasue button?]
        if (!this.frozen) {
            this.webcam.update();
            this.gameSpeed += 0.0005;
            this.player.update(this.platforms, this.webcam.getDetections());
            this.updatePlatforms();

            // Check for game over condition without stopping the loop
            if (this.player.isGameOver(this.height)) {
                this.frozen = true; // Freeze game logic
                this.gameOverFlag = true; // Set flag for rendering
            }
        }

        push();
        translate(this.frameX, this.frameY);
        // draw the game
        if (this.webcam.getDetections().length > 0) {
            this.drawGameArea();
        } else {
            fill(0);
            noStroke();
            rect(0, 0, this.width, this.height);
        }
        this.drawSpikes();
        this.player.display();
        // if not detected, platform turn to neon platform
        let faceDetected = this.webcam.getDetections().length > 0;
        for (let platform of this.platforms) {
            platform.display(faceDetected);
        }
        pop();

        // drawing display board
        this.displayBoard.drawScoreFrame(this.score);
        this.displayBoard.drawLivesFrame(this.player.lives);
        // display filtered image depending on player's lives (hearts)
        this.webcam.display(this.player.lives);

        // Display game over screen if frozen and game is over
        if (this.gameOverFlag && this.frozen) {
            this.displayBoard.displayGameOver(this.score);
        }
    }

    spawnPlatform(y) {
        // Spawns a new platform at specified y position, ensuring no overlaps
        let attempts = 0;
        let newPlatform;
        let overlapping;

        do {
            newPlatform = new Platform(random(0, this.width - 80), y);
            // check overlapp
            overlapping = false;
            for (let platform of this.platforms) {
                if (abs(platform.y - newPlatform.y) < newPlatform.height + 5 &&
                    newPlatform.x < platform.x + platform.width &&
                    newPlatform.x + newPlatform.width > platform.x) {
                    overlapping = true;
                    break;
                }
            }
            attempts++;
            // aviod over looping
            if (attempts > 100) return;
        } while (overlapping);

        this.platforms.push(newPlatform);
    }

    // Updates platform positions and manages spawning/removal
    updatePlatforms() {
        // not doing anything if frozen
        if (this.frozen) {
            return
        }
        // check platfrom off screen loop
        for (let i = this.platforms.length - 1; i >= 0; i--) {
            this.platforms[i].update(this.gameSpeed);
            if (this.platforms[i].isOffScreen()) {
                this.platforms.splice(i, 1);
                this.score += 1;
            }
        }
        // span new if needed
        if (this.platforms.length === 0 || this.platforms[this.platforms.length - 1].y < this.height - this.platformGap) {
            this.spawnPlatform(this.height);
        }
    }

    // render spikes on the top
    drawSpikes() {
        fill(100);
        noStroke();
        for (let x = 1; x < this.width - 4; x += 15) {
            triangle(x, 2, x + 10, 20, x + 20, 2);
        }
    }

    drawGameArea() {
        drawNeonFrame(0, 0, this.width, this.height, [0, 255, 255]);
    }

    reset() {
        this.player = new Player(this.width / 2, this.height / 4, 30);
        this.platforms = [];

        // reset all the status (e.g. restart)
        this.score = 0;
        this.gameSpeed = 1;
        this.gameOverFlag = false;
        this.frozen = false;
        for (let y = this.height; y > -this.platformGap; y -= this.platformGap) {
            this.spawnPlatform(y);
        }
    }
}