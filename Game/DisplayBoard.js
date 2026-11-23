// Manages the display of score, lives, and game over screen with a neon restart button
class DisplayBoard {
    constructor(frameX, frameY, width, height, game) {
        // init properties
        this.frameX = frameX;
        this.frameY = frameY;
        this.width = width;
        this.height = height;
        this.game = game;
        this.offSet = 50;
        this.button = {
            x: this.frameX + this.width / 2 - 50,
            y: this.frameY + this.height / 2 + 80,
            width: 100,
            height: 40
        };
    }

    drawScoreFrame(score) {
        const scoreX = this.frameX - 130; // 130 pixels from the right
        const scoreY = this.frameY;
        const scoreWidth = 100;
        const scoreHeight = 60;
        // draw neon frame
        drawNeonFrame(scoreX, scoreY, scoreWidth, scoreHeight, [0, 255, 0]);
        push();
        textAlign(CENTER, CENTER);
        textSize(16);
        fill(255);
        // display static Score string
        text("Score", scoreX + scoreWidth / 2, scoreY + scoreHeight / 3);
        // display dynamic score value
        text(Math.floor(score), scoreX + scoreWidth / 2, scoreY + 2 * scoreHeight / 3);
        pop();
    }

    drawLivesFrame(lives) {
        const livesX = this.frameX - 110;
        const livesY = this.frameY + 90;
        const livesWidth = 80;
        const livesHeight = 35;
        // draw neon frame
        drawNeonFrame(livesX, livesY, livesWidth, livesHeight, [255, 0, 0]);
        push();
        translate(livesX + 12, livesY + 15);
        scale(0.7);
        // red heart
        translate(10, 0);
        if (lives.red) fill(255, 0, 0); else noFill();
        stroke(255, 0, 0);
        strokeWeight(2);
        this.drawHeart();
        // green heart
        translate(30, 0);
        if (lives.green) fill(0, 255, 0); else noFill();
        stroke(0, 255, 0);
        this.drawHeart();
        translate(30, 0);
        // blue heart
        if (lives.blue) fill(0, 0, 255); else noFill();
        stroke(0, 0, 255);
        this.drawHeart();
        pop();
    }

    displayGameOver(score) {
        push();
        translate(this.frameX, this.frameY - this.offSet);
        textAlign(CENTER, CENTER);

        // Display GAME OVER text
        stroke(255);
        strokeWeight(2);
        textSize(40);
        text("GAME OVER", this.width / 2, this.height / 2);

        // Display final score
        strokeWeight(1);
        textSize(20);
        text(`Final Score: ${Math.floor(score)}`, this.width / 2, this.height / 2 + 40);

        // White neon restart button
        drawNeonFrame(
            this.button.x - this.frameX,
            this.button.y - this.frameY,
            this.button.width,
            this.button.height,
            [255, 255, 255]
        );
        noStroke();
        fill(255);
        textSize(16);
        text("Restart", this.width / 2, this.height / 2 + 100);
        pop();
    }

    isRestartClicked(mouseX, mouseY) {
        // check if the mouse is within the restart button
        return (
            mouseX > this.button.x &&
            mouseX < this.button.x + this.button.width &&
            mouseY > this.button.y - this.offSet &&
            mouseY < this.button.y + this.button.height - this.offSet
        );
    }

    drawHeart() {
        // draw heart shape by vertex
        beginShape();
        vertex(0, 10);
        vertex(-6, 6);
        vertex(-9, 2);
        vertex(-9, -2);
        vertex(-6, -6);
        vertex(0, -4);
        vertex(6, -6);
        vertex(9, -2);
        vertex(9, 2);
        vertex(6, 6);
        endShape(CLOSE);
    }

}
